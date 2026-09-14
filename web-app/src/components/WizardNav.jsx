import React from "react";
import { UserCheck, Users, BookOpen, ShieldAlert, Lock, Play, Edit3, FileSpreadsheet } from "lucide-react";

export const STEPS = [
  { id: 1, name: "1. Mestres", icon: UserCheck },
  { id: 2, name: "2. Grups", icon: Users },
  { id: 3, name: "3. Activitats", icon: BookOpen },
  { id: 4, name: "4. Validació", icon: ShieldAlert },
  { id: 5, name: "5. Franges Bloquejades", icon: Lock },
  { id: 6, name: "6. Generar Horari", icon: Play },
  { id: 7, name: "7. Retocar Horari", icon: Edit3 },
  { id: 8, name: "8. Exportar", icon: FileSpreadsheet }
];

export default function WizardNav({ activeStep, setActiveStep, validationStatus, hasSchedule }) {
  return (
    <nav className="bg-slate-800 border-b border-slate-700/80 px-4 py-2 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center gap-1 min-w-max">
        {STEPS.map(step => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          const isValidation = step.id === 4;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all relative ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                  : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{step.name}</span>

              {/* Validation status badge */}
              {isValidation && validationStatus && (
                <span className={`ml-1.5 w-2 h-2 rounded-full ${
                  validationStatus.errors.length > 0 ? "bg-rose-500 animate-pulse" :
                  validationStatus.warnings.length > 0 ? "bg-amber-400" : "bg-emerald-400"
                }`} />
              )}

              {/* Schedule status badge */}
              {step.id === 7 && hasSchedule && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  Generat
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
