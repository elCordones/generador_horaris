import React, { useState } from "react";
import { Lock, Unlock, Info } from "lucide-react";
import { getSlotsForDay } from "../utils/sampleData";

export default function GlobalBlocksTab({ blockedSlots, setBlockedSlots, days, slots, slotsByDay }) {
  const [newLabel, setNewLabel] = useState("Pati / Menjador");

  const getSlots = (d) => getSlotsForDay(slotsByDay || slots, d);

  const toggleSlotBlock = (day, hour) => {
    const exists = blockedSlots.find(b => b.day === day && b.hour === hour);

    if (exists) {
      setBlockedSlots(blockedSlots.filter(b => !(b.day === day && b.hour === hour)));
    } else {
      setBlockedSlots([...blockedSlots, { day, hour, label: newLabel.trim() || "Bloquejat" }]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-100 text-sm">5. Franges Globals Bloquejades</p>
          <p>Utilitza aquesta matriu per reservar períodes del dia on no s'ha d'impartir cap classe (com el pati, el menjador, les tutories de centre o la lectura de matí).</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Matriu de Franges Bloquejades ({blockedSlots.length})</span>
            </h3>
            <p className="text-xs text-slate-400">Clica a qualsevol casella per bloquejar-la o desbloquejar-la</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-300">Etiqueta de bloqueig:</span>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Ex. Pati, Treball Personal..."
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Grid Table per Day */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-300">
                {days.map(d => (
                  <th key={d} className="p-2 border border-slate-700 font-bold text-amber-400 w-1/5">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {days.map(day => {
                  const daySlots = getSlots(day);
                  return (
                    <td key={day} className="p-1 border border-slate-700 align-top">
                      <div className="space-y-1">
                        {daySlots.map(hour => {
                          const blockObj = blockedSlots.find(b => b.day === day && b.hour === hour);
                          const isBlocked = !!blockObj;

                          return (
                            <button
                              key={hour}
                              onClick={() => toggleSlotBlock(day, hour)}
                              className={`w-full p-2 rounded font-medium transition-all flex flex-col items-center justify-center text-[10px] ${
                                isBlocked
                                  ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 hover:bg-amber-500/30 shadow-sm"
                                  : "bg-slate-900/40 border border-slate-700/60 text-slate-400 hover:bg-slate-700/50"
                              }`}
                            >
                              <span className="font-mono font-bold truncate max-w-full">{hour}</span>
                              {isBlocked ? (
                                <span className="font-bold text-amber-300 truncate max-w-full">🔒 {blockObj.label}</span>
                              ) : (
                                <span className="text-slate-500">🔓 Lliure</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
