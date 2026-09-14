import React, { useState } from "react";
import { BookOpen, Plus, Trash2, Info, Pin, Filter, UserCheck, Building2, Brain, Sparkles, Settings, X, RotateCcw } from "lucide-react";
import { getSlotsForDay, INFANTIL_SUBJECTS, PRIMARIA_SUBJECTS } from "../utils/sampleData";

export default function ActivitiesTab({
  activities,
  setActivities,
  teachers,
  groups,
  rooms,
  days,
  slots,
  slotsByDay,
  infantilSubjects = INFANTIL_SUBJECTS,
  setInfantilSubjects,
  primariaSubjects = PRIMARIA_SUBJECTS,
  setPrimariaSubjects
}) {
  const [subject, setSubject] = useState("");
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || "");
  const [coTeacherId, setCoTeacherId] = useState("");
  const [groupId, setGroupId] = useState(groups[0]?.id || "");
  const [roomId, setRoomId] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(2);
  const [duration, setDuration] = useState(2); // Default 2 slots = 1h
  const [isHighCognitiveLoad, setIsHighCognitiveLoad] = useState(false);
  const [fixedDay, setFixedDay] = useState("");
  const [fixedHour, setFixedHour] = useState("");

  const [filterGroup, setFilterGroup] = useState("ALL");

  // Subject Pill Customization Modal State
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [activeCustomizeStage, setActiveCustomizeStage] = useState("PRIMARIA"); // "PRIMARIA" | "INFANTIL"
  const [newPillText, setNewPillText] = useState("");

  const selectedGroupObj = groups.find(g => g.id === groupId) || groups[0];
  const isInfantilGroup = selectedGroupObj?.stage === "INFANTIL" || selectedGroupObj?.name.toLowerCase().includes("i3") || selectedGroupObj?.name.toLowerCase().includes("i4") || selectedGroupObj?.name.toLowerCase().includes("i5") || selectedGroupObj?.name.toLowerCase().includes("infantil");

  const currentInfantilList = infantilSubjects || INFANTIL_SUBJECTS;
  const currentPrimariaList = primariaSubjects || PRIMARIA_SUBJECTS;
  const suggestedSubjects = isInfantilGroup ? currentInfantilList : currentPrimariaList;

  // Add custom pill handler
  const handleAddCustomPill = (e) => {
    e.preventDefault();
    const text = newPillText.trim();
    if (!text) return;

    if (activeCustomizeStage === "INFANTIL") {
      if (!currentInfantilList.includes(text)) {
        if (setInfantilSubjects) setInfantilSubjects([...currentInfantilList, text]);
      }
    } else {
      if (!currentPrimariaList.includes(text)) {
        if (setPrimariaSubjects) setPrimariaSubjects([...currentPrimariaList, text]);
      }
    }
    setNewPillText("");
  };

  // Delete pill handler
  const handleDeletePill = (pillToDelete, stage) => {
    if (stage === "INFANTIL") {
      if (setInfantilSubjects) setInfantilSubjects(currentInfantilList.filter(p => p !== pillToDelete));
    } else {
      if (setPrimariaSubjects) setPrimariaSubjects(currentPrimariaList.filter(p => p !== pillToDelete));
    }
  };

  // Restore defaults handler
  const handleRestoreDefaultPills = (stage) => {
    if (stage === "INFANTIL") {
      if (setInfantilSubjects) setInfantilSubjects([...INFANTIL_SUBJECTS]);
    } else {
      if (setPrimariaSubjects) setPrimariaSubjects([...PRIMARIA_SUBJECTS]);
    }
  };

  const getSlots = (d) => getSlotsForDay(slotsByDay || slots, d);
  const availableFixedHours = fixedDay ? getSlots(fixedDay) : [];

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      alert("Si us plau, indica el nom de l'assignatura.");
      return;
    }
    if (!teacherId) {
      alert("Si us plau, selecciona un mestre responsable.");
      return;
    }
    if (!groupId) {
      alert("Si us plau, selecciona un grup classe.");
      return;
    }

    if (teacherId === coTeacherId) {
      alert("El mestre titular i el co-docent no poden ser la mateixa persona.");
      return;
    }

    if ((fixedDay && !fixedHour) || (!fixedDay && fixedHour)) {
      alert("Per fixar una activitat cal seleccionar conjuntament el dia I l'hora.");
      return;
    }

    const newActivity = {
      id: `a_${Date.now()}`,
      subject: subject.trim(),
      teacherId,
      coTeacherId: coTeacherId || "",
      groupId,
      roomId: roomId || "",
      weeklyHours: Number(weeklyHours) || 1,
      duration: Number(duration) || 1,
      isHighCognitiveLoad,
      fixedDay,
      fixedHour,
      blockedSlots: []
    };

    setActivities([...activities, newActivity]);
    setSubject("");
    setCoTeacherId("");
    setRoomId("");
    setIsHighCognitiveLoad(false);
    setFixedDay("");
    setFixedHour("");
  };

  const handleDeleteActivity = (id) => {
    if (confirm("Segur que vols eliminar aquesta activitat?")) {
      setActivities(activities.filter(a => a.id !== id));
    }
  };

  const filteredActivities = activities.filter(a => {
    if (filterGroup !== "ALL" && a.groupId !== filterGroup) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-100 text-sm">3. Afegir Activitats, Co-docències i Espais</p>
          <p>Indica les matèries de cada grup. Pots definir durades de 30m, 45m, 60m (1h) o 90m (1.5h). Les sessions de lectura, matèries de 45m, tallers o ambients s'adaptaran automàticament a les franges i dies configurats per al teu centre.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Add Form */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Nova Activitat Lectiva</span>
          </h2>

          <form onSubmit={handleAddActivity} className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 font-medium">Nom de l'assignatura / Àmbit</label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-amber-300 font-semibold">
                    {isInfantilGroup ? "🎨 Àmbits Infantil" : "📚 Àrees Primària"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCustomizeStage(isInfantilGroup ? "INFANTIL" : "PRIMARIA");
                      setIsCustomizeModalOpen(true);
                    }}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 hover:underline"
                    title="Personalitzar la llista de matèries i àmbits suggerits"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={isInfantilGroup ? "Ex. Ambients d'Aprenentatge, Psicomotricitat..." : "Ex. Matemàtiques, Llengua Catalana..."}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                required
              />

              {/* Quick Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {suggestedSubjects.map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubject(sub)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 hover:bg-blue-600/30 border border-slate-700 hover:border-blue-500 text-slate-300 transition"
                  >
                    + {sub}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Mestre titular</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-indigo-300 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Co-docent (Opcional)</span>
                </label>
                <select
                  value={coTeacherId}
                  onChange={(e) => setCoTeacherId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Sense co-docent --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Grup classe</label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-amber-300 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span>Aula Especial</span>
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Aula del grup --</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Hores setmanals totals</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="25"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Durada per sessió</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>⏱️ 30 minuts / 1 franja curta</option>
                  <option value={1.5}>⏱️ 45 minuts (1 franja de 45m / 1.5 de 30m)</option>
                  <option value={1.66}>⏱️ 50 - 55 minuts (Sessió ESO/Primària)</option>
                  <option value={2}>⏱️ 1 hora (2 franges de 30m / 1h lectiva)</option>
                  <option value={2.5}>⏱️ 1 hora i 15 minuts (75m / Taller)</option>
                  <option value={3}>⏱️ 1 hora i mitja (90m / 3 franges / Ambients)</option>
                  <option value={4}>⏱️ 2 hores segides (120m / 4 franges)</option>
                </select>
              </div>
            </div>

            {/* Dynamic Session Calculation Preview & Info */}
            <div className="bg-slate-900/80 border border-slate-700/80 p-2.5 rounded-lg space-y-1 text-[11px] text-slate-300">
              <div className="flex items-center justify-between text-blue-300 font-semibold">
                <span>📊 Sessions s'ubicaran:</span>
                <span className="bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700 text-white font-bold">
                  {Math.max(1, Math.round(Number(weeklyHours) / (Number(duration) * 0.5)))} sessions / setmana
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {Number(duration) === 1.5 && "💡 Sessió de 45 minuts: s'ubicarà en una franja de 45m o s'ajustarà a la retícula del dia."}
                {Number(duration) === 1 && "💡 Sessió de 30 minuts: ideal per a lectura, hàbits o tutories curtes."}
                {Number(duration) === 2 && "💡 Sessió de 1 hora: durada ordinària lectiva."}
                {Number(duration) === 3 && "💡 Sessió de 1h 30m: ideal per a ambients, projectes o educació física."}
                {Number(duration) !== 1 && Number(duration) !== 1.5 && Number(duration) !== 2 && Number(duration) !== 3 && "💡 Durada personalitzada ajustada automàticament al motor CSP."}
              </p>
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs text-purple-300 font-medium cursor-pointer bg-purple-950/30 p-2 rounded-lg border border-purple-800/40 hover:bg-purple-900/40 transition">
                <input
                  type="checkbox"
                  checked={isHighCognitiveLoad}
                  onChange={(e) => setIsHighCognitiveLoad(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>Alta càrrega cognitiva (Prioritzar matí)</span>
              </label>
            </div>

            {/* Fixed Day & Hour */}
            <div className="border-t border-slate-700/80 pt-3 space-y-2">
              <label className="block text-slate-300 font-semibold flex items-center gap-1.5 text-xs">
                <Pin className="w-3.5 h-3.5 text-amber-400" />
                <span>Dia i Hora Fixa (Opcional)</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={fixedDay}
                  onChange={(e) => {
                    setFixedDay(e.target.value);
                    setFixedHour("");
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- No fixar dia --</option>
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <select
                  value={fixedHour}
                  onChange={(e) => setFixedHour(e.target.value)}
                  disabled={!fixedDay}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-amber-500 disabled:opacity-40"
                >
                  <option value="">-- No fixar hora --</option>
                  {availableFixedHours.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition shadow-md shadow-blue-500/20 text-xs mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Afegir Activitat</span>
            </button>
          </form>
        </div>

        {/* Activities Table */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/80 rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Llista d'Activitats Lectives</span>
              <span className="text-xs font-normal px-2 py-0.5 bg-slate-700 rounded-full text-slate-300">
                {activities.length} total
              </span>
            </h3>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Filtrar per grup:</span>
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="ALL">Tots els grups</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300 border-b border-slate-700">
                  <th className="p-2.5 font-semibold">Assignatura</th>
                  <th className="p-2.5 font-semibold">Mestre(s)</th>
                  <th className="p-2.5 font-semibold">Grup / Aula</th>
                  <th className="p-2.5 font-semibold text-center">Hores</th>
                  <th className="p-2.5 font-semibold">Detalls Pedagògics</th>
                  <th className="p-2.5 font-semibold text-right">Accions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredActivities.map(a => {
                  const teacherName = teachers.find(t => t.id === a.teacherId)?.name || "Desconegut";
                  const coTeacherName = teachers.find(t => t.id === a.coTeacherId)?.name;
                  const groupName = groups.find(g => g.id === a.groupId)?.name || "Desconegut";
                  const roomName = rooms.find(r => r.id === a.roomId)?.name;

                  return (
                    <tr key={a.id} className="hover:bg-slate-750">
                      <td className="p-2.5 font-medium text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{a.subject}</span>
                          {a.isHighCognitiveLoad && (
                            <span title="Alta càrrega cognitiva">
                              <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-2.5 text-slate-300">
                        <div>{teacherName}</div>
                        {coTeacherName && (
                          <div className="text-[10px] text-indigo-300 font-semibold flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            <span>Co-docent: {coTeacherName}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-2.5 text-slate-300">
                        <div className="font-semibold text-blue-300">{groupName}</div>
                        {roomName && (
                          <div className="text-[10px] text-amber-300 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>{roomName}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-2.5 text-center font-bold text-slate-200">{a.weeklyHours}h</td>

                      <td className="p-2.5 text-slate-400">
                        {a.fixedDay && a.fixedHour ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px]">
                            <Pin className="w-3 h-3" />
                            {a.fixedDay} ({a.fixedHour})
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">-</span>
                        )}
                      </td>

                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => handleDeleteActivity(a.id)}
                          className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition"
                          title="Eliminar activitat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredActivities.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-500">
                      No s'ha trobat cap activitat per al filtre seleccionat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Subject Customization Modal */}
      {isCustomizeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Personalitzar Àmbits i Àrees Suggerides</h3>
                  <p className="text-[11px] text-slate-400">Afagueix, modifica o elimina els botons de selecció ràpida</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomizeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stage Selector */}
            <div className="flex gap-2 border-b border-slate-700 pb-2 text-xs">
              <button
                onClick={() => setActiveCustomizeStage("PRIMARIA")}
                className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                  activeCustomizeStage === "PRIMARIA" ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                📚 Educació Primària
              </button>
              <button
                onClick={() => setActiveCustomizeStage("INFANTIL")}
                className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                  activeCustomizeStage === "INFANTIL" ? "bg-amber-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                🎨 Educació Infantil
              </button>
            </div>

            {/* Add new pill form */}
            <form onSubmit={handleAddCustomPill} className="flex gap-2">
              <input
                type="text"
                value={newPillText}
                onChange={(e) => setNewPillText(e.target.value)}
                placeholder={
                  activeCustomizeStage === "INFANTIL"
                    ? "Ex. Tallers Intercicle, Joc de Taula..."
                    : "Ex. Robòtica / STEAM, Escacs, Teatre..."
                }
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-1 text-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Afegir</span>
              </button>
            </form>

            {/* Active Pills List */}
            <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-1.5">
                {(activeCustomizeStage === "INFANTIL" ? currentInfantilList : currentPrimariaList).map(pill => (
                  <div
                    key={pill}
                    className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-full text-xs text-slate-200"
                  >
                    <span>{pill}</span>
                    <button
                      onClick={() => handleDeletePill(pill, activeCustomizeStage)}
                      className="text-slate-400 hover:text-rose-400 transition"
                      title="Eliminar aquest suggeriment"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between border-t border-slate-700 pt-3 text-xs">
              <button
                onClick={() => handleRestoreDefaultPills(activeCustomizeStage)}
                className="text-slate-400 hover:text-amber-300 font-semibold flex items-center gap-1 hover:underline text-[11px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar valors per defecte</span>
              </button>

              <button
                onClick={() => setIsCustomizeModalOpen(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
              >
                Tancar i Desar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
