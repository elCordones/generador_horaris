import React, { useState } from "react";
import { Users, Building2, Plus, Trash2, Info } from "lucide-react";

export default function GroupsTab({ groups, setGroups, rooms, setRooms, activities }) {
  const [activeSubTab, setActiveSubTab] = useState("GROUPS"); // "GROUPS" | "ROOMS"
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupStage, setNewGroupStage] = useState("PRIMARIA");
  const [newRoomName, setNewRoomName] = useState("");

  // Handlers Groups
  const handleAddGroup = (e) => {
    e.preventDefault();
    const name = newGroupName.trim();
    if (!name) return;

    if (groups.some(g => g.name.toLowerCase() === name.toLowerCase())) {
      alert(`Ja existeix un grup anomenat "${name}".`);
      return;
    }

    const newGroup = { id: `g_${Date.now()}`, name, stage: newGroupStage };
    setGroups([...groups, newGroup]);
    setNewGroupName("");
  };

  const handleDeleteGroup = (id) => {
    if (confirm("Segur que vols eliminar aquest grup? Esborraràs també les seves activitats.")) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  // Handlers Rooms
  const handleAddRoom = (e) => {
    e.preventDefault();
    const name = newRoomName.trim();
    if (!name) return;

    if (rooms.some(r => r.name.toLowerCase() === name.toLowerCase())) {
      alert(`Ja existeix una aula especial anomenada "${name}".`);
      return;
    }

    const newRoom = { id: `r_${Date.now()}`, name };
    setRooms([...rooms, newRoom]);
    setNewRoomName("");
  };

  const handleDeleteRoom = (id) => {
    if (confirm("Segur que vols eliminar aquesta aula especial?")) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-100 text-sm">2. Afegir Grups i Aules Especials</p>
          <p>Defineix els grups classe de l'alumnat i els espais comuns o aules especials (gimnàs, música, laboratori, informàtica) per evitar solapaments d'ús d'aules.</p>
        </div>
      </div>

      {/* Sub-tabs selector */}
      <div className="flex border-b border-slate-700 max-w-2xl mx-auto gap-4">
        <button
          onClick={() => setActiveSubTab("GROUPS")}
          className={`flex items-center gap-2 pb-2.5 px-2 text-sm font-bold border-b-2 transition ${
            activeSubTab === "GROUPS"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Grups Classe ({groups.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("ROOMS")}
          className={`flex items-center gap-2 pb-2.5 px-2 text-sm font-bold border-b-2 transition ${
            activeSubTab === "ROOMS"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Aules Especials i Espais ({rooms.length})</span>
        </button>
      </div>

      {/* GROUPS SUB-TAB */}
      {activeSubTab === "GROUPS" && (
        <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700/80 rounded-xl p-6 space-y-6">
          <form onSubmit={handleAddGroup} className="flex flex-wrap sm:flex-nowrap gap-3">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Exemple: I3, I4, I5, 1r A, 3r B..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />

            <select
              value={newGroupStage}
              onChange={(e) => setNewGroupStage(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="INFANTIL">🎨 Educació Infantil (I3-I5)</option>
              <option value="PRIMARIA">📚 Educació Primària (1r-6è)</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition shadow-md shadow-blue-500/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Afegir Grup</span>
            </button>
          </form>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Grups Enregistrats ({groups.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groups.map(g => {
                const groupActivities = activities.filter(a => a.groupId === g.id);
                const totalHours = groupActivities.reduce((sum, a) => sum + (Number(a.weeklyHours) || 0), 0);
                const isInfantil = g.stage === "INFANTIL" || g.name.toLowerCase().includes("i3") || g.name.toLowerCase().includes("i4") || g.name.toLowerCase().includes("i5") || g.name.toLowerCase().includes("infantil");

                return (
                  <div
                    key={g.id}
                    className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3.5 flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isInfantil ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"}`}>
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-white text-sm">{g.name}</h4>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                            isInfantil
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}>
                            {isInfantil ? "Infantil" : "Primària"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {groupActivities.length} assignatures ({totalHours}h setmanals)
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteGroup(g.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition"
                      title="Eliminar grup"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {groups.length === 0 && (
                <p className="col-span-2 text-center text-xs text-slate-500 py-8">
                  No hi ha cap grup afegit. Utilitza el camp de text per afegir el primer grup.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ROOMS SUB-TAB */}
      {activeSubTab === "ROOMS" && (
        <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700/80 rounded-xl p-6 space-y-6">
          <form onSubmit={handleAddRoom} className="flex gap-3">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Exemple: Gimnàs / Pista, Aula de Música, Laboratori..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition shadow-md shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Afegir Aula Especial</span>
            </button>
          </form>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Aules Especials Enregistrades ({rooms.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rooms.map(r => {
                const roomActivities = activities.filter(a => a.roomId === r.id);
                const totalHours = roomActivities.reduce((sum, a) => sum + (Number(a.weeklyHours) || 0), 0);

                return (
                  <div
                    key={r.id}
                    className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3.5 flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{r.name}</h4>
                        <p className="text-[11px] text-slate-400">
                          {roomActivities.length} matèries assignades ({totalHours}h/setm)
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteRoom(r.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition"
                      title="Eliminar espai"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {rooms.length === 0 && (
                <p className="col-span-2 text-center text-xs text-slate-500 py-8">
                  No hi ha cap aula especial afegida. Les aules especials eviten que dos grups reservin el mateix espai (com el gimnàs o la sala de música).
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
