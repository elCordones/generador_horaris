import React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

export default function ValidationTab({ validationStatus, onGoToStep }) {
  const { isValid, errors, warnings } = validationStatus;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 shadow-lg ${
        isValid
          ? "bg-emerald-950/40 border-emerald-600/50 text-emerald-200"
          : "bg-rose-950/40 border-rose-600/50 text-rose-200"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isValid ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
            {isValid ? <CheckCircle className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {isValid ? "Validació Satisfactòria" : "Hi ha errors de configuració pendents"}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isValid
                ? "Tots els comprovadors han donat el vist i plau. Pots procedir a generar l'horari."
                : `S'han detectat ${errors.length} error(s) greus que s'han de corregir abans de la generació.`}
            </p>
          </div>
        </div>

        {isValid && (
          <button
            onClick={() => onGoToStep(6)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition shrink-0"
          >
            <span>Anar a Generar Horari</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Errors Section */}
      {errors.length > 0 && (
        <div className="bg-slate-800 border border-rose-800/80 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2 border-b border-rose-800/60 pb-3">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Errors Greus ({errors.length})</span>
          </h3>

          <div className="space-y-2.5">
            {errors.map(err => (
              <div key={err.id} className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-bold text-rose-200">{err.title}</h4>
                  <p className="text-rose-300/90">{err.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <div className="bg-slate-800 border border-amber-800/80 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 border-b border-amber-800/60 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Avisos de Comprovació ({warnings.length})</span>
          </h3>

          <div className="space-y-2.5">
            {warnings.map(warn => (
              <div key={warn.id} className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-bold text-amber-200">{warn.title}</h4>
                  <p className="text-amber-300/90">{warn.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isValid && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 text-center">
          💡 Revisa les pestanyes de <strong>Mestres</strong>, <strong>Grups</strong> o <strong>Activitats</strong> per resoldre els conflictes indicats a sobre.
        </div>
      )}
    </div>
  );
}
