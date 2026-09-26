import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  FileSpreadsheet,
  Download,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const ReportsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const downloadPDFReport = (reportType: string) => {
    setGenerating(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(6, 59, 104);
      doc.rect(0, 0, 210, 32, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('I-STELX MARITIME LOGISTICS INTELLIGENCE', 14, 15);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Indian Steel Transportation, Efficient Logistics & eXchange | Enterprise Audit Report', 14, 23);

      doc.setTextColor(16, 42, 67);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`Official Executive Report: ${reportType.toUpperCase()}`, 14, 44);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toUTCString()} | Status: AUDITED ENTERPRISE RECORD`, 14, 50);

      // Planned vs Actual Table
      (doc as any).autoTable({
        startY: 56,
        head: [['Metric Parameter', 'Planned / Baseline Target', 'Actual Delivered Performance', 'Variance Delta', 'Commercial Status']],
        body: [
          ['Landed Voyage Cost', 'INR 16.43 Crores', 'INR 16.71 Crores', '+INR 0.28 Cr (+1.7%)', 'PASS (Within 2% tolerance)'],
          ['Scheduled Arrival ETA', '28 Oct 2026, 08:00 UTC', '29 Oct 2026, 03:30 UTC', '+19.5 Hours Delay', 'Demurrage Allowance Applied'],
          ['Port Waiting Queue', '12.0 Hours Allowed', '11.4 Hours In Lineup', '-0.6 Hours Saved', 'No Demurrage Penalty'],
          ['Total Voyage Duration', '16.5 Sailing Days', '17.8 Sailing Days', '+1.3 Days (Weather Swell)', 'Monsoon Protocol Compliant'],
          ['Discharged Cargo Volume', '80,000 MT Coking Coal', '80,000 MT Outturn Verified', '0.00 MT Weight Loss', '100% Outturn Recovery'],
          ['Ocean Freight Benchmark', '$24.30 / MT Fixed', '$24.30 / MT Invoiced', '$0.00 / MT Rate Variance', 'Zero Commercial Claims']
        ],
        headStyles: { fillColor: [6, 59, 104], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8.5, cellPadding: 3.5 }
      });

      doc.save(`I-STELX_${reportType.replace(/\s+/g, '_')}_2026.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const downloadCSV = (title: string) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Planned,Actual,Variance,Status\n"
      + "Landed Cost (Cr),16.43,16.71,+0.28,Within Tolerance\n"
      + "Arrival ETA,28 Oct,29 Oct,+19.5h,Demurrage Covered\n"
      + "Port Waiting (Hours),12.0,11.4,-0.6h,No Penalty\n"
      + "Voyage Duration (Days),16.5,17.8,+1.3d,Weather Swell\n"
      + "Cargo Volume (MT),80000,80000,0,100% Recovery\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `I-STELX_${title}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportsList = [
    { title: 'Planned vs Actual Voyage Audit Report', desc: 'Compares final landed freight cost, duration, demurrage, and ETA variance against initial fixture baseline.', type: 'Planned vs Actual' },
    { title: 'Freight Forecast ML Accuracy Report', desc: 'Detailed tracking of historical predicted forward curves against actual physical spot market settlements.', type: 'Freight Forecast Accuracy' },
    { title: 'Vessel Charter Fixture Analysis', desc: 'Multi-criteria breakdown of all approved charter scenarios, Baltic indexes, and risk scores.', type: 'Charter Fixtures' },
    { title: 'Port Congestion & Waiting Cost Audit', desc: 'Berth turnaround times, average queue hours, and handling throughput across Indian Major Ports.', type: 'Port Performance' },
    { title: 'Fleet Demurrage & Schedule Delay Report', desc: 'Voyage disruption logs, monsoon weather slowdowns, and terminal clearance milestones.', type: 'Delay Analysis' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-[#063B68]" />
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            Official Maritime Logistics Reports & Audits
          </h1>
        </div>
        <p className="text-xs text-[#64748B] mt-0.5">
          Generate, export, and audit executive voyage dossiers in PDF and CSV format.
        </p>
      </div>

      {/* PLANNED VS ACTUAL BENCHMARK SPOTLIGHT (SHP-2026-0078) */}
      <div className="istelx-card p-6 bg-white border border-[#0867B2]/30 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div>
            <span className="badge-blue text-xs font-bold mb-1">
              COMPLETED VOYAGE BENCHMARK RECORD
            </span>
            <h2 className="font-heading font-extrabold text-lg text-[#063B68] mt-1">
              Shipment SHP-2026-0078 (MV STEEL VOYAGER) — Planned vs Actual Variance
            </h2>
            <p className="text-xs text-[#64748B]">
              Hay Point → Visakhapatnam Port • 80,000 MT Prime Coking Coal
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadPDFReport('Planned_vs_Actual_Audit')}
              className="px-3.5 py-2 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>Export Official PDF</span>
            </button>
            <button
              onClick={() => downloadCSV('Planned_vs_Actual')}
              className="px-3.5 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#063B68] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#00843D]" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Variance Comparison Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Landed Cost Variance</span>
            <div className="font-heading font-extrabold text-xl text-[#063B68] mt-1">
              ₹16.71 Cr <span className="text-xs font-normal text-[#64748B]">vs ₹16.43 Cr plan</span>
            </div>
            <div className="text-[11px] font-bold text-[#00843D] mt-1">
              +₹0.28 Cr (+1.7% Within Tolerance)
            </div>
          </div>

          <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Arrival Schedule</span>
            <div className="font-heading font-extrabold text-xl text-[#063B68] mt-1">
              29 Oct <span className="text-xs font-normal text-[#64748B]">vs 28 Oct sched</span>
            </div>
            <div className="text-[11px] font-bold text-[#D92D20] mt-1">
              +19.5h Delay (Weather Swell)
            </div>
          </div>

          <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Port Waiting Time</span>
            <div className="font-heading font-extrabold text-xl text-[#00843D] mt-1">
              11.4 Hours
            </div>
            <div className="text-[11px] font-semibold text-[#00843D] mt-1">
              -0.6h Below 12h Free Laytime
            </div>
          </div>

          <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Voyage Duration</span>
            <div className="font-heading font-extrabold text-xl text-[#063B68] mt-1">
              17.8 Days
            </div>
            <div className="text-[11px] font-semibold text-[#475569] mt-1">
              Planned: 16.5 Days (Speed 12.8 kt)
            </div>
          </div>
        </div>
      </div>

      {/* AVAILABLE ENTERPRISE REPORTS DIRECTORY */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-base text-[#063B68]">
          Available Standardized Executive Reports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportsList.map((rep, idx) => (
            <div
              key={idx}
              className="istelx-card istelx-card-hover p-5 rounded-xl border border-[#CBD5E1] bg-white flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0867B2]" />
                  <h3 className="font-heading font-bold text-sm text-[#063B68]">
                    {rep.title}
                  </h3>
                </div>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  {rep.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#0867B2] uppercase">
                  PDF & CSV Ready
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadPDFReport(rep.type)}
                    className="px-3 py-1.5 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-[#FF7A00]" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => downloadCSV(rep.type)}
                    className="p-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#063B68] rounded border border-[#CBD5E1] cursor-pointer"
                    title="Export CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#00843D]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
