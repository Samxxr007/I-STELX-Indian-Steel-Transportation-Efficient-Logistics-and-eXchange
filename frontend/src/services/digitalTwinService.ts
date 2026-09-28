import { DigitalTwinData, DigitalTwinHold, DigitalTwinBatch, DigitalTwinSensors, DigitalTwinEvent } from '../types/digitalTwin';

const API_HOST = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = `${API_HOST}/api/v1`;

const getHeaders = () => {
  const token = localStorage.getItem('istelx_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const digitalTwinService = {
  // Get complete digital twin data
  async getShipmentDigitalTwin(shipmentIdentifier: string | number = 'SHP-2026-0018'): Promise<DigitalTwinData> {
    const res = await fetch(`${API_BASE}/shipments/${shipmentIdentifier}/digital-twin`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      throw new Error(`Failed to load digital twin data for shipment: ${shipmentIdentifier}`);
    }
    return res.json();
  },

  // Cargo summary & batches
  async getShipmentCargo(shipmentIdentifier: string | number): Promise<any> {
    const res = await fetch(`${API_BASE}/shipments/${shipmentIdentifier}/cargo`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load cargo info');
    return res.json();
  },

  // Holds
  async getShipmentHolds(shipmentIdentifier: string | number): Promise<DigitalTwinHold[]> {
    const res = await fetch(`${API_BASE}/shipments/${shipmentIdentifier}/cargo/holds`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load cargo holds');
    return res.json();
  },

  // Batches
  async getShipmentBatches(shipmentIdentifier: string | number): Promise<DigitalTwinBatch[]> {
    const res = await fetch(`${API_BASE}/shipments/${shipmentIdentifier}/cargo/batches`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load cargo batches');
    return res.json();
  },

  // Events
  async getShipmentEvents(shipmentIdentifier: string | number): Promise<DigitalTwinEvent[]> {
    const res = await fetch(`${API_BASE}/shipments/${shipmentIdentifier}/cargo/events`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load cargo events');
    return res.json();
  },

  // Sensors
  async getShipmentSensors(shipmentIdentifier: string | number): Promise<DigitalTwinSensors> {
    const res = await fetch(`${API_BASE}/shipments/${shipmentIdentifier}/sensors`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load sensor readings');
    return res.json();
  },

  // Simulations
  async startLoadingSimulation(shipmentCode: string = 'SHP-2026-0018', step?: number): Promise<any> {
    const params = new URLSearchParams({ shipment_code: shipmentCode });
    if (typeof step === 'number') {
      params.append('step', step.toString());
    }
    const res = await fetch(`${API_BASE}/demo/loading/start?${params}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to start loading simulation');
    return res.json();
  },

  async startDischargeSimulation(shipmentCode: string = 'SHP-2026-0018', step?: number): Promise<any> {
    const params = new URLSearchParams({ shipment_code: shipmentCode });
    if (typeof step === 'number') {
      params.append('step', step.toString());
    }
    const res = await fetch(`${API_BASE}/demo/discharge/start?${params}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to start discharge simulation');
    return res.json();
  },

  async triggerSensorAlert(shipmentCode: string = 'SHP-2026-0018', trigger: boolean = true): Promise<any> {
    const params = new URLSearchParams({
      shipment_code: shipmentCode,
      trigger: trigger.toString()
    });
    const res = await fetch(`${API_BASE}/demo/trigger-alert?${params}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to toggle sensor alert');
    return res.json();
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
        // Will fallback to safe polling
      };

      ws.onclose = () => {
        if (!isClosedExplicitly) {
          // Reconnect attempt after 5s if still active
        }
      };
    } catch {
      // WebSocket creation failed
    }

    return () => {
      isClosedExplicitly = true;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close();
      }
    };
  }
};
