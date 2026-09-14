import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  User,
  Building2,
  LayoutGrid,
  Lock,
  Brain,
  Undo2,
  Redo2,
  Search,
  Filter,
  GripVertical,
  ArrowUpDown,
  Sparkles,
  X,
  AlertTriangle,
  Layers,
  Check
} from "lucide-react";
import { getSlotsForDay } from "../utils/sampleData";

export default function ScheduleViewTab({
  schedules,
  setSchedules,
  teachers,
  groups,
  rooms,
  activities,
  blockedSlots,
  days,
  slots,
  slotsByDay
}) {
  const [viewMode, setViewMode] = useState("GROUP"); // "GROUP" | "TEACHER" | "ROOM" | "MASTER"
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || "");
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || "");
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || "");

  // Undo / Redo History Stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Drag and Drop State
  const [draggedCell, setDraggedCell] = useState(null); // { groupName, day, hour, slotData }
  const [dragOverCell, setDragOverCell] = useState(null); // { groupName, day, hour }

  // Quick Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterHighCognitive, setFilterHighCognitive] = useState(false);
  const [filterCoTeacher, setFilterCoTeacher] = useState(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("ALL");

  // Editing Modal State
  const [editingCell, setEditingCell] = useState(null); // { groupName, day, hour }

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getSlots = (d) => getSlotsForDay(slotsByDay || slots, d);

  // Helper to commit state change with Undo History tracking
  const updateSchedulesWithUndo = useCallback((newSchedules, actionDescription) => {
    setUndoStack(prev => [...prev, schedules]);
    setRedoStack([]);
    setSchedules(newSchedules);
    if (actionDescription) showToast(actionDescription);
  }, [schedules, setSchedules]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    setRedoStack(prev => [...prev, schedules]);
    setUndoStack(newUndoStack);
    setSchedules(previous);
    showToast("Acció desfer (Ctrl+Z) aplicada");
  }, [undoStack, schedules, setSchedules]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    setUndoStack(prev => [...prev, schedules]);
    setRedoStack(newRedoStack);
    setSchedules(next);
    showToast("Acció refer (Ctrl+Y) aplicada");
  }, [redoStack, schedules, setSchedules]);

  // Keyboard listeners for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  if (!schedules || Object.keys(schedules).length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto">
        <Users className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
        <h3 className="text-base font-bold text-white">No hi ha cap horari generat per visualitzar</h3>
        <p className="text-xs text-slate-400">Vés a la pestanya <strong>6. Generar Horari</strong> i prem el botó de generació per crear el primer horari.</p>
      </div>
    );
  }

  const selectedGroup = groups.find(g => g.id === selectedGroupId) || groups[0];
  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId) || teachers[0];
  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  // List of all unique subject names for quick dropdown filter
  const allSubjects = Array.from(new Set(activities.map(a => a.subject))).filter(Boolean);

  function getBlockedLabel(day, hour) {
    const block = blockedSlots.find(b => b.day === day && b.hour === hour);
    return block ? block.label : null;
  }

  // Filter check helper for schedule cells
  const isCellMatchingFilter = (slotData) => {
    if (!slotData) return true;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchSubject = slotData.subject?.toLowerCase().includes(term);
      const matchTeacher = slotData.teacher?.toLowerCase().includes(term);
      const matchCoTeacher = slotData.coTeacher?.toLowerCase().includes(term);
      const matchRoom = slotData.roomName?.toLowerCase().includes(term);
      const matchGroup = slotData.groupName?.toLowerCase().includes(term);

      if (!matchSubject && !matchTeacher && !matchCoTeacher && !matchRoom && !matchGroup) {
        return false;
      }
    }

    if (filterHighCognitive && !slotData.isHighCognitiveLoad) return false;
    if (filterCoTeacher && !slotData.coTeacher) return false;
    if (selectedSubjectFilter !== "ALL" && slotData.subject !== selectedSubjectFilter) return false;

    return true;
  };

  // Drag and Drop Logic
  const handleDragStart = (e, groupName, day, hour, slotData) => {
    setDraggedCell({ groupName, day, hour, slotData });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify({ groupName, day, hour }));
  };

  const handleDragOver = (e, groupName, day, hour) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!dragOverCell || dragOverCell.groupName !== groupName || dragOverCell.day !== day || dragOverCell.hour !== hour) {
      setDragOverCell({ groupName, day, hour });
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetGroupName, targetDay, targetHour) => {
    e.preventDefault();
    setDragOverCell(null);

    if (!draggedCell) return;
    const { groupName: sourceGroupName, day: sourceDay, hour: sourceHour, slotData: sourceData } = draggedCell;

    // Ignore if dropped on same cell
    if (sourceGroupName === targetGroupName && sourceDay === targetDay && sourceHour === targetHour) {
      setDraggedCell(null);
      return;
    }

    // Check blocked slot
    if (getBlockedLabel(targetDay, targetHour)) {
      alert("No es pot moure una activitat a una franja bloquejada globalment.");
      setDraggedCell(null);
      return;
    }

    const updatedSchedules = JSON.parse(JSON.stringify(schedules));

    // Target current data
    const targetData = updatedSchedules[targetGroupName]?.[targetDay]?.[targetHour] || null;

    // Set target cell to source data
    if (!updatedSchedules[targetGroupName]) updatedSchedules[targetGroupName] = {};
    if (!updatedSchedules[targetGroupName][targetDay]) updatedSchedules[targetGroupName][targetDay] = {};
    updatedSchedules[targetGroupName][targetDay][targetHour] = sourceData;

    // Set source cell to target data (swap or clear)
    if (!updatedSchedules[sourceGroupName]) updatedSchedules[sourceGroupName] = {};
    if (!updatedSchedules[sourceGroupName][sourceDay]) updatedSchedules[sourceGroupName][sourceDay] = {};

    if (targetData) {
      updatedSchedules[sourceGroupName][sourceDay][sourceHour] = targetData;
    } else {
      delete updatedSchedules[sourceGroupName][sourceDay][sourceHour];
    }

    const actionText = targetData
      ? `S'han intercanviat "${sourceData.subject}" i "${targetData.subject}" (${targetDay} ${targetHour})`
      : `Moguda "${sourceData.subject}" a ${targetDay} ${targetHour}`;

    updateSchedulesWithUndo(updatedSchedules, actionText);
    setDraggedCell(null);
  };

  const handleAssignSubjectToCell = (groupName, day, hour, activityId) => {
    const updatedSchedules = JSON.parse(JSON.stringify(schedules));

    if (!activityId) {
      delete updatedSchedules[groupName]?.[day]?.[hour];
      updateSchedulesWithUndo(updatedSchedules, `Casella buidada (${day} ${hour})`);
    } else {
      const act = activities.find(a => a.id === activityId);
      const teacherObj = teachers.find(t => t.id === act?.teacherId);
      const coTeacherObj = teachers.find(t => t.id === act?.coTeacherId);
      const groupObj = groups.find(g => g.id === act?.groupId);
      const roomObj = rooms.find(r => r.id === act?.roomId);

      if (act && teacherObj && groupObj) {
        if (!updatedSchedules[groupName]) updatedSchedules[groupName] = {};
        if (!updatedSchedules[groupName][day]) updatedSchedules[groupName][day] = {};

        updatedSchedules[groupName][day][hour] = {
          subject: act.subject,
          teacher: teacherObj.name,
          teacherId: teacherObj.id,
          coTeacher: coTeacherObj ? coTeacherObj.name : null,
          coTeacherId: act.coTeacherId || null,
          roomId: act.roomId || null,
          roomName: roomObj ? roomObj.name : null,
          activityId: act.id,
          groupId: groupObj.id,
          groupName: groupObj.name,
          isHighCognitiveLoad: act.isHighCognitiveLoad
        };

        updateSchedulesWithUndo(updatedSchedules, `Assignada "${act.subject}" a ${day} ${hour}`);
      }
    }
    setEditingCell(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-800 border border-blue-500/80 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Controls & Navigation Bar */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-sm">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* View Switcher Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700/70 text-xs font-medium">
            <button
              onClick={() => setViewMode("GROUP")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === "GROUP" ? "bg-blue-600 text-white font-bold shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Per Grup</span>
            </button>

            <button
              onClick={() => setViewMode("TEACHER")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === "TEACHER" ? "bg-blue-600 text-white font-bold shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Per Mestre</span>
            </button>

            {rooms.length > 0 && (
              <button
                onClick={() => setViewMode("ROOM")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === "ROOM" ? "bg-blue-600 text-white font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Per Aula Especial</span>
              </button>
            )}

            <button
              onClick={() => setViewMode("MASTER")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === "MASTER" ? "bg-blue-600 text-white font-bold shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Master Centre</span>
            </button>
          </div>

          {/* Undo / Redo Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                undoStack.length > 0
                  ? "bg-slate-700 hover:bg-slate-600 text-white border-slate-600 shadow-sm"
                  : "bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed"
              }`}
              title="Desfer darrera acció (Ctrl + Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Desfer ({undoStack.length})</span>
            </button>

            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                redoStack.length > 0
                  ? "bg-slate-700 hover:bg-slate-600 text-white border-slate-600 shadow-sm"
                  : "bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed"
              }`}
              title="Refer acció (Ctrl + Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span>Refer ({redoStack.length})</span>
            </button>
          </div>

        </div>

        {/* Filters and View Options */}
        <div className="pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Dynamic Selector per View Mode */}
          <div className="flex items-center gap-2">
            {viewMode === "GROUP" && (
              <>
                <span className="text-slate-400 font-medium">Grup seleccionat:</span>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
                >
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </>
            )}

            {viewMode === "TEACHER" && (
              <>
                <span className="text-slate-400 font-medium">Mestre seleccionat:</span>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </>
            )}

            {viewMode === "ROOM" && (
              <>
                <span className="text-slate-400 font-medium">Aula seleccionada:</span>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </>
            )}
          </div>

          {/* Search and Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cercar matèria o mestre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-56"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Subject Dropdown Filter */}
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Totes les assignatures</option>
              {allSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            {/* High Cognitive Filter Toggle */}
            <button
              onClick={() => setFilterHighCognitive(!filterHighCognitive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                filterHighCognitive
                  ? "bg-purple-600/30 border-purple-500 text-purple-200"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>Càrrega Alta</span>
            </button>

            {/* Co-teaching Filter Toggle */}
            <button
              onClick={() => setFilterCoTeacher(!filterCoTeacher)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                filterCoTeacher
                  ? "bg-emerald-600/30 border-emerald-500 text-emerald-200"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Co-docència</span>
            </button>

          </div>

        </div>

      </div>

      {/* VIEW BY GROUP */}
      {viewMode === "GROUP" && selectedGroup && (
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Horari Lectiu: {selectedGroup.name}</span>
            </h3>
            <span className="text-[11px] text-slate-400 italic">
              💡 Pots arrossegar i amollar qualsevol casella per moure o intercanviar assignatures
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300">
                  {days.map(d => (
                    <th key={d} className="p-2.5 border border-slate-700 font-bold text-blue-300 w-1/5">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {days.map(day => {
                    const daySlots = getSlots(day);
                    return (
                      <td key={day} className="p-1 border border-slate-700 align-top">
                        <div className="space-y-1.5">
                          {daySlots.map(hour => {
                            const slotData = schedules[selectedGroup.name]?.[day]?.[hour];
                            const blockedLabel = getBlockedLabel(day, hour);
                            const matchesFilter = isCellMatchingFilter(slotData);

                            const isDragOver =
                              dragOverCell &&
                              dragOverCell.groupName === selectedGroup.name &&
                              dragOverCell.day === day &&
                              dragOverCell.hour === hour;

                            return (
                              <div
                                key={hour}
                                onDragOver={(e) => handleDragOver(e, selectedGroup.name, day, hour)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, selectedGroup.name, day, hour)}
                                className="space-y-0.5"
                              >
                                <span className="block font-mono text-[9px] text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded text-left">
                                  {hour}
                                </span>

                                {blockedLabel ? (
                                  <div className="h-16 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col items-center justify-center p-1 text-[10px] text-amber-300">
                                    <Lock className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                                    <span className="font-semibold truncate max-w-full">{blockedLabel}</span>
                                  </div>
                                ) : (
                                  <div
                                    draggable={!!slotData}
                                    onDragStart={(e) => slotData && handleDragStart(e, selectedGroup.name, day, hour, slotData)}
                                    onClick={() => setEditingCell({ groupName: selectedGroup.name, day, hour })}
                                    className={`relative h-16 rounded-xl p-1.5 text-[11px] flex flex-col items-center justify-center gap-0.5 transition-all text-center cursor-pointer select-none group ${
                                      isDragOver
                                        ? "bg-blue-500/40 border-2 border-blue-400 scale-[1.02] shadow-lg"
                                        : !matchesFilter
                                        ? "opacity-30 bg-slate-900/40 border border-slate-800"
                                        : slotData
                                        ? "bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/30 hover:border-blue-400 text-white shadow-sm"
                                        : "bg-slate-900/40 border border-dashed border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-400"
                                    }`}
                                  >
                                    {slotData ? (
                                      <>
                                        <div className="font-bold text-blue-300 line-clamp-1 flex items-center justify-center gap-1">
                                          <span>{slotData.subject}</span>
                                          {slotData.isHighCognitiveLoad && <Brain className="w-3 h-3 text-purple-400 shrink-0" />}
                                        </div>
                                        <div className="text-[10px] text-slate-300 opacity-90 truncate max-w-full font-medium">
                                          ({slotData.teacher}{slotData.coTeacher ? ` + ${slotData.coTeacher}` : ""})
                                        </div>
                                        {slotData.roomName && (
                                          <div className="text-[9px] text-amber-300/90 font-semibold truncate max-w-full">
                                            🏢 {slotData.roomName}
                                          </div>
                                        )}
                                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition text-slate-400">
                                          <GripVertical className="w-3 h-3" />
                                        </div>
                                      </>
                                    ) : (
                                      <span className="text-[10px] font-medium text-slate-500 group-hover:text-blue-400">+ Buida</span>
                                    )}
                                  </div>
                                )}
                              </div>
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
      )}

      {/* VIEW BY TEACHER */}
      {viewMode === "TEACHER" && selectedTeacher && (
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Horari Individual: {selectedTeacher.name}</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300">
                  {days.map(d => (
                    <th key={d} className="p-2.5 border border-slate-700 font-bold text-emerald-300 w-1/5">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {days.map(day => {
                    const daySlots = getSlots(day);
                    return (
                      <td key={day} className="p-1 border border-slate-700 align-top">
                        <div className="space-y-1.5">
                          {daySlots.map((hour, slotIdx) => {
                            const isTeacherAvail = selectedTeacher.availability?.[day]?.[slotIdx] !== false;

                            let assignedSlot = null;
                            Object.entries(schedules).forEach(([gName, sch]) => {
                              const item = sch?.[day]?.[hour];
                              if (item && (item.teacherId === selectedTeacher.id || item.coTeacherId === selectedTeacher.id)) {
                                assignedSlot = { ...item, groupName: gName };
                              }
                            });

                            const blockedLabel = getBlockedLabel(day, hour);
                            const matchesFilter = isCellMatchingFilter(assignedSlot);

                            return (
                              <div key={hour} className="space-y-0.5">
                                <span className="block font-mono text-[9px] text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded text-left">
                                  {hour}
                                </span>

                                {!isTeacherAvail ? (
                                  <div className="h-16 bg-rose-500/10 border border-rose-500/30 rounded-xl flex flex-col items-center justify-center p-1 text-[10px] text-rose-300">
                                    <span className="font-semibold">No disponible</span>
                                  </div>
                                ) : blockedLabel ? (
                                  <div className="h-16 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col items-center justify-center p-1 text-[10px] text-amber-300">
                                    <Lock className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                                    <span className="font-semibold truncate max-w-full">{blockedLabel}</span>
                                  </div>
                                ) : assignedSlot ? (
                                  <div className={`h-16 bg-emerald-600/20 border border-emerald-500/50 rounded-xl p-1.5 flex flex-col items-center justify-center text-center transition ${
                                    !matchesFilter ? "opacity-30" : ""
                                  }`}>
                                    <span className="font-bold text-emerald-300 truncate max-w-full">{assignedSlot.subject}</span>
                                    <span className="text-[10px] text-slate-300 font-semibold">{assignedSlot.groupName}</span>
                                    {assignedSlot.roomName && (
                                      <span className="text-[9px] text-amber-300 truncate max-w-full">🏢 {assignedSlot.roomName}</span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="h-16 bg-slate-900/30 rounded-xl flex items-center justify-center text-slate-600 text-[10px]">
                                    Lliure
                                  </div>
                                )}
                              </div>
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
      )}

      {/* VIEW BY ROOM */}
      {viewMode === "ROOM" && selectedRoom && (
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>Ocupació Aula Especial: {selectedRoom.name}</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300">
                  {days.map(d => (
                    <th key={d} className="p-2.5 border border-slate-700 font-bold text-purple-300 w-1/5">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {days.map(day => {
                    const daySlots = getSlots(day);
                    return (
                      <td key={day} className="p-1 border border-slate-700 align-top">
                        <div className="space-y-1.5">
                          {daySlots.map(hour => {
                            let assignedSlot = null;
                            Object.entries(schedules).forEach(([gName, sch]) => {
                              const item = sch?.[day]?.[hour];
                              if (item && item.roomId === selectedRoom.id) {
                                assignedSlot = { ...item, groupName: gName };
                              }
                            });

                            const blockedLabel = getBlockedLabel(day, hour);

                            return (
                              <div key={hour} className="space-y-0.5">
                                <span className="block font-mono text-[9px] text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded text-left">
                                  {hour}
                                </span>

                                {blockedLabel ? (
                                  <div className="h-16 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col items-center justify-center p-1 text-[10px] text-amber-300">
                                    <Lock className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                                    <span className="font-semibold">{blockedLabel}</span>
                                  </div>
                                ) : assignedSlot ? (
                                  <div className="h-16 bg-purple-600/20 border border-purple-500/50 rounded-xl p-1.5 flex flex-col items-center justify-center text-center">
                                    <span className="font-bold text-purple-300 truncate max-w-full">{assignedSlot.subject}</span>
                                    <span className="text-[10px] text-slate-200 font-semibold">{assignedSlot.groupName}</span>
                                    <span className="text-[9px] text-slate-400 truncate max-w-full">({assignedSlot.teacher})</span>
                                  </div>
                                ) : (
                                  <div className="h-16 bg-slate-900/30 rounded-xl flex items-center justify-center text-slate-600 text-[10px]">
                                    Lliure
                                  </div>
                                )}
                              </div>
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
      )}

      {/* MASTER CENTRE VIEW */}
      {viewMode === "MASTER" && (
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-indigo-400" />
              <span>Visió Master General del Centre (Tots els Grups)</span>
            </h3>
          </div>

          <div className="space-y-6">
            {days.map(day => {
              const daySlots = getSlots(day);
              return (
                <div key={day} className="space-y-2">
                  <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700/60 inline-block">
                    📅 {day}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-slate-300">
                          <th className="p-2 border border-slate-700 w-24">Franja</th>
                          {groups.map(g => (
                            <th key={g.id} className="p-2 border border-slate-700 font-bold text-slate-200">{g.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {daySlots.map(hour => {
                          const blockedLabel = getBlockedLabel(day, hour);
                          return (
                            <tr key={hour} className="hover:bg-slate-750/30">
                              <td className="p-1 border border-slate-700 font-mono text-[10px] bg-slate-900/50 text-slate-400">
                                {hour}
                              </td>
                              {groups.map(g => {
                                const slotData = schedules[g.name]?.[day]?.[hour];
                                return (
                                  <td key={g.id} className="p-1 border border-slate-700">
                                    {blockedLabel ? (
                                      <div className="p-1 bg-amber-500/10 text-amber-300 rounded text-[10px] truncate">
                                        🔒 {blockedLabel}
                                      </div>
                                    ) : slotData ? (
                                      <div className="p-1.5 bg-blue-600/20 border border-blue-500/40 rounded text-left">
                                        <div className="font-bold text-blue-300 text-[11px] truncate">{slotData.subject}</div>
                                        <div className="text-[10px] text-slate-300 truncate">{slotData.teacher}</div>
                                      </div>
                                    ) : (
                                      <div className="text-[10px] text-slate-600 py-1">-</div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingCell && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Modificar Casella: {editingCell.day} ({editingCell.hour})</span>
              <button onClick={() => setEditingCell(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </h3>
            <p className="text-xs text-slate-300">Grup: <span className="font-bold text-blue-400">{editingCell.groupName}</span></p>

            <div className="space-y-2">
              <label className="block text-xs text-slate-400 font-medium">Selecciona l'activitat per assignar:</label>
              
              <button
                onClick={() => handleAssignSubjectToCell(editingCell.groupName, editingCell.day, editingCell.hour, null)}
                className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-rose-300 transition"
              >
                🚫 Deixar casella buida
              </button>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pt-2">
                {activities
                  .filter(a => {
                    const g = groups.find(gr => gr.id === a.groupId);
                    return g && g.name === editingCell.groupName;
                  })
                  .map(act => {
                    const teacherObj = teachers.find(t => t.id === act.teacherId);
                    const coTeacherObj = teachers.find(t => t.id === act.coTeacherId);

                    return (
                      <button
                        key={act.id}
                        onClick={() => handleAssignSubjectToCell(editingCell.groupName, editingCell.day, editingCell.hour, act.id)}
                        className="w-full text-left px-3 py-2.5 bg-slate-900/80 hover:bg-blue-600/30 border border-slate-700/80 hover:border-blue-500 rounded-xl text-xs text-white transition flex items-center justify-between"
                      >
                        <span className="font-bold flex items-center gap-1">
                          <span>{act.subject}</span>
                          {act.isHighCognitiveLoad && <Brain className="w-3 h-3 text-purple-400" />}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({teacherObj?.name}{coTeacherObj ? ` + ${coTeacherObj.name}` : ""})
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setEditingCell(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
