import React, { useState } from "react";
import { UserPlus, Trash2, CheckCircle2, XCircle, Clock, Info } from "lucide-react";
import { getSlotsForDay } from "../utils/sampleData";

export default function TeachersTab({ teachers, setTeachers, days, slots, slotsByDay }) {
  const [newTeacherName, setNewTeacherName] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || null);

  const getSlots = (d) => getSlotsForDay(slotsByDay || slots, d);

  const handleAddTeacher = (e) => {
    e.preventDefault();
    const name = newTeacherName.trim();
    if (!name) return;

    if (teachers.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      alert(`Ja existeix un mestre amb el nom "${name}".`);
      return;
    }

    const defaultAvail = {};
    days.forEach(day => {
      defaultAvail[day] = new Array(getSlots(day).length).fill(true);
    });

    const newTeacher = {
      id: `t_${Date.now()}`,
      name,
      availability: defaultAvail
    };

    setTeachers([...teachers, newTeacher]);
    setSelectedTeacherId(newTeacher.id);
    setNewTeacherName("");
  };

  const handleDeleteTeacher = (id) => {
    if (confirm("Segur que vols eliminar aquest mestre?")) {
      const updated = teachers.filter(t => t.id !== id);
      setTeachers(updated);
      if (selectedTeacherId === id) {
        setSelectedTeacherId(updated[0]?.id || null);
      }
    }
  };

  const toggleAvailability = (teacherId, day, slotIdx) => {
    setTeachers(teachers.map(t => {
      if (t.id !== teacherId) return t;

      const daySlotsCount = getSlots(day).length;
      const currentDayAvail = t.availability?.[day]
        ? [...t.availability[day]]
        : new Array(daySlotsCount).fill(true);

      currentDayAvail[slotIdx] = !currentDayAvail[slotIdx];

      return {
        ...t,
        availability: {
          ...t.availability,
          [day]: currentDayAvail
        }
      };
    }));
  };

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId) || teachers[0];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-100 text-sm">1. Gestió de Mestres i Disponibilitat Horària</p>
          <p>Escriu el nom de cada mestre per afegir-lo a la llista. Selecciona un mestre per definir la seva disponibilitat lectiva en les franges pròpies de cada dia.</p>
          <p className="text-slate-400">
            <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-sm mr-1"></span>Verd = Disponible per impartir classe | 
            <span className="inline-block w-2.5 h-2.5 bg-rose-500 rounded-sm ml-2 mr-1"></span>Vermell = No disponible
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Teacher List & Add */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-4 space-y-4">
          <h2 className="text-sm font-bold text-slate-100 flex items-center justify-between">
            <span>Llista de Mestres</span>
            <span className="text-xs font-normal px-2 py-0.5 bg-slate-700 rounded-full text-slate-300">
              {teachers.length} registrats
            </span>
          </h2>

          <form onSubmit={handleAddTeacher} className="flex gap-2">
            <input
              type="text"
              value={newTeacherName}
              onChange={(e) => setNewTeacherName(e.target.value)}
              placeholder="Nom del mestre / especialista..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Afegir</span>
            </button>
          </form>

          <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
            {teachers.map(t => {
              const isSelected = selectedTeacherId === t.id;

              let availHours = 0;
              days.forEach(d => {
                const daySlots = getSlots(d);
                (t.availability?.[d] || []).forEach((val, idx) => {
                  if (val !== false && idx < daySlots.length) availHours++;
                });
              });

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTeacherId(t.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                    isSelected
                      ? "bg-blue-600/20 border-blue-500 text-white"
                      : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-700/40"
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold">{t.name}</span>
                    <span className="block text-[10px] text-slate-400">
                      Disponibilitat: {availHours}h / setmana
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTeacher(t.id);
                    }}
                    className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition"
                    title="Eliminar mestre"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {teachers.length === 0 && (
              <p className="text-center text-xs text-slate-500 py-6">No hi ha cap mestre afegit.</p>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Availability Grid */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/80 rounded-xl p-4 space-y-4">
          {selectedTeacher ? (
            <>
              <div className="flex flex-wrap items-center justify-between border-b border-slate-700 pb-3 gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Matriu de Disponibilitat: {selectedTeacher.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400">Clica a qualsevol casella per alternar la disponibilitat del mestre</p>
                </div>

                <button
                  onClick={() => {
                    const allTrue = {};
                    days.forEach(d => { allTrue[d] = new Array(getSlots(d).length).fill(true); });
                    setTeachers(teachers.map(t => t.id === selectedTeacher.id ? { ...t, availability: allTrue } : t));
                  }}
                  className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px]"
                >
                  Marcar tot disponible
                </button>
              </div>

              {/* Grid Table per Day */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300">
                      {days.map(d => (
                        <th key={d} className="p-2 border border-slate-700 font-bold text-blue-300 w-1/5">{d}</th>
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
                              {daySlots.map((slotStr, slotIdx) => {
                                const isAvailable = selectedTeacher.availability?.[day]?.[slotIdx] !== false;

                                return (
                                  <button
                                    key={slotStr}
                                    onClick={() => toggleAvailability(selectedTeacher.id, day, slotIdx)}
                                    className={`w-full p-2 rounded font-medium transition-all flex flex-col items-center justify-center text-[10px] ${
                                      isAvailable
                                        ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30"
                                        : "bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500/30"
                                    }`}
                                  >
                                    <span className="font-mono font-bold truncate max-w-full">{slotStr}</span>
                                    <span>{isAvailable ? "✓ Disponible" : "✗ No disp."}</span>
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
              <Clock className="w-8 h-8 opacity-40" />
              <p className="text-xs">Selecciona un mestre de la llista per editar la seva disponibilitat.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
