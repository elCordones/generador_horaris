import React, { useRef } from "react";
import { Calendar, Download, Upload, RefreshCw, Sparkles, Settings, FileSpreadsheet, FileUp } from "lucide-react";

export default function Header({
  schoolSettings,
  onSaveProject,
  onLoadProject,
  onLoadSample,
  onReset,
  onOpenSettingsModal,
  onDownloadExcelTemplate,
  onImportExcelTemplate
}) {
  const jsonFileInputRef = useRef(null);
  const excelFileInputRef = useRef(null);

  const handleJsonFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        onLoadProject(json);
      } catch (err) {
        alert("El fitxer seleccionat no és un JSON vàlid de projecte d'horaris.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onImportExcelTemplate(event.target.result);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Institution Info */}
        <div className="flex items-center gap-3">
          {schoolSettings?.logoUrl ? (
            <img
              src={schoolSettings.logoUrl}
              alt="Logo Centre"
              className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-slate-700 shrink-0"
            />
          ) : (
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20 shrink-0">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white">
                {schoolSettings?.institutionName || "Generador d'Horaris"}
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full font-mono">
                {schoolSettings?.academicYear || "v3.2"}
              </span>
            </div>
            <p className="text-xs text-slate-400">Generació client-side d'horaris escolars</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenSettingsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition shadow-sm"
            title="Configura la identitat del centre, logo, aules, restriccions i franges"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configuració</span>
          </button>

          <button
            onClick={onDownloadExcelTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition shadow-sm"
            title="Descarrega la plantilla Excel (.xlsx) per omplir mestres (amb parèntesis), grups i activitats"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Plantilla Excel</span>
          </button>

          <button
            onClick={() => excelFileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 border border-emerald-600/60 rounded-lg transition shadow-sm"
            title="Carrega les dades des d'una plantilla Excel (.xlsx) omplerta"
          >
            <FileUp className="w-3.5 h-3.5 text-emerald-300" />
            <span>Importar Excel</span>
          </button>
          <input
            type="file"
            ref={excelFileInputRef}
            onChange={handleExcelFileChange}
            accept=".xlsx"
            className="hidden"
          />

          <button
            onClick={onLoadSample}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition"
            title="Carrega les dades d'exemple d'una escola primària"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Exemple</span>
          </button>

          <button
            onClick={onSaveProject}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
            title="Descarrega el projecte actual en fitxer JSON"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Guardar (.json)</span>
          </button>

          <button
            onClick={() => jsonFileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
            title="Carrega un projecte des d'un fitxer JSON"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Carregar (.json)</span>
          </button>
          <input
            type="file"
            ref={jsonFileInputRef}
            onChange={handleJsonFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 rounded-lg transition"
            title="Netejar tot el projecte"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Netejar</span>
          </button>
        </div>

      </div>
    </header>
  );
}

