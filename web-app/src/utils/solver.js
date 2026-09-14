import { getSlotsForDay } from "./sampleData";

/**
 * Advanced Techno-Pedagogical CSP Solver Engine (v3 with Per-Day Asymmetric Slots)
 */

export function solveScheduleClientSide(data, maxRestarts = 15, maxIterationsPerAttempt = 30000) {
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

  const getSlots = (d) => getSlotsForDay(slotsByDay || slots, d);

  // 1. Prepare unrolled sessions
  const sessions = [];
  let idCounter = 1;

  activities.forEach(activity => {
    const primaryTeacher = teachers.find(t => t.id === activity.teacherId);
    const coTeacher = teachers.find(t => t.id === activity.coTeacherId);
    const groupObj = groups.find(g => g.id === activity.groupId);
    const roomObj = rooms.find(r => r.id === activity.roomId);

    if (!primaryTeacher || !groupObj) return;

    const slotDuration = Math.max(1, Math.round(Number(activity.duration) || 1));
    const sessionHours = (Number(activity.duration) || 1) * 0.5;
    const weeklyHours = Math.max(0.5, Number(activity.weeklyHours) || 1);
    const numSessions = Math.max(1, Math.round(weeklyHours / sessionHours));

    for (let s = 0; s < numSessions; s++) {
      sessions.push({
        id: idCounter++,
        activityId: activity.id,
        subject: activity.subject,
        teacherId: activity.teacherId,
        teacherName: primaryTeacher.name,
        coTeacherId: activity.coTeacherId || null,
        coTeacherName: coTeacher ? coTeacher.name : null,
        groupId: activity.groupId,
        groupName: groupObj.name,
        roomId: activity.roomId || null,
        roomName: roomObj ? roomObj.name : null,
        duration: slotDuration,
        isHighCognitiveLoad: !!activity.isHighCognitiveLoad,
        fixedDay: s === 0 ? (activity.fixedDay || "") : "",
        fixedHour: s === 0 ? (activity.fixedHour || "") : "",
        blockedSlots: activity.blockedSlots || []
      });
    }
  });

  if (sessions.length === 0) {
    return {
      success: false,
      message: "No hi ha activitats vàlides per assignar."
    };
  }

  // Global blocked map
  const globalBlockedMap = new Set();
  blockedSlots.forEach(b => {
    globalBlockedMap.add(`${b.day}|${b.hour}`);
  });

  // Teacher unavailability map per day
  const teacherUnavailableMap = {};
  teachers.forEach(t => {
    const set = new Set();
    if (t.availability) {
      days.forEach(day => {
        const daySlots = getSlots(day);
        const availList = t.availability[day];
        if (availList) {
          availList.forEach((isAvail, slotIdx) => {
            if (isAvail === false && slotIdx < daySlots.length) {
              set.add(`${day}|${daySlots[slotIdx]}`);
            }
          });
        }
      });
    }
    teacherUnavailableMap[t.id] = set;
  });

  // Candidate slots generator
  function getCandidateSlots(session) {
    const candidates = [];
    days.forEach(day => {
      const daySlots = getSlots(day);

      daySlots.forEach((hour, hourIdx) => {
        // Fixed constraint check
        if (session.fixedDay && session.fixedHour) {
          if (day !== session.fixedDay || hour !== session.fixedHour) {
            return;
          }
        }

        // Duration boundary check
        if (hourIdx + session.duration > daySlots.length) return;

        let possible = true;
        for (let d = 0; d < session.duration; d++) {
          const checkHour = daySlots[hourIdx + d];
          const key = `${day}|${checkHour}`;

          if (globalBlockedMap.has(key)) {
            possible = false;
            break;
          }

          if (teacherUnavailableMap[session.teacherId]?.has(key)) {
            possible = false;
            break;
          }

          if (session.coTeacherId && teacherUnavailableMap[session.coTeacherId]?.has(key)) {
            possible = false;
            break;
          }

          if (session.blockedSlots.includes(key)) {
            possible = false;
            break;
          }
        }

        if (possible) {
          candidates.push({ day, hourIdx, hour });
        }
      });
    });
    return candidates;
  }

  // Calculate domains
  const sessionDomains = new Map();
  for (const session of sessions) {
    const candidates = getCandidateSlots(session);
    if (candidates.length === 0) {
      const coInfo = session.coTeacherName ? ` i co-docent (${session.coTeacherName})` : "";
      return {
        success: false,
        message: `L'activitat "${session.subject}" (${session.groupName}) no té cap franja disponible compatible amb el mestre (${session.teacherName})${coInfo} o l'aula assignada.`
      };
    }
    sessionDomains.set(session.id, candidates);
  }

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  let totalIterations = 0;

  for (let restart = 0; restart < maxRestarts; restart++) {
    const teacherGrid = {};
    const groupGrid = {};
    const roomGrid = {};

    teachers.forEach(t => {
      teacherGrid[t.id] = {};
      days.forEach(d => { teacherGrid[t.id][d] = new Array(getSlots(d).length).fill(null); });
    });

    groups.forEach(g => {
      groupGrid[g.id] = {};
      days.forEach(d => { groupGrid[g.id][d] = new Array(getSlots(d).length).fill(null); });
    });

    rooms.forEach(r => {
      roomGrid[r.id] = {};
      days.forEach(d => { roomGrid[r.id][d] = new Array(getSlots(d).length).fill(null); });
    });

    const assignments = new Map();

    const unassignedSessions = [...sessions].sort((a, b) => {
      const isFixedA = a.fixedDay ? 1 : 0;
      const isFixedB = b.fixedDay ? 1 : 0;
      if (isFixedA !== isFixedB) return isFixedB - isFixedA;

      const domA = sessionDomains.get(a.id).length;
      const domB = sessionDomains.get(b.id).length;
      return domA - domB;
    });

    let iterations = 0;

    function isSlotFree(session, day, hourIdx) {
      const daySlots = getSlots(day);

      for (let d = 0; d < session.duration; d++) {
        const hIdx = hourIdx + d;
        if (hIdx >= daySlots.length) return false;

        if (teacherGrid[session.teacherId][day][hIdx] !== null) return false;
        if (session.coTeacherId && teacherGrid[session.coTeacherId][day][hIdx] !== null) return false;
        if (groupGrid[session.groupId][day][hIdx] !== null) return false;
        if (session.roomId && roomGrid[session.roomId]?.[day]?.[hIdx] !== null) return false;

        // Pedagogical rule: avoid 2 sessions of SAME subject in same day for same group
        if (d === 0) {
          const sameSubjectCount = daySlots.filter((_, idx) => {
            const assignedId = groupGrid[session.groupId][day][idx];
            if (!assignedId) return false;
            const assignedSess = sessions.find(s => s.id === assignedId);
            return assignedSess && assignedSess.subject === session.subject;
          }).length;

          if (sameSubjectCount >= 1 && restart < maxRestarts - 2) {
            return false;
          }
        }
      }
      return true;
    }

    function placeSession(session, day, hourIdx) {
      for (let d = 0; d < session.duration; d++) {
        const hIdx = hourIdx + d;
        teacherGrid[session.teacherId][day][hIdx] = session.id;
        if (session.coTeacherId) {
          teacherGrid[session.coTeacherId][day][hIdx] = session.id;
        }
        groupGrid[session.groupId][day][hIdx] = session.id;
        if (session.roomId) {
          roomGrid[session.roomId][day][hIdx] = session.id;
        }
      }
      assignments.set(session.id, { day, hourIdx, hour: getSlots(day)[hourIdx] });
    }

    function removeSession(session, day, hourIdx) {
      for (let d = 0; d < session.duration; d++) {
        const hIdx = hourIdx + d;
        teacherGrid[session.teacherId][day][hIdx] = null;
        if (session.coTeacherId) {
          teacherGrid[session.coTeacherId][day][hIdx] = null;
        }
        groupGrid[session.groupId][day][hIdx] = null;
        if (session.roomId) {
          roomGrid[session.roomId][day][hIdx] = null;
        }
      }
      assignments.delete(session.id);
    }

    function backtrack(index) {
      if (index === unassignedSessions.length) return true;
      if (++iterations > maxIterationsPerAttempt) return false;

      const session = unassignedSessions[index];
      let candidates = sessionDomains.get(session.id);

      if (session.isHighCognitiveLoad && restart < maxRestarts - 2) {
        candidates = [...candidates].sort((a, b) => a.hourIdx - b.hourIdx);
      }

      if (restart > 0) {
        candidates = shuffle(candidates);
      }

      for (const cand of candidates) {
        if (isSlotFree(session, cand.day, cand.hourIdx)) {
          placeSession(session, cand.day, cand.hourIdx);

          if (backtrack(index + 1)) return true;

          removeSession(session, cand.day, cand.hourIdx);
        }
      }
      return false;
    }

    const solved = backtrack(0);
    totalIterations += iterations;

    if (solved) {
      const schedules = {};

      groups.forEach(g => {
        schedules[g.name] = {};
        days.forEach(d => {
          schedules[g.name][d] = {};
        });
      });

      assignments.forEach((assign, sessionId) => {
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return;

        const daySlots = getSlots(assign.day);

        for (let d = 0; d < session.duration; d++) {
          const slotName = daySlots[assign.hourIdx + d];
          schedules[session.groupName][assign.day][slotName] = {
            subject: session.subject,
            teacher: session.teacherName,
            teacherId: session.teacherId,
            coTeacher: session.coTeacherName,
            coTeacherId: session.coTeacherId,
            roomId: session.roomId,
            roomName: session.roomName,
            activityId: session.activityId,
            groupId: session.groupId,
            groupName: session.groupName,
            isHighCognitiveLoad: session.isHighCognitiveLoad
          };
        }
      });

      return {
        success: true,
        schedules,
        iterations: totalIterations,
        restarts: restart
      };
    }
  }

  return {
    success: false,
    message: `No s'ha pogut trobar un horari vàlid sense conflictes després de ${totalIterations} comprovacions. Revisa la disponibilitat dels mestres, les franges per dia o les aules especials.`
  };
}
