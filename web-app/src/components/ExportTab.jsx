import React from "react";
import { FileSpreadsheet, FileText, Printer, Download, AlertTriangle } from "lucide-react";
import { exportToExcel, exportToPdf } from "../utils/exporters";

export default function ExportTab({ schedules, blockedSlots, days, slots, slotsByDay, schoolSettings }) {
  const hasSchedules = schedules && Object.keys(schedules).length > 0;

  const handleExcelExport = () => {
    exportToExcel(schedules, blockedSlots, days, slots, schoolSettings, slotsByDay);
  };

  const handlePdfExport = () => {
    exportToPdf(schedules, blockedSlots, days, slots, schoolSettings, slotsByDay);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {!hasSchedules ? (
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-10 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Encara no s'ha generat cap horari</h3>
          <p className="text-xs text-slate-400">Genera l'horari primer des de la pestanya <strong>6. Generar Horari</strong> per poder exportar-lo a Excel o PDF.</p>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-xl">
          
          <div className="inline-flex p-4 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl text-white shadow-lg shadow-emerald-500/25">
            <Download className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Exportació d'Horaris</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-2">
              Descarrega l'horari lectiu personalitzat per al centre <strong>{schoolSettings?.institutionName}</strong> ({schoolSettings?.academicYear}).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            {/* EXCEL */}
            <button
              onClick={handleExcelExport}
              className="p-5 bg-slate-900 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 rounded-2xl transition-all group flex flex-col items-center text-center space-y-3 shadow-md hover:scale-[1.02]"
            >
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Full d'Excel (.xlsx)</h3>
                <p className="text-[11px] text-slate-400 mt-1">Una pestanya independent per a cada grup classe</p>
              </div>
              <span className="mt-auto px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold w-full">
                Descarregar Excel
              </span>
            </button>

            {/* PDF */}
            <button
              onClick={handlePdfExport}
              className="p-5 bg-slate-900 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/50 rounded-2xl transition-all group flex flex-col items-center text-center space-y-3 shadow-md hover:scale-[1.02]"
            >
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl group-hover:scale-110 transition">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Document PDF (.pdf)</h3>
                <p className="text-[11px] text-slate-400 mt-1">Disseny dinàmic en horitzontal amb capçalera oficial</p>
              </div>
              <span className="mt-auto px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold w-full">
                Descarregar PDF
              </span>
            </button>

            {/* PRINT */}
            <button
              onClick={handlePrint}
              className="p-5 bg-slate-900 hover:bg-blue-950/40 border border-slate-700 hover:border-blue-500/50 rounded-2xl transition-all group flex flex-col items-center text-center space-y-3 shadow-md hover:scale-[1.02]"
            >
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition">
                <Printer className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Imprimir en Navegador</h3>
                <p className="text-[11px] text-slate-400 mt-1">Utilitza el diàleg d'impressió directament</p>
              </div>
              <span className="mt-auto px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold w-full">
                Obrir Impressió
              </span>
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
