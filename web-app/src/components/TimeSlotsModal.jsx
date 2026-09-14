import React, { useState } from "react";
import { Clock, Plus, Trash2, Calendar, Check, X, ArrowUp, ArrowDown, Info, GripVertical, ArrowUpDown } from "lucide-react";

export default function TimeSlotsModal({ isOpen, onClose, days, setDays, slots, setSlots, teachers, setTeachers, blockedSlots, setBlockedSlots }) {
  const [editingDays, setEditingDays] = useState([...days]);
  const [editingSlots, setEditingSlots] = useState([...slots]);
  const [newDay, setNewDay] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [draggedSlotIdx, setDraggedSlotIdx] = useState(null);

  if (!isOpen) return null;

  // Chronological Auto-Sort
  const handleSortSlotsChronologically = () => {
    const sorted = [...editingSlots].sort((a, b) => {
      const parseMinutes = (str) => {
        const match = str.match(/(\d{1,2}):(\d{2})/);
        if (!match) return 0;
        return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
      };
      return parseMinutes(a) - parseMinutes(b);
    });
    setEditingSlots(sorted);
  };

  // Drag & Drop for Slots
  const handleSlotDragStart = (e, index) => {
    setDraggedSlotIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSlotDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSlotDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedSlotIdx === null || draggedSlotIdx === targetIdx) return;
    const currentSlots = [...editingSlots];
    const item = currentSlots.splice(draggedSlotIdx, 1)[0];
    currentSlots.splice(targetIdx, 0, item);
    setEditingSlots(currentSlots);
    setDraggedSlotIdx(null);
  };

  // Add Day
  const handleAddDay = () => {
    const d = newDay.trim();
    if (!d) return;
    if (editingDays.includes(d)) {
      alert("Aquest dia ja existeix a la llista.");
      return;
    }
    setEditingDays([...editingDays, d]);
    setNewDay("");
  };

  // Delete Day
  const handleDeleteDay = (index) => {
    if (editingDays.length <= 1) {
      alert("Hi ha de tenir almenys 1 dia lectiu.");
      return;
    }
    setEditingDays(editingDays.filter((_, i) => i !== index));
  };

  // Add Slot
  const handleAddSlot = () => {
    const s = newSlot.trim();
    if (!s) return;
    if (editingSlots.includes(s)) {
      alert("Aquesta franja horària ja existeix.");
      return;
    }
    setEditingSlots([...editingSlots, s]);
    setNewSlot("");
  };

  // Delete Slot
  const handleDeleteSlot = (index) => {
    if (editingSlots.length <= 1) {
      alert("Hi ha de tenir almenys 1 franja horària.");
      return;
    }
    setEditingSlots(editingSlots.filter((_, i) => i !== index));
  };

  // Move Slot Up/Down
  const handleMoveSlot = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= editingSlots.length) return;
    const copy = [...editingSlots];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setEditingSlots(copy);
  };

  // Save changes and adapt teacher availability & blocked slots
  const handleSave = () => {
    setDays(editingDays);
    setSlots(editingSlots);

    // Adapt teacher availability matrices to match new slots length
    setTeachers(teachers.map(t => {
      const updatedAvail = {};
      editingDays.forEach(day => {
        const oldAvail = t.availability?.[day] || [];
        const newAvailArr = new Array(editingSlots.length).fill(true);

        // Keep previous availability values where indices match
        for (let i = 0; i < Math.min(oldAvail.length, editingSlots.length); i++) {
          newAvailArr[i] = oldAvail[i];
        }
        updatedAvail[day] = newAvailArr;
      });
      return { ...t, availability: updatedAvail };
    }));

    // Filter blocked slots that are no longer valid
    setBlockedSlots(blockedSlots.filter(b => editingDays.includes(b.day) && editingSlots.includes(b.hour)));

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Configurar Dies i Franges Horàries</h2>
              <p className="text-xs text-slate-400">Personalitza els horaris segons l'estructura de la teva escola</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto space-y-6 pr-1 flex-1 text-xs">
          
          <div className="bg-slate-900/50 border border-slate-700/60 p-3.5 rounded-xl flex items-start gap-2.5 text-slate-300">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p>Pots afegir franges de 30 minuts, 45 minuts, 1 hora o 1 hora i mitja (ex. <code>15:00 - 16:30</code>). La matriu de disponibilitat i els horaris s'adaptaran automàticament.</p>
          </div>

          {/* Days Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Dies Lectius de la Setmana ({editingDays.length})</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
                placeholder="Ex. Dissabte, Setmana A..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddDay}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Afegir Dia</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {editingDays.map((d, index) => (
                <div key={d} className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-medium">
                  <span>{d}</span>
                  <button onClick={() => handleDeleteDay(index)} className="text-slate-400 hover:text-rose-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="space-y-3 border-t border-slate-700 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Franges Horàries ({editingSlots.length})</span>
              </h3>

              <button
                onClick={handleSortSlotsChronologically}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition"
                title="Ordena les franges automàticament de matí a tarda"
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>Ordenar Cronològicament</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                placeholder="Ex. 08:30 - 09:15, 15:00 - 16:30..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleAddSlot}
                className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Afegir Franja</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {editingSlots.map((slot, index) => (
                <div
                  key={slot}
                  draggable
                  onDragStart={(e) => handleSlotDragStart(e, index)}
                  onDragOver={handleSlotDragOver}
                  onDrop={(e) => handleSlotDrop(e, index)}
                  className={`flex items-center justify-between bg-slate-900 border border-slate-700/80 px-3 py-2 rounded-lg text-slate-200 cursor-grab active:cursor-grabbing hover:border-amber-500/50 transition group ${
                    draggedSlotIdx === index ? "opacity-40 border-dashed border-amber-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0" />
                    <span className="font-mono text-xs font-semibold text-amber-300">{slot}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 mr-1">Franja #{index + 1}</span>
                    <button
                      onClick={() => handleMoveSlot(index, -1)}
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30"
                      title="Pujar franja"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSlot(index, 1)}
                      disabled={index === editingSlots.length - 1}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30"
                      title="Baixar franja"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlot(index)}
                      className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition ml-1"
                      title="Eliminar franja"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-700 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Desar Canvis Horaris</span>
          </button>
        </div>

      </div>
    </div>
  );
}
