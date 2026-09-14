import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getSlotsForDay } from "./sampleData";

/**
 * Client-Side Excel Export (v4 with Per-Day Slots)
 */
export async function exportToExcel(schedules, blockedSlots = [], days = [], slots = [], schoolSettings = {}, slotsByDay = null) {
  if (!schedules || Object.keys(schedules).length === 0) {
    alert("No hi ha cap horari generat per exportar.");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const instName = schoolSettings.institutionName || "Horari Escolar";
  const yearStr = schoolSettings.academicYear || "";

  const getSlots = (d) => getSlotsForDay(slotsByDay || slots, d);

  function getBlockedLabel(day, hour) {
    const block = blockedSlots.find(b => b.day === day && b.hour === hour);
    return block ? block.label : null;
  }

  Object.entries(schedules).forEach(([groupName, schedule]) => {
    const sheetName = groupName.replace(/[\\/*?:[\]]/g, "").substring(0, 30);
    const sheet = workbook.addWorksheet(sheetName || "Grup");

    // Title Row
    sheet.mergeCells(1, 1, 1, days.length + 1);
    const titleCell = sheet.getCell(1, 1);
    titleCell.value = `${instName} - ${groupName} (${yearStr})`;
    titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FF1E3A8A" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(1).height = 32;

    // Header Row
    const headerRow = ["Dia Lectiu", ...days];
    sheet.addRow(headerRow);
    const hRow = sheet.getRow(2);
    hRow.height = 24;
    hRow.eachCell((cell) => {
      cell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Max slots count across all days
    const maxSlotsCount = Math.max(...days.map(d => getSlots(d).length));

    for (let slotIdx = 0; slotIdx < maxSlotsCount; slotIdx++) {
      const row = [`Sessió #${slotIdx + 1}`];

      days.forEach(day => {
        const daySlots = getSlots(day);
        const hour = daySlots[slotIdx];

        if (!hour) {
          row.push("-");
          return;
        }

        const slot = schedule?.[day]?.[hour];
        const blockedLabel = getBlockedLabel(day, hour);

        if (slot) {
          let text = `${hour}\n${slot.subject}\n(${slot.teacher}`;
          if (slot.coTeacher) text += ` + ${slot.coTeacher}`;
          text += `)`;
          if (slot.roomName) text += ` [${slot.roomName}]`;
          row.push(text);
        } else if (blockedLabel) {
          row.push(`${hour}\n🚫 ${blockedLabel}`);
        } else {
          row.push(`${hour}\n-`);
        }
      });

      const addedRow = sheet.addRow(row);
      addedRow.height = 42;

      addedRow.eachCell((cell, colIndex) => {
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.font = { name: "Arial", size: 9.5 };
        cell.border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          left: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } }
        };

        if (colIndex === 1) {
          cell.font = { bold: true, size: 9 };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
        } else if (cell.value && cell.value.toString().includes("🚫")) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } };
          cell.font = { color: { argb: "FF991B1B" }, italic: true };
        }
      });
    }

    sheet.getColumn(1).width = 16;
    for (let i = 2; i <= days.length + 1; i++) {
      sheet.getColumn(i).width = 26;
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Horaris_${instName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Client-Side PDF Export (v4 with Per-Day Slots)
 */
export function exportToPdf(schedules, blockedSlots = [], days = [], slots = [], schoolSettings = {}, slotsByDay = null) {
  if (!schedules || Object.keys(schedules).length === 0) {
    alert("No hi ha cap horari generat per exportar.");
    return;
  }

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const instName = schoolSettings.institutionName || "Horari Escolar";
  const yearStr = schoolSettings.academicYear || "";
  const headName = schoolSettings.headmasterName || "";

  const getSlots = (d) => getSlotsForDay(slotsByDay || slots, d);

  function getBlockedLabel(day, hour) {
    const block = blockedSlots.find(b => b.day === day && b.hour === hour);
    return block ? block.label : null;
  }

  const groupEntries = Object.entries(schedules);

  groupEntries.forEach(([groupName, schedule], pageIndex) => {
    if (pageIndex > 0) {
      doc.addPage();
    }

    if (schoolSettings.logoUrl) {
      try {
        const format = schoolSettings.logoUrl.includes("png") ? "PNG" : "JPEG";
        doc.addImage(schoolSettings.logoUrl, format, 260, 8, 22, 16);
      } catch (err) {}
    }

    doc.setFontSize(15);
    doc.setTextColor(30, 58, 138);
    doc.text(`${instName.toUpperCase()} - HORARI: ${groupName.toUpperCase()}`, 14, 15);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Curs: ${yearStr} | Generat el: ${new Date().toLocaleDateString("ca-ES")}`, 14, 21);

    const tableHead = [["Sessió", ...days]];
    const maxSlotsCount = Math.max(...days.map(d => getSlots(d).length));

    const tableBody = [];
    for (let slotIdx = 0; slotIdx < maxSlotsCount; slotIdx++) {
      const row = [`Sessió #${slotIdx + 1}`];

      days.forEach(day => {
        const daySlots = getSlots(day);
        const hour = daySlots[slotIdx];

        if (!hour) {
          row.push("-");
          return;
        }

        const slot = schedule?.[day]?.[hour];
        const blockedLabel = getBlockedLabel(day, hour);

        if (slot) {
          let text = `${hour}\n${slot.subject}\n[ ${slot.teacher}`;
          if (slot.coTeacher) text += ` + ${slot.coTeacher}`;
          text += ` ]`;
          if (slot.roomName) text += `\n🏢 ${slot.roomName}`;
          row.push(text);
        } else if (blockedLabel) {
          row.push(`${hour}\n[ Bloquejat: ${blockedLabel} ]`);
        } else {
          row.push(`${hour}\n-`);
        }
      });
      tableBody.push(row);
    }

    autoTable(doc, {
      startY: 25,
      head: tableHead,
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
        valign: "middle"
      },
      bodyStyles: {
        fontSize: 8,
        halign: "center",
        valign: "middle",
        minCellHeight: 14
      },
      columnStyles: {
        0: { fillColor: [241, 245, 249], fontStyle: "bold", cellWidth: 26 }
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index > 0) {
          const val = data.cell.text.join(" ");
          if (val.includes("[ Bloquejat")) {
            data.cell.styles.fillColor = [254, 226, 226];
            data.cell.styles.textColor = [153, 27, 27];
          } else if (val !== "-" && !val.endsWith("\n-")) {
            data.cell.styles.fillColor = [239, 246, 255];
            data.cell.styles.textColor = [30, 58, 138];
          }
        }
      }
    });

    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    if (headName) {
      doc.text(`Vist i plau: ${headName}`, 14, 202);
    }
    doc.text(`Pàgina ${pageCount} de ${groupEntries.length}`, 275, 202, { align: "right" });
  });

  doc.save(`Horaris_${instName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
