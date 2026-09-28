import { DigitalTwinData, DigitalTwinHold, DigitalTwinBatch, DigitalTwinSensors, DigitalTwinEvent } from '../types/digitalTwin';
import { FALLBACK_DIGITAL_TWIN } from './fallbackData';

const API_HOST = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = `${API_HOST}/api/v1`;

const getHeaders = () => {
  const token = localStorage.getItem('istelx_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Response is not JSON');
  }
  const text = await res.text();
  if (!text || !text.trim()) {
    throw new Error('Empty response');
  }
  return JSON.parse(text) as T;
}

export const digitalTwinService = {
  // Get complete digital twin data
  async getShipmentDigitalTwin(shipmentIdentifier: string | number = 'SHP-2026-0018'): Promise<DigitalTwinData> {
    try {
      return await safeFetch(`${API_BASE}/shipments/${shipmentIdentifier}/digital-twin`, {
        headers: getHeaders()
      });
    } catch {
      return FALLBACK_DIGITAL_TWIN;
    }
  },

  // Cargo summary & batches
  async getShipmentCargo(shipmentIdentifier: string | number): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/shipments/${shipmentIdentifier}/cargo`, {
        headers: getHeaders()
      });
    } catch {
      return {
        shipment_code: 'SHP-2026-0018',
        batches: FALLBACK_DIGITAL_TWIN.batches,
        total_quantity_mt: 78500
      };
    }
  },

  // Holds
  async getShipmentHolds(shipmentIdentifier: string | number): Promise<DigitalTwinHold[]> {
    try {
      return await safeFetch(`${API_BASE}/shipments/${shipmentIdentifier}/cargo/holds`, {
        headers: getHeaders()
      });
    } catch {
      return FALLBACK_DIGITAL_TWIN.holds;
    }
  },

  // Batches
  async getShipmentBatches(shipmentIdentifier: string | number): Promise<DigitalTwinBatch[]> {
    try {
      return await safeFetch(`${API_BASE}/shipments/${shipmentIdentifier}/cargo/batches`, {
        headers: getHeaders()
      });
    } catch {
      return FALLBACK_DIGITAL_TWIN.batches;
    }
  },

  // Events
  async getShipmentEvents(shipmentIdentifier: string | number): Promise<DigitalTwinEvent[]> {
    try {
      return await safeFetch(`${API_BASE}/shipments/${shipmentIdentifier}/cargo/events`, {
        headers: getHeaders()
      });
    } catch {
      return FALLBACK_DIGITAL_TWIN.events;
    }
  },

  // Sensors
  async getShipmentSensors(shipmentIdentifier: string | number): Promise<DigitalTwinSensors> {
    try {
      return await safeFetch(`${API_BASE}/shipments/${shipmentIdentifier}/sensors`, {
        headers: getHeaders()
      });
    } catch {
      return FALLBACK_DIGITAL_TWIN.sensors;
    }
  },

  // Simulations
  async startLoadingSimulation(shipmentCode: string = 'SHP-2026-0018', step?: number): Promise<any> {
    try {
      const params = new URLSearchParams({ shipment_code: shipmentCode });
      if (typeof step === 'number') {
        params.append('step', step.toString());
      }
      return await safeFetch(`${API_BASE}/demo/loading/start?${params}`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch {
      return { success: true, message: 'Loading simulation active (Fallback Mode)', status: 'LOADING' };
    }
  },

  async startDischargeSimulation(shipmentCode: string = 'SHP-2026-0018', step?: number): Promise<any> {
    try {
      const params = new URLSearchParams({ shipment_code: shipmentCode });
      if (typeof step === 'number') {
        params.append('step', step.toString());
      }
      return await safeFetch(`${API_BASE}/demo/discharge/start?${params}`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch {
      return { success: true, message: 'Discharge simulation active (Fallback Mode)', status: 'DISCHARGING' };
    }
  },

  async triggerSensorAlert(shipmentCode: string = 'SHP-2026-0018', trigger: boolean = true): Promise<any> {
    try {
      const params = new URLSearchParams({
        shipment_code: shipmentCode,
        trigger: trigger.toString()
      });
      return await safeFetch(`${API_BASE}/demo/trigger-alert?${params}`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch {
      return { success: true, message: `Sensor alert toggled: ${trigger}` };
    }
  },

  // WebSocket connection for real-time telemetry/cargo updates
  connectCargoWebSocket(shipmentIdentifier: string | number, onMessage: (data: any) => void): () => void {
    let wsUrl: string;
    const envWs = import.meta.env.VITE_WS_URL;
    if (envWs) {
      wsUrl = `${envWs.replace(/\/+$/, '')}/ws/shipments/${shipmentIdentifier}/cargo`;
    } else if (import.meta.env.VITE_API_URL) {
      const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
      const wsProtocol = apiUrl.startsWith('https:') ? 'wss:' : 'ws:';
      const wsHost = apiUrl.replace(/^https?:\/\//, '');
      wsUrl = `${wsProtocol}//${wsHost}/ws/shipments/${shipmentIdentifier}/cargo`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      wsUrl = `${protocol}//${host}/ws/shipments/${shipmentIdentifier}/cargo`;
    }

    let ws: WebSocket | null = null;
    let isClosedExplicitly = false;

    try {
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          onMessage(parsed);
        } catch {
          // non-JSON message or heartbeat
        }
      };

      ws.onerror = () => {
        // Safe polling fallback handles this
      };

      ws.onclose = () => {
        if (!isClosedExplicitly) {
          // Reconnect if needed
        }
      };
    } catch {
      // WebSocket creation failed - handled by fallback
    }

    return () => {
      isClosedExplicitly = true;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close();
      }
    };
  }
};
