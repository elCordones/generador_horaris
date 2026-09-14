export const DEFAULT_DAYS = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];

export const DEFAULT_SLOTS = [
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:30 - 12:00",
  "12:00 - 12:30",
  "15:00 - 15:30",
  "15:30 - 16:00",
  "16:00 - 16:30"
];

export const DEFAULT_SLOTS_BY_DAY = {
  "Dilluns": ["09:00 - 09:30 (Lectura 3r)", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00", "11:30 - 12:00", "12:00 - 12:30", "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30"],
  "Dimarts": ["09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00", "11:30 - 12:00", "12:00 - 12:30", "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30"],
  "Dimecres": ["09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00", "11:30 - 12:00", "12:00 - 12:30", "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30"],
  "Dijous": ["09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00", "11:30 - 12:00", "12:00 - 12:30", "15:00 - 15:30 (Lectura 4t)", "15:30 - 16:00", "16:00 - 16:30"],
  "Divendres": ["09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00", "11:30 - 12:00", "12:00 - 12:30", "15:00 - 15:30", "15:30 - 16:00"]
};

export const DEFAULT_SLOTS_BY_STAGE_AND_DAY = {
  "INFANTIL": {
    "Dilluns": ["09:00 - 09:30 (Hàbits/Entrada)", "09:30 - 10:30 (Ambients)", "10:30 - 11:00", "11:30 - 12:30 (Racons)", "15:00 - 16:30 (Tallers)"],
    "Dimarts": ["09:00 - 09:30 (Hàbits)", "09:30 - 10:30 (Ambients)", "10:30 - 11:00", "11:30 - 12:30 (Propostes)", "15:00 - 16:30 (Tallers)"],
    "Dimecres": ["09:00 - 09:30 (Hàbits)", "09:30 - 10:30 (Propostes)", "10:30 - 11:00", "11:30 - 12:30 (Racons)", "15:00 - 16:30 (Tallers)"],
    "Dijous": ["09:00 - 09:30 (Hàbits)", "09:30 - 10:30 (Ambients)", "10:30 - 11:00", "11:30 - 12:30 (Propostes)", "15:00 - 16:30 (Tallers)"],
    "Divendres": ["09:00 - 09:30 (Hàbits)", "09:30 - 10:30 (Propostes)", "10:30 - 11:00", "11:30 - 12:30 (Tancament)", "15:00 - 16:00 (Comiat)"]
  },
  "PRIMARIA": {
    ...DEFAULT_SLOTS_BY_DAY
  }
};

export const INFANTIL_SUBJECTS = [
  "Ambients d'Aprenentatge",
  "Psicomotricitat / Moviment",
  "Racons i Joc Lliure",
  "Descoberta de l'Entorn",
  "Llenguatge i Expressió",
  "Anglès d'Infantil",
  "Música i Dansa",
  "Hàbits i Autonomia"
];

export const PRIMARIA_SUBJECTS = [
  "Matemàtiques",
  "Llengua Catalana",
  "Llengua Castellana",
  "Llengua Anglesa",
  "Coneixement del Medi Natural i Social",
  "Educació Artística (Música / Plàstica)",
  "Educació Física",
  "Hora de Lectura / Tallers"
];

export function getSlotsForDay(slotsByDay, day) {
  if (!slotsByDay) return DEFAULT_SLOTS;
  if (Array.isArray(slotsByDay)) return slotsByDay;
  return slotsByDay[day] || slotsByDay["Dilluns"] || DEFAULT_SLOTS;
}

export function getSlotsForGroupAndDay(slotsByDay, day, stage = "PRIMARIA") {
  if (!slotsByDay) return DEFAULT_SLOTS;
  if (Array.isArray(slotsByDay)) return slotsByDay;

  // Check stage-based map
  if (slotsByDay[stage] && slotsByDay[stage][day]) {
    return slotsByDay[stage][day];
  }

  return slotsByDay[day] || slotsByDay["Dilluns"] || DEFAULT_SLOTS;
}

export const INITIAL_SCHOOL_SETTINGS = {
  institutionName: "Escola d'Infantil i Primària La Renaixença",
  academicYear: "2026-2027",
  headmasterName: "Equip Directiu",
  logoUrl: "",
  maxDailyHoursPerTeacher: 5,
  avoidTeacherGaps: true,
  fridayAfternoonLightLoad: true
};

export const INITIAL_ROOMS = [
  { id: "r1", name: "Gimnàs / Pista Esportiva", type: "SPECIAL" },
  { id: "r2", name: "Aula de Música", type: "SPECIAL" },
  { id: "r3", name: "Laboratori de Ciències", type: "SPECIAL" },
  { id: "r4", name: "Aula d'Informàtica / STEAM", type: "SPECIAL" },
  { id: "r_psico", name: "Aula de Psicomotricitat (Infantil)", type: "SPECIAL" },
  { id: "r5", name: "Aula de 3r A", type: "REGULAR" },
  { id: "r6", name: "Aula de 4t A", type: "REGULAR" }
];

export const INITIAL_BLOCKED_SLOTS = [
  { day: "Dilluns", hour: "11:30 - 12:00", label: "Pati / Descans" },
  { day: "Dilluns", hour: "12:00 - 12:30", label: "Treball Personal" },
  { day: "Dimecres", hour: "15:00 - 15:30", label: "Reunió de Cicle" }
];

export const INITIAL_TEACHERS = [
  {
    id: "t1",
    name: "Laura Martínez (Tutor 3r)",
    availability: {
      "Dilluns": [true, true, true, true, true, true, true, true, true],
      "Dimarts": [true, true, true, true, true, true, true, true, true],
      "Dimecres": [true, true, true, true, true, true, true, true, true],
      "Dijous": [true, true, true, true, true, true, true, true, true],
      "Divendres": [true, true, true, true, true, true, true, true]
    }
  },
  {
    id: "t2",
    name: "Jordi Serra (Tutor 4t)",
    availability: {
      "Dilluns": [true, true, true, true, true, true, true, true, true],
      "Dimarts": [true, true, true, true, true, true, true, true, true],
      "Dimecres": [true, true, true, true, true, true, true, true, true],
      "Dijous": [true, true, true, true, true, true, true, true, true],
      "Divendres": [true, true, true, true, true, true, true, false]
    }
  },
  {
    id: "t3",
    name: "Marta Vila (Anglès i Infantil)",
    availability: {
      "Dilluns": [true, true, true, true, true, true, true, true, true],
      "Dimarts": [true, true, true, true, true, true, true, true, true],
      "Dimecres": [true, true, true, true, true, true, true, true, true],
      "Dijous": [true, true, true, true, true, true, true, true, true],
      "Divendres": [true, true, true, true, true, true, true, true]
    }
  },
  {
    id: "t4",
    name: "Pere Mas (Educació Física / Psicomotricitat)",
    availability: {
      "Dilluns": [true, true, true, true, true, true, true, true, true],
      "Dimarts": [true, true, true, true, true, true, true, true, true],
      "Dimecres": [true, true, true, true, true, true, true, true, true],
      "Dijous": [true, true, true, true, true, true, true, true, true],
      "Divendres": [true, true, true, true, true, true, true, true]
    }
  }
];

export const INITIAL_GROUPS = [
  { id: "g_i5", name: "I5 (Educació Infantil)", stage: "INFANTIL" },
  { id: "g1", name: "3r A (Cicle Mitjà)", stage: "PRIMARIA" },
  { id: "g2", name: "4t A (Cicle Mitjà)", stage: "PRIMARIA" }
];

export const INITIAL_ACTIVITIES = [
  // I5 (Infantil): Ambients, Psicomotricitat i Anglès
  { id: "a_i1", subject: "Ambients d'Aprenentatge", teacherId: "t1", coTeacherId: "", groupId: "g_i5", roomId: "", weeklyHours: 3, duration: 2, isHighCognitiveLoad: false, fixedDay: "", fixedHour: "", blockedSlots: [] },
  { id: "a_i2", subject: "Psicomotricitat / Moviment", teacherId: "t4", coTeacherId: "", groupId: "g_i5", roomId: "r_psico", weeklyHours: 2, duration: 2, isHighCognitiveLoad: false, fixedDay: "", fixedHour: "", blockedSlots: [] },
  { id: "a_i3", subject: "Anglès d'Infantil", teacherId: "t3", coTeacherId: "", groupId: "g_i5", roomId: "", weeklyHours: 1, duration: 2, isHighCognitiveLoad: false, fixedDay: "", fixedHour: "", blockedSlots: [] },

  // 3r A (Primària)
  { id: "a1", subject: "Hora de Lectura 3r", teacherId: "t1", coTeacherId: "", groupId: "g1", roomId: "", weeklyHours: 0.5, duration: 1, isHighCognitiveLoad: false, fixedDay: "Dilluns", fixedHour: "09:00 - 09:30 (Lectura 3r)", blockedSlots: [] },
  { id: "a2", subject: "Matemàtiques 3r", teacherId: "t1", coTeacherId: "", groupId: "g1", roomId: "", weeklyHours: 3, duration: 2, isHighCognitiveLoad: true, fixedDay: "", fixedHour: "", blockedSlots: [] },
  { id: "a3", subject: "Llengua Catalana 3r", teacherId: "t1", coTeacherId: "", groupId: "g1", roomId: "", weeklyHours: 3, duration: 2, isHighCognitiveLoad: true, fixedDay: "", fixedHour: "", blockedSlots: [] },
  { id: "a4", subject: "Anglès 3r", teacherId: "t3", coTeacherId: "", groupId: "g1", roomId: "", weeklyHours: 2, duration: 2, isHighCognitiveLoad: false, fixedDay: "", fixedHour: "", blockedSlots: [] },
  { id: "a5", subject: "Educació Física 3r", teacherId: "t4", coTeacherId: "", groupId: "g1", roomId: "r1", weeklyHours: 2, duration: 2, isHighCognitiveLoad: false, fixedDay: "", fixedHour: "", blockedSlots: [] },

  // 4t A (Primària)
  { id: "a6", subject: "Hora de Lectura 4t", teacherId: "t2", coTeacherId: "", groupId: "g2", roomId: "", weeklyHours: 0.5, duration: 1, isHighCognitiveLoad: false, fixedDay: "Dijous", fixedHour: "15:00 - 15:30 (Lectura 4t)", blockedSlots: [] },
  { id: "a7", subject: "Matemàtiques 4t", teacherId: "t2", coTeacherId: "", groupId: "g2", roomId: "", weeklyHours: 3, duration: 2, isHighCognitiveLoad: true, fixedDay: "", fixedHour: "", blockedSlots: [] },
  { id: "a8", subject: "Llengua Catalana 4t", teacherId: "t2", coTeacherId: "", groupId: "g2", roomId: "", weeklyHours: 3, duration: 2, isHighCognitiveLoad: true, fixedDay: "Dilluns", fixedHour: "09:00 - 09:30", blockedSlots: [] },
  { id: "a9", subject: "Anglès 4t", teacherId: "t3", coTeacherId: "", groupId: "g2", roomId: "", weeklyHours: 2, duration: 2, isHighCognitiveLoad: false, fixedDay: "", fixedHour: "", blockedSlots: [] },
  { id: "a10", subject: "Educació Física 4t", teacherId: "t4", coTeacherId: "", groupId: "g2", roomId: "r1", weeklyHours: 2, duration: 2, isHighCognitiveLoad: false, fixedDay: "", fixedHour: "", blockedSlots: [] }
];
