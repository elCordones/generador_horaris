import ExcelJS from "exceljs";

/**
 * Techno-Pedagogical Excel Template Generator & Parser (v3.3)
 * Supports:
 * - School Settings & Logo URL/Base64
 * - Per-Day Asymmetric Time Slots
 * - Teachers with inline notes in parentheses, e.g., "Joan Garcia (Educació Física, Tutor 5è A)"
 * - Class Groups (Grups Classe) in dedicated columns & sheets
 * - Special Shared Rooms (Aules Especials i Espais Compartits: Gimnàs, Música, Laboratori, STEAM...)
 * - Activities, Co-teaching, Duration (30m, 1h, 1.5h, 2h), High Cognitive Load & Fixed Slots
 */

export async function generateExcelTemplate(schoolSettings = {}, days = [], slotsByDay = {}) {
  const workbook = new ExcelJS.Workbook();

  // -------------------------------------------------------------
  // Sheet 1: 1_CENTRE
  // -------------------------------------------------------------
  const sheetCentre = workbook.addWorksheet("1_CENTRE");
  sheetCentre.addRow(["Paràmetre de Configuració", "Valor", "Descripció Pedagògica"]);
  sheetCentre.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheetCentre.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A8A" } };

  sheetCentre.addRow(["Nom del Centre", schoolSettings.institutionName || "Escola La Renaixença", "Nom oficial del centre educatiu"]);
  sheetCentre.addRow(["Curs Escolar", schoolSettings.academicYear || "2026-2027", "Any acadèmic actual"]);
  sheetCentre.addRow(["Cap d'Estudis / Directori", schoolSettings.headmasterName || "Equip Directiu", "Nom del responsable d'horaris"]);
  sheetCentre.addRow(["Logo del Centre (URL o Imatge Base64)", schoolSettings.logoUrl || "", "Opcional: URL o imatge del logotip"]);
  sheetCentre.addRow(["Màxim Hores/Dia per Mestre", schoolSettings.maxDailyHoursPerTeacher || 5, "Límit d'hores lectives directes per dia"]);
  sheetCentre.addRow(["Evitar Finestres als Mestres (Sí/No)", schoolSettings.avoidTeacherGaps ? "Sí" : "No", "No deixar franges buides entremig"]);
  sheetCentre.addRow(["Protecció Divendres Tarda (Sí/No)", schoolSettings.fridayAfternoonLightLoad ? "Sí" : "No", "Evitar matèries pesades divendres tarda"]);

  sheetCentre.getColumn(1).width = 38;
  sheetCentre.getColumn(2).width = 38;
  sheetCentre.getColumn(3).width = 45;

  // -------------------------------------------------------------
  // Sheet 2: 2_FRANGES
  // -------------------------------------------------------------
  const sheetFranges = workbook.addWorksheet("2_FRANGES");
  sheetFranges.addRow(["Dia Lectiu", "Franja Horària"]);
  sheetFranges.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheetFranges.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };

  const defaultDays = days.length > 0 ? days : ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];
  defaultDays.forEach(day => {
    const daySlots = slotsByDay[day] || ["09:00 - 10:00", "10:00 - 11:00", "11:30 - 12:30", "15:00 - 16:30"];
    daySlots.forEach(slotStr => {
      sheetFranges.addRow([day, slotStr]);
    });
  });
  sheetFranges.getColumn(1).width = 20;
  sheetFranges.getColumn(2).width = 35;

  // -------------------------------------------------------------
  // Sheet 3: 3_MESTRES
  // -------------------------------------------------------------
  const sheetMestres = workbook.addWorksheet("3_MESTRES");
  sheetMestres.addRow(["Nom del Mestre (amb especialitat/tutoria entre parèntesis)"]);
  sheetMestres.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheetMestres.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF059669" } };

  const sampleMestres = [
    "Joan Garcia (Educació Física, Tutor 5è A)",
    "Maria López (Anglès, Especialista Cicle Superior)",
    "Marc Soler (Matemàtiques, Cap d'Estudis)",
    "Laura Pons (Llengua Catalana, Tutor 3r A)",
    "Clara Valls (Música)"
  ];
  sampleMestres.forEach(m => sheetMestres.addRow([m]));
  sheetMestres.getColumn(1).width = 55;

  // -------------------------------------------------------------
  // Sheet 4: 4_GRUPS_I_AULES
  // -------------------------------------------------------------
  const sheetGrupsAules = workbook.addWorksheet("4_GRUPS_I_AULES");
  sheetGrupsAules.addRow([
    "Grups Classe (Ordinaris)",
    "Aules Especials i Espais Compartits"
  ]);
  sheetGrupsAules.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheetGrupsAules.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD97706" } };

  const sampleGrupsAules = [
    ["1r A", "Gimnàs / Pista"],
    ["1r B", "Aula de Música"],
    ["2n A", "Laboratori de Ciències"],
    ["3r A", "Aula STEAM / Informàtica"],
    ["4t A", "Biblioteca / Aula d'Acollida"]
  ];

  sampleGrupsAules.forEach(row => sheetGrupsAules.addRow(row));
  sheetGrupsAules.getColumn(1).width = 30;
  sheetGrupsAules.getColumn(2).width = 40;

  // -------------------------------------------------------------
  // Sheet 5: 5_ACTIVITATS
  // -------------------------------------------------------------
  const sheetActivitats = workbook.addWorksheet("5_ACTIVITATS");
  sheetActivitats.addRow([
    "Grup Classe",
    "Assignatura",
    "Mestre Titular",
    "Co-docent (Opcional)",
    "Aula Especial / Espai (Opcional)",
    "Hores/Setmana",
    "Durada Sessió (30m, 45m, 1h, 1.5h, 2h)",
    "Càrrega Alta (Sí/No)",
    "Dia Fix (Opcional)",
    "Hora Fixa (Opcional)"
  ]);
  sheetActivitats.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheetActivitats.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF7C3AED" } };

  const sampleActivitats = [
    ["3r A", "Lectura", "Laura Pons", "Joan Garcia", "", 2.5, "30m", "No", "", ""],
    ["3r A", "Matemàtiques", "Marc Soler", "", "", 4, "1h", "Sí", "", ""],
    ["3r A", "Educació Física", "Joan Garcia", "", "Gimnàs / Pista", 2, "1h", "No", "", ""],
    ["3r A", "Música", "Clara Valls", "", "Aula de Música", 1.5, "1.5h", "No", "", ""],
    ["4t A", "Coneixement del Medi", "Marc Soler", "", "", 3, "45m", "No", "", ""],
    ["4t A", "Anglès", "Maria López", "", "", 3, "1h", "Sí", "", ""]
  ];

  sampleActivitats.forEach(row => sheetActivitats.addRow(row));
  sheetActivitats.getColumn(1).width = 18;
  sheetActivitats.getColumn(2).width = 25;
  sheetActivitats.getColumn(3).width = 35;
  sheetActivitats.getColumn(4).width = 35;
  sheetActivitats.getColumn(5).width = 32;
  sheetActivitats.getColumn(6).width = 18;
  sheetActivitats.getColumn(7).width = 30;
  sheetActivitats.getColumn(8).width = 20;
  sheetActivitats.getColumn(9).width = 18;
  sheetActivitats.getColumn(10).width = 20;

  // -------------------------------------------------------------
  // Sheet 6: 6_INSTRUCCIONS
  // -------------------------------------------------------------
  const sheetInstructions = workbook.addWorksheet("6_INSTRUCCIONS");
  sheetInstructions.addRow(["GUIA D'ÚS DE LA PLANTILLA D'HORARIS"]);
  sheetInstructions.getRow(1).font = { size: 14, bold: true, color: { argb: "FF1E3A8A" } };
  sheetInstructions.addRow([""]);
  sheetInstructions.addRow(["1. Pestanya '1_CENTRE': Nom del centre, curs escolar, límits d'hores i logo (URL o Base64)."]);
  sheetInstructions.addRow(["2. Pestanya '2_FRANGES': Personalitza les franges horàries de cada dia de la setmana."]);
  sheetInstructions.addRow(["3. Pestanya '3_MESTRES': Escriu la llista de mestres. Pots incloure l'especialitat o tutoria entre parèntesis, ex: 'Joan Garcia (Educació Física, Tutor 5è A)'."]);
  sheetInstructions.addRow(["4. Pestanya '4_GRUPS_I_AULES': Escriu els Grups Classe a la columna A (1r A, 2n A...) i les Aules Especials / Espais Compartits a la columna B (Gimnàs, Aula de Música, Laboratori...)."]);
  sheetInstructions.addRow(["5. Pestanya '5_ACTIVITATS': Defineix les matèries, hores setmanals, co-docències, durada (30m, 45m, 50m, 1h, 1.5h, 2h) i si és de càrrega cognitiva alta."]);

  sheetInstructions.getColumn(1).width = 115;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Plantilla_Configuracio_${(schoolSettings.institutionName || "Escola").replace(/\s+/g, "_")}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Parse uploaded Excel file Buffer into structured project state
 */
export async function parseExcelTemplate(arrayBuffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const schoolSettings = {};
  const days = [];
  const slotsByDay = {};
  const teachers = [];
  const groups = [];
  const rooms = [];
  const activities = [];

  function extractNameAndNotes(rawStr) {
    if (!rawStr) return { name: "", notes: "" };
    const str = rawStr.trim();
    const match = str.match(/^([^(]+)(?:\(([^)]+)\))?/);
    if (match) {
      return {
        name: match[1].trim(),
        notes: match[2] ? match[2].trim() : ""
      };
    }
    return { name: str, notes: "" };
  }

  // 1. Parse 1_CENTRE
  const sheetCentre = workbook.getWorksheet("1_CENTRE") || workbook.worksheets[0];
  if (sheetCentre) {
    sheetCentre.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const param = row.getCell(1).value?.toString().trim();
      const val = row.getCell(2).value?.toString().trim();
      if (!param) return;

      if (param.includes("Nom del Centre")) schoolSettings.institutionName = val;
      if (param.includes("Curs Escolar")) schoolSettings.academicYear = val;
      if (param.includes("Cap d'Estudis")) schoolSettings.headmasterName = val;
      if (param.includes("Logo")) schoolSettings.logoUrl = val;
      if (param.includes("Màxim Hores")) schoolSettings.maxDailyHoursPerTeacher = Number(val) || 5;
      if (param.includes("Evitar Finestres")) schoolSettings.avoidTeacherGaps = val?.toLowerCase() === "sí" || val?.toLowerCase() === "si";
      if (param.includes("Protecció Divendres")) schoolSettings.fridayAfternoonLightLoad = val?.toLowerCase() === "sí" || val?.toLowerCase() === "si";
    });
  }

  // 2. Parse 2_FRANGES
  const sheetFranges = workbook.getWorksheet("2_FRANGES");
  if (sheetFranges) {
    sheetFranges.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const day = row.getCell(1).value?.toString().trim();
      const slot = row.getCell(2).value?.toString().trim();

      if (day && slot) {
        if (!days.includes(day)) days.push(day);
        if (!slotsByDay[day]) slotsByDay[day] = [];
        if (!slotsByDay[day].includes(slot)) slotsByDay[day].push(slot);
      }
    });
  }

  if (days.length === 0) {
    ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"].forEach(d => {
      days.push(d);
      slotsByDay[d] = ["09:00 - 10:00", "10:00 - 11:00", "11:30 - 12:30", "15:00 - 16:30"];
    });
  }

  // 3. Parse 3_MESTRES
  const sheetMestres = workbook.getWorksheet("3_MESTRES") || workbook.getWorksheet("3_MESTRES_I_ESPAIS");
  if (sheetMestres) {
    sheetMestres.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const rawTeacher = row.getCell(1).value?.toString().trim();

      if (rawTeacher) {
        const { name, notes } = extractNameAndNotes(rawTeacher);
        const fullName = notes ? `${name} (${notes})` : name;
        if (name && !teachers.some(t => t.name.toLowerCase() === fullName.toLowerCase())) {
          teachers.push({
            id: `t_${Date.now()}_${teachers.length}`,
            name: fullName,
            notes,
            availability: {}
          });
        }
      }
    });
  }

  // 4. Parse 4_GRUPS_I_AULES (also supports 3_MESTRES_I_ESPAIS columns B/C)
  const sheetGrupsAules = workbook.getWorksheet("4_GRUPS_I_AULES") || workbook.getWorksheet("3_MESTRES_I_ESPAIS");
  if (sheetGrupsAules) {
    sheetGrupsAules.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const groupName = row.getCell(1).value?.toString().trim() || row.getCell(2).value?.toString().trim();
      const roomName = row.getCell(2).value?.toString().trim() || row.getCell(3).value?.toString().trim();

      if (groupName && groupName !== roomName && !groups.some(g => g.name.toLowerCase() === groupName.toLowerCase())) {
        // Exclude header strings or room duplicate
        if (!groupName.includes("Nom Mestre") && !groupName.includes("Grups Classe")) {
          groups.push({
            id: `g_${Date.now()}_${groups.length}`,
            name: groupName
          });
        }
      }

      if (roomName && !rooms.some(r => r.name.toLowerCase() === roomName.toLowerCase())) {
        if (!roomName.includes("Aula Especial")) {
          rooms.push({
            id: `r_${Date.now()}_${rooms.length}`,
            name: roomName,
            type: "SPECIAL"
          });
        }
      }
    });
  }

  // 5. Parse 5_ACTIVITATS (also supports 4_ACTIVITATS)
  const sheetActivitats = workbook.getWorksheet("5_ACTIVITATS") || workbook.getWorksheet("4_ACTIVITATS");
  if (sheetActivitats) {
    sheetActivitats.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const gName = row.getCell(1).value?.toString().trim();
      const subject = row.getCell(2).value?.toString().trim();
      const tNameRaw = row.getCell(3).value?.toString().trim();
      const coTNameRaw = row.getCell(4).value?.toString().trim();
      const roomNameRaw = row.getCell(5).value?.toString().trim();
      const weeklyHours = Number(row.getCell(6).value) || 1;
      const durationStr = row.getCell(7).value?.toString().trim() || "1h";
      const isHighCognitiveStr = row.getCell(8).value?.toString().trim();
      const fixedDay = row.getCell(9).value?.toString().trim() || "";
      const fixedHour = row.getCell(10).value?.toString().trim() || "";

      if (!gName || !subject || !tNameRaw) return;

      const tName = extractNameAndNotes(tNameRaw).name;
      let teacher = teachers.find(t => t.name.toLowerCase().includes(tName.toLowerCase()));
      if (!teacher) {
        teacher = { id: `t_${Date.now()}_${teachers.length}`, name: tNameRaw, availability: {} };
        teachers.push(teacher);
      }

      let coTeacher = null;
      if (coTNameRaw) {
        const coName = extractNameAndNotes(coTNameRaw).name;
        coTeacher = teachers.find(t => t.name.toLowerCase().includes(coName.toLowerCase()));
        if (!coTeacher) {
          coTeacher = { id: `t_${Date.now()}_${teachers.length}`, name: coTNameRaw, availability: {} };
          teachers.push(coTeacher);
        }
      }

      let group = groups.find(g => g.name.toLowerCase() === gName.toLowerCase());
      if (!group) {
        group = { id: `g_${Date.now()}_${groups.length}`, name: gName };
        groups.push(group);
      }

      let room = null;
      if (roomNameRaw) {
        room = rooms.find(r => r.name.toLowerCase() === roomNameRaw.toLowerCase());
        if (!room) {
          room = { id: `r_${Date.now()}_${rooms.length}`, name: roomNameRaw, type: "SPECIAL" };
          rooms.push(room);
        }
      }

      let duration = 2; // Default 1h (2 slots of 30m)
      if (durationStr.includes("30m") || durationStr === "1") duration = 1;
      else if (durationStr.includes("45m")) duration = 1.5;
      else if (durationStr.includes("50m") || durationStr.includes("55m")) duration = 1.66;
      else if (durationStr.includes("1.5") || durationStr.includes("1h30") || durationStr === "3") duration = 3;
      else if (durationStr.includes("2h") || durationStr === "4") duration = 4;
      else if (durationStr.includes("1h") || durationStr === "2") duration = 2;

      activities.push({
        id: `a_${Date.now()}_${activities.length}`,
        subject,
        teacherId: teacher.id,
        coTeacherId: coTeacher ? coTeacher.id : "",
        groupId: group.id,
        roomId: room ? room.id : "",
        weeklyHours,
        duration,
        isHighCognitiveLoad: isHighCognitiveStr?.toLowerCase() === "sí" || isHighCognitiveStr?.toLowerCase() === "si",
        fixedDay,
        fixedHour,
        blockedSlots: []
      });
    });
  }

  return {
    schoolSettings,
    days,
    slotsByDay,
    teachers,
    groups,
    rooms,
    activities
  };
}
