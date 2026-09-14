import React, { useState } from "react";
import { Settings, Building2, Clock, Check, X, Plus, Trash2, Sliders, Info, Copy, Calendar, GripVertical, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { getSlotsForDay } from "../utils/sampleData";

export default function SchoolSettingsModal({
  isOpen,
  onClose,
  schoolSettings,
  setSchoolSettings,
  rooms,
  setRooms,
  days,
  setDays,
  slots,
  slotsByDay,
  setSlotsByDay,
  teachers,
  setTeachers,
  blockedSlots,
  setBlockedSlots
}) {
  const [activeTab, setActiveTab] = useState("TIMING"); // "IDENTITY" | "ROOMS" | "PEDAGOGICAL" | "TIMING"

  // Identity State
  const [identityData, setIdentityData] = useState({ ...schoolSettings });

  // Rooms State
  const [editingRooms, setEditingRooms] = useState([...rooms]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState("SPECIAL");

  // Timing State (Per-Day Slots)
  const [editingDays, setEditingDays] = useState([...days]);
  const [selectedDayTab, setSelectedDayTab] = useState(days[0] || "Dilluns");
  const [selectedStageTab, setSelectedStageTab] = useState("PRIMARIA"); // "PRIMARIA" | "INFANTIL"
  
  const [editingSlotsByDay, setEditingSlotsByDay] = useState(() => {
    if (slotsByDay) return JSON.parse(JSON.stringify(slotsByDay));
    const initMap = {};
    days.forEach(d => { initMap[d] = getSlotsForDay(slots, d); });
    return initMap;
  });

  const [newDayName, setNewDayName] = useState("");
  const [newSlotInput, setNewSlotInput] = useState("");

  // Drag and Drop state for slots reordering
  const [draggedSlotIdx, setDraggedSlotIdx] = useState(null);

  if (!isOpen) return null;

  // Chronological Auto-Sort for Day Slots
  const handleSortDaySlotsChronologically = (day) => {
    const currentSlots = editingSlotsByDay[day] || [];
    const sorted = [...currentSlots].sort((a, b) => {
      const parseMinutes = (str) => {
        const match = str.match(/(\d{1,2}):(\d{2})/);
        if (!match) return 0;
        return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
      };
      return parseMinutes(a) - parseMinutes(b);
    });
    setEditingSlotsByDay({
      ...editingSlotsByDay,
      [day]: sorted
    });
  };

  // Move Slot Up/Down
  const handleMoveSlotInDay = (day, fromIdx, direction) => {
    const currentSlots = editingSlotsByDay[day] || [];
    const targetIdx = fromIdx + direction;
    if (targetIdx < 0 || targetIdx >= currentSlots.length) return;
    const copy = [...currentSlots];
    const temp = copy[fromIdx];
    copy[fromIdx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setEditingSlotsByDay({
      ...editingSlotsByDay,
      [day]: copy
    });
  };

  // Drag and Drop Handlers for Slots
  const handleSlotDragStart = (e, index) => {
    setDraggedSlotIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSlotDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSlotDrop = (e, targetIdx, day) => {
    e.preventDefault();
    if (draggedSlotIdx === null || draggedSlotIdx === targetIdx) return;
    const currentSlots = [...(editingSlotsByDay[day] || [])];
    const item = currentSlots.splice(draggedSlotIdx, 1)[0];
    currentSlots.splice(targetIdx, 0, item);
    setEditingSlotsByDay({
      ...editingSlotsByDay,
      [day]: currentSlots
    });
    setDraggedSlotIdx(null);
  };

  // Handlers Rooms
  const handleAddRoom = (e) => {
    e.preventDefault();
    const name = newRoomName.trim();
    if (!name) return;
    if (editingRooms.some(r => r.name.toLowerCase() === name.toLowerCase())) {
      alert("Aquesta aula o espai ja existeix.");
      return;
    }
    setEditingRooms([...editingRooms, { id: `r_${Date.now()}`, name, type: newRoomType }]);
    setNewRoomName("");
  };

  const handleDeleteRoom = (id) => {
    setEditingRooms(editingRooms.filter(r => r.id !== id));
  };

  // Handlers Timing (Per Day)
  const handleAddDay = () => {
    const d = newDayName.trim();
    if (!d) return;
    if (editingDays.includes(d)) return;
    setEditingDays([...editingDays, d]);
    setEditingSlotsByDay({
      ...editingSlotsByDay,
      [d]: ["09:00 - 10:00", "10:00 - 11:00", "11:30 - 12:30", "15:00 - 16:30"]
    });
    setNewDayName("");
    setSelectedDayTab(d);
  };

  const handleDeleteDay = (dayToDelete) => {
    if (editingDays.length <= 1) {
      alert("Cal tenir almenys 1 dia lectiu.");
      return;
    }
    const updatedDays = editingDays.filter(d => d !== dayToDelete);
    setEditingDays(updatedDays);
    const copyMap = { ...editingSlotsByDay };
    delete copyMap[dayToDelete];
    setEditingSlotsByDay(copyMap);
    if (selectedDayTab === dayToDelete) {
      setSelectedDayTab(updatedDays[0]);
    }
  };

  const handleAddSlotToDay = (day) => {
    const s = newSlotInput.trim();
    if (!s) return;
    const currentDaySlots = editingSlotsByDay[day] || [];
    if (currentDaySlots.includes(s)) {
      alert("Aquesta franja horària ja existeix per a aquest dia.");
      return;
    }
    setEditingSlotsByDay({
      ...editingSlotsByDay,
      [day]: [...currentDaySlots, s]
    });
    setNewSlotInput("");
  };

  const handleDeleteSlotFromDay = (day, slotIdx) => {
    const currentDaySlots = editingSlotsByDay[day] || [];
    if (currentDaySlots.length <= 1) {
      alert("Cal tenir almenys 1 franja horària per dia.");
      return;
    }
    setEditingSlotsByDay({
      ...editingSlotsByDay,
      [day]: currentDaySlots.filter((_, i) => i !== slotIdx)
    });
  };

  const handleCopyDaySlotsToAll = (sourceDay) => {
    const sourceSlots = editingSlotsByDay[sourceDay] || [];
    if (confirm(`Vols copiar l'estructura de franges de ${sourceDay} a TOTS els altres dies?`)) {
      const copyMap = {};
      editingDays.forEach(d => {
        copyMap[d] = [...sourceSlots];
      });
      setEditingSlotsByDay(copyMap);
    }
  };

  // Save All Settings
  const handleSaveAll = () => {
    setSchoolSettings(identityData);
    setRooms(editingRooms);
    setDays(editingDays);
    setSlotsByDay(editingSlotsByDay);

    // Adapt teacher availability array length to match new per-day slots length
    setTeachers(teachers.map(t => {
      const updatedAvail = {};
      editingDays.forEach(day => {
        const daySlots = editingSlotsByDay[day] || [];
        const oldAvail = t.availability?.[day] || [];
        const newAvailArr = new Array(daySlots.length).fill(true);
        for (let i = 0; i < Math.min(oldAvail.length, daySlots.length); i++) {
          newAvailArr[i] = oldAvail[i];
        }
        updatedAvail[day] = newAvailArr;
      });
      return { ...t, availability: updatedAvail };
    }));

    // Filter blocked slots that are no longer valid
    setBlockedSlots(blockedSlots.filter(b => editingDays.includes(b.day) && (editingSlotsByDay[b.day] || []).includes(b.hour)));

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-4xl w-full p-5 sm:p-6 space-y-5 shadow-2xl max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl text-white shadow-md">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Configuració General del Centre</h2>
              <p className="text-xs text-slate-400">Personalitza la identitat, aules, restriccions i franges per dia</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Bar - Clean 4-Column Grid for 100% Visibility */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700/80 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab("TIMING")}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition ${
              activeTab === "TIMING"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">1. Franges per Dia</span>
          </button>

          <button
            onClick={() => setActiveTab("ROOMS")}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition ${
              activeTab === "ROOMS"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">2. Aules i Espais ({editingRooms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("IDENTITY")}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition ${
              activeTab === "IDENTITY"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Settings className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">3. Identitat Centre</span>
          </button>

          <button
            onClick={() => setActiveTab("PEDAGOGICAL")}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition ${
              activeTab === "PEDAGOGICAL"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">4. Criteris Pedagògics</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="overflow-y-auto space-y-6 pr-1 flex-1 text-xs">

          {/* TAB: TIMING (PER-DAY SLOTS) */}
          {activeTab === "TIMING" && (
            <div className="space-y-4">
              
              <div className="bg-slate-900/50 border border-slate-700/60 p-3.5 rounded-xl flex items-start gap-2.5 text-slate-300">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p>
                  Pots definir <strong>franges de 30m, 45m, 60m o 90m independents per a Infantil i Primària per a cada dia de la setmana</strong>. Per exemple, franges de 45 minuts (<code>08:30 - 09:15</code>), 60 minuts o franges especials d'ambients i hàbits a Infantil.
                </p>
              </div>

              {/* Stage Switcher */}
              <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                <span className="text-slate-400 font-semibold text-[11px] mr-1">Etapa:</span>
                <button
                  onClick={() => setSelectedStageTab("PRIMARIA")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedStageTab === "PRIMARIA" ? "bg-blue-600 text-white shadow-sm" : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  📚 Educació Primària (1r-6è)
                </button>
                <button
                  onClick={() => setSelectedStageTab("INFANTIL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedStageTab === "INFANTIL" ? "bg-amber-600 text-white shadow-sm" : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  🎨 Educació Infantil (I3-I5)
                </button>
              </div>

              {/* Days Navigation Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-700">
                <span className="text-slate-400 font-semibold text-[11px] mr-1">Dia:</span>
                {editingDays.map(day => {
                  const daySlotsCount = editingSlotsByDay[selectedStageTab]?.[day]?.length || editingSlotsByDay[day]?.length || 0;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDayTab(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        selectedDayTab === day
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <span>{day}</span>
                      <span className="text-[10px] opacity-75">({daySlotsCount}h)</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Day Slots Configurator */}
              {selectedDayTab && (
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-4">
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Franges Horàries per al <strong>{selectedDayTab}</strong></span>
                    </h3>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSortDaySlotsChronologically(selectedDayTab)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition"
                        title="Ordena les franges automàticament de matí a tarda segons l'hora d'inici"
                      >
                        <ArrowUpDown className="w-3 h-3" />
                        <span>Ordenar Cronològicament</span>
                      </button>

                      <button
                        onClick={() => handleCopyDaySlotsToAll(selectedDayTab)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition"
                        title="Copia aquestes franges a la resta de dies de la setmana"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copiar a TOTS els dies</span>
                      </button>
                    </div>
                  </div>

                  {/* Add slot form for active day */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSlotInput}
                      onChange={(e) => setNewSlotInput(e.target.value)}
                      placeholder="Ex. 09:00 - 09:30 (Lectura), 15:00 - 16:30..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleAddSlotToDay(selectedDayTab)}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Afegir a {selectedDayTab}</span>
                    </button>
                  </div>

                  {/* List of slots with Drag & Drop */}
                  <div className="space-y-1.5 pt-1">
                    {(editingSlotsByDay[selectedDayTab] || []).map((slotStr, sIdx) => (
                      <div
                        key={slotStr}
                        draggable
                        onDragStart={(e) => handleSlotDragStart(e, sIdx)}
                        onDragOver={handleSlotDragOver}
                        onDrop={(e) => handleSlotDrop(e, sIdx, selectedDayTab)}
                        className={`flex items-center justify-between bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-200 cursor-grab active:cursor-grabbing hover:border-amber-500/50 transition group ${
                          draggedSlotIdx === sIdx ? "opacity-40 border-dashed border-amber-400" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0" />
                          <span className="font-mono text-amber-300 font-semibold">{slotStr}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 mr-1">Sessió #{sIdx + 1}</span>

                          <button
                            onClick={() => handleMoveSlotInDay(selectedDayTab, sIdx, -1)}
                            disabled={sIdx === 0}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30"
                            title="Pujar franja"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleMoveSlotInDay(selectedDayTab, sIdx, 1)}
                            disabled={sIdx === (editingSlotsByDay[selectedDayTab] || []).length - 1}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30"
                            title="Baixar franja"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteSlotFromDay(selectedDayTab, sIdx)}
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
              )}

            </div>
          )}

          {/* TAB: ROOMS */}
          {activeTab === "ROOMS" && (
            <div className="space-y-4">
              <form onSubmit={handleAddRoom} className="flex gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-700">
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Nom de l'aula (ex. Gimnàs, Laboratori, Aula 1r A...)"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="SPECIAL">Aula Especial / Compartida</option>
                  <option value="REGULAR">Aula Ordinària de Grup</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Afegir</span>
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {editingRooms.map(r => (
                  <div key={r.id} className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Building2 className={`w-4 h-4 ${r.type === "SPECIAL" ? "text-amber-400" : "text-blue-400"}`} />
                      <div>
                        <span className="font-bold text-white block">{r.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {r.type === "SPECIAL" ? "Aula Especial (Evita solapaments)" : "Aula ordinària d'assignació"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteRoom(r.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: IDENTITY */}
          {activeTab === "IDENTITY" && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nom Oficial del Centre Educatiu</label>
                <input
                  type="text"
                  value={identityData.institutionName}
                  onChange={(e) => setIdentityData({ ...identityData, institutionName: e.target.value })}
                  placeholder="Ex. Escola La Renaixença, Institut Bosc de la Coma..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Curs Escolar</label>
                  <input
                    type="text"
                    value={identityData.academicYear}
                    onChange={(e) => setIdentityData({ ...identityData, academicYear: e.target.value })}
                    placeholder="Ex. 2026-2027"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Responsable / Cap d'Estudis</label>
                  <input
                    type="text"
                    value={identityData.headmasterName}
                    onChange={(e) => setIdentityData({ ...identityData, headmasterName: e.target.value })}
                    placeholder="Ex. Equip Directiu / Cap d'Estudis"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Logo Section */}
              <div className="pt-2 border-t border-slate-700/80 space-y-2">
                <label className="block text-slate-300 font-semibold mb-1">Logo del Centre (Opcional)</label>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-xl p-3">
                  {identityData.logoUrl ? (
                    <div className="relative group shrink-0">
                      <img
                        src={identityData.logoUrl}
                        alt="Logo del Centre"
                        className="w-12 h-12 object-contain rounded bg-white p-1 border border-slate-600"
                      />
                      <button
                        onClick={() => setIdentityData({ ...identityData, logoUrl: "" })}
                        className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow"
                        title="Eliminar logo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded bg-slate-800 border border-dashed border-slate-600 flex items-center justify-center text-slate-500 text-xs shrink-0">
                      Sense Logo
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5 text-xs">
                    <input
                      type="text"
                      value={identityData.logoUrl || ""}
                      onChange={(e) => setIdentityData({ ...identityData, logoUrl: e.target.value })}
                      placeholder="Pega la URL de la imatge o del logotip..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 rounded-lg text-[11px] font-semibold cursor-pointer transition">
                        <span>Pujar imatge (.png/.jpg)...</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              setIdentityData({ ...identityData, logoUrl: evt.target.result });
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      <span className="text-[10px] text-slate-400">Es mostrarà als PDF i Excel exportats</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PEDAGOGICAL */}
          {activeTab === "PEDAGOGICAL" && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-4">
                
                <div>
                  <label className="block text-slate-200 font-semibold mb-1">Càrrega Lectiva Màxima Diària per Mestre</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={identityData.maxDailyHoursPerTeacher}
                      onChange={(e) => setIdentityData({ ...identityData, maxDailyHoursPerTeacher: Number(e.target.value) || 5 })}
                      className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    <span className="text-slate-400">hores de classe directes al dia</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={identityData.avoidTeacherGaps}
                      onChange={(e) => setIdentityData({ ...identityData, avoidTeacherGaps: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-200">Evitar "finestres" / hores buides entremig per al professorat</span>
                  </label>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={identityData.fridayAfternoonLightLoad}
                      onChange={(e) => setIdentityData({ ...identityData, fridayAfternoonLightLoad: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-200">Protecció de Divendres Tarda</span>
                  </label>
                </div>

              </div>
            </div>
          )}

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
            onClick={handleSaveAll}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Desar tota la Configuració</span>
          </button>
        </div>

      </div>
    </div>
  );
}
