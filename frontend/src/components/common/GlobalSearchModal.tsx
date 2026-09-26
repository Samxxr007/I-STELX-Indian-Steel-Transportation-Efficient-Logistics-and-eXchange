import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Ship, Anchor, FileText, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { api } from '../../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    shipments: any[];
    requirements: any[];
    vessels: any[];
    ports: any[];
  }>({
    shipments: [],
    requirements: [],
    vessels: [],
    ports: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch master lists for instant search
    Promise.all([
      api.getShipments(),
      api.getRequirements(),
      api.getVessels(),
      api.getPorts()
    ]).then(([shipments, requirements, vessels, ports]) => {
      if (!query.trim()) {
        setResults({
          shipments: shipments.slice(0, 3),
          requirements: requirements.slice(0, 3),
          vessels: vessels.slice(0, 3),
          ports: ports.slice(0, 3)
        });
      } else {
        const q = query.toLowerCase();
        setResults({
          shipments: shipments.filter(s => 
            s.shipment_code.toLowerCase().includes(q) || 
            s.cargo_type.toLowerCase().includes(q) || 
            s.destination_port.toLowerCase().includes(q)
          ),
          requirements: requirements.filter(r => 
            r.requirement_code.toLowerCase().includes(q) || 
            r.cargo_type.toLowerCase().includes(q) || 
            r.origin_port.toLowerCase().includes(q)
          ),
          vessels: vessels.filter(v => 
            v.name.toLowerCase().includes(q) || 
            v.imo.toLowerCase().includes(q) || 
            v.vessel_type.toLowerCase().includes(q)
          ),
          ports: ports.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.code.toLowerCase().includes(q)
          )
        });
      }
    }).catch(console.error);
  }, [isOpen, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-[#CBD5E1] w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <Search className="w-5 h-5 text-[#0867B2]" />
          <input
            type="text"
            placeholder="Search Shipment ID, Vessel, IMO, Requirement ID, Port..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none outline-hidden text-[#102A43] placeholder-[#94A3B8] text-sm font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#94A3B8] hover:text-[#102A43] hover:bg-[#E2E8F0] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Shipments */}
          {results.shipments.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5 text-[#063B68]" />
                <span>Active Shipments & Voyages</span>
              </div>
              <div className="space-y-1">
                {results.shipments.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      navigate(`/shipments/${s.id}`);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs text-[#063B68] bg-[#EBF4FC] px-2 py-0.5 rounded">
                        {s.shipment_code}
                      </span>
                      <span className="text-sm font-semibold text-[#102A43]">{s.vessel_name || 'Vessel'}</span>
                      <span className="text-xs text-[#64748B]">({s.origin_port} → {s.destination_port})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0867B2]">{s.status}</span>
                      <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#063B68] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cargo Requirements */}
          {results.requirements.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span>Cargo Requirements</span>
              </div>
              <div className="space-y-1">
                {results.requirements.map(r => (
                  <div
                    key={r.id}
                    onClick={() => {
                      navigate(`/requirements`);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs text-[#FF7A00] bg-[#FFF4E5] px-2 py-0.5 rounded">
                        {r.requirement_code}
                      </span>
                      <span className="text-sm font-medium text-[#102A43]">{r.quantity_mt.toLocaleString()} MT {r.cargo_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#64748B]">{r.origin_port} → {r.destination_port}</span>
                      <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#FF7A00] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vessels */}
          {results.vessels.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5 text-[#00843D]" />
                <span>Bulk Vessels (Fleet Master)</span>
              </div>
              <div className="space-y-1">
                {results.vessels.map(v => (
                  <div
                    key={v.id}
                    onClick={() => {
                      navigate(`/vessels`);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-sm text-[#102A43]">{v.name}</span>
                      <span className="text-xs text-[#64748B]">IMO {v.imo} • {v.vessel_type}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#00843D]">{v.dwt.toLocaleString()} DWT</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ports */}
          {results.ports.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5 text-[#0867B2]" />
                <span>Ports & Terminals</span>
              </div>
              <div className="space-y-1">
                {results.ports.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      navigate(`/ports`);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-sm text-[#102A43]">{p.name} ({p.code})</span>
                      <span className="text-xs text-[#64748B]">{p.country}</span>
                    </div>
                    <span className="text-xs font-medium text-[#475569]">Max Draft: {p.max_draft_m}m</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#F1F5F9] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
          <span>Navigate with mouse or arrow keys</span>
          <span><kbd className="px-1.5 py-0.5 bg-white border border-[#CBD5E1] rounded shadow-2xs font-mono">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
