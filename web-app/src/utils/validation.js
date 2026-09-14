import { getSlotsForDay } from "./sampleData";

/**
 * Real-Time Techno-Pedagogical Validation Engine (v3 with Per-Day Asymmetric Slots)
 */

export function validateProject(data) {
  const {
    teachers = [],
    groups = [],
    rooms = [],
    activities = [],
    blockedSlots = [],
    days = [],
    slots,
    slotsByDay
  } = data;

  const errors = [];
  const warnings = [];

  const getSlots = (d) => getSlotsForDay(slotsByDay || slots, d);

  // Total slots count across all days
  const totalSlotsCount = days.reduce((sum, d) => sum + getSlots(d).length, 0);
  const availableSlotsForGroups = totalSlotsCount - blockedSlots.length;

  // 1. Check duplicate teacher names
  const teacherNames = new Map();
  teachers.forEach(t => {
    const nameNorm = (t.name || "").trim().toLowerCase();
    if (!nameNorm) return;
    if (teacherNames.has(nameNorm)) {
      errors.push({
        id: `dup-t-${t.id}`,
        type: "error",
        title: "Nom de mestre duplicat",
        message: `El mestre "${t.name}" apareix duplicat a la llista.`
      });
    } else {
      teacherNames.set(nameNorm, t);
    }
  });

  // 2. Check duplicate group names
  const groupNames = new Map();
  groups.forEach(g => {
    const nameNorm = (g.name || "").trim().toLowerCase();
    if (!nameNorm) return;
    if (groupNames.has(nameNorm)) {
      errors.push({
        id: `dup-g-${g.id}`,
        type: "error",
        title: "Nom de grup duplicat",
        message: `El grup "${g.name}" apareix duplicat a la llista.`
      });
    } else {
      groupNames.set(nameNorm, g);
    }
  });

  // 3. Check duplicate room names
  const roomNames = new Map();
  rooms.forEach(r => {
    const nameNorm = (r.name || "").trim().toLowerCase();
    if (!nameNorm) return;
    if (roomNames.has(nameNorm)) {
      errors.push({
        id: `dup-r-${r.id}`,
        type: "error",
        title: "Nom d'aula especial duplicat",
        message: `L'aula "${r.name}" apareix duplicada a la llista d'espais.`
      });
    } else {
      roomNames.set(nameNorm, r);
    }
  });

  // 4. Teacher hour overload check
  teachers.forEach(t => {
    let teacherAvailCount = 0;
    if (t.availability) {
      days.forEach(d => {
        const daySlots = getSlots(d);
        (t.availability[d] || []).forEach((avail, idx) => {
          if (avail !== false && idx < daySlots.length) teacherAvailCount++;
        });
      });
    } else {
      teacherAvailCount = totalSlotsCount;
    }

    const totalWeeklyHours = activities
      .filter(a => a.teacherId === t.id || a.coTeacherId === t.id)
      .reduce((sum, a) => sum + (Number(a.weeklyHours) || 0), 0);

    if (totalWeeklyHours > teacherAvailCount) {
      errors.push({
        id: `overload-t-${t.id}`,
        type: "error",
        title: "Mestre amb massa hores assignades",
        message: `El mestre "${t.name}" té ${totalWeeklyHours}h assignades, però només té ${teacherAvailCount}h de disponibilitat setmanal.`
      });
    }
  });

  // 5. Room hour overload check
  rooms.forEach(r => {
    const totalRoomHours = activities
      .filter(a => a.roomId === r.id)
      .reduce((sum, a) => sum + (Number(a.weeklyHours) || 0), 0);

    if (totalRoomHours > availableSlotsForGroups) {
      errors.push({
        id: `overload-r-${r.id}`,
        type: "error",
        title: "Sobrecàrrega d'hores a l'aula especial",
        message: `L'espai "${r.name}" té ${totalRoomHours}h reservades, però només hi ha ${availableSlotsForGroups}h lliures a la setmana.`
      });
    }
  });

  // 6. Group hour overload check
  groups.forEach(g => {
    const totalWeeklyHours = activities
      .filter(a => a.groupId === g.id)
      .reduce((sum, a) => sum + (Number(a.weeklyHours) || 0), 0);

    if (totalWeeklyHours > availableSlotsForGroups) {
      errors.push({
        id: `overload-g-${g.id}`,
        type: "error",
        title: "Sobrecàrrega d'hores en grup",
        message: `El grup "${g.name}" té ${totalWeeklyHours}h assignades, però només hi ha ${availableSlotsForGroups}h lliures a la setmana.`
      });
    }
  });

  // 7. Fixed slot conflicts
  const fixedSlotMapTeacher = new Map();
  const fixedSlotMapGroup = new Map();

  activities.forEach(a => {
    if (!a.fixedDay || !a.fixedHour) return;

    const teacherObj = teachers.find(t => t.id === a.teacherId);
    const groupObj = groups.find(g => g.id === a.groupId);
    const keyT = `${a.teacherId}|${a.fixedDay}|${a.fixedHour}`;
    const keyG = `${a.groupId}|${a.fixedDay}|${a.fixedHour}`;

    if (fixedSlotMapTeacher.has(keyT)) {
      const prev = fixedSlotMapTeacher.get(keyT);
      errors.push({
        id: `fixed-conflict-t-${a.id}`,
        type: "error",
        title: "Conflicte d'activitat fixa de mestre",
        message: `El mestre "${teacherObj?.name}" té dues activitats fixes el ${a.fixedDay} a les ${a.fixedHour} ("${a.subject}" i "${prev.subject}").`
      });
    } else {
      fixedSlotMapTeacher.set(keyT, a);
    }

    if (fixedSlotMapGroup.has(keyG)) {
      const prev = fixedSlotMapGroup.get(keyG);
      errors.push({
        id: `fixed-conflict-g-${a.id}`,
        type: "error",
        title: "Conflicte d'activitat fixa de grup",
        message: `El grup "${groupObj?.name}" té dues assignatures fixes el ${a.fixedDay} a les ${a.fixedHour} ("${a.subject}" i "${prev.subject}").`
      });
    } else {
      fixedSlotMapGroup.set(keyG, a);
    }

    const isGlobalBlocked = blockedSlots.some(b => b.day === a.fixedDay && b.hour === a.fixedHour);
    if (isGlobalBlocked) {
      errors.push({
        id: `fixed-blocked-${a.id}`,
        type: "error",
        title: "Hora fixa en franja bloquejada",
        message: `L'assignatura "${a.subject}" (${groupObj?.name}) està fixada el ${a.fixedDay} a les ${a.fixedHour}, que és una franja bloquejada.`
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
