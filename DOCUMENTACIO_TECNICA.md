# 🛠️ Documentació Tècnica: Generador d'Horaris Web (SPA)

**Versió:** 3.4.0 (Client-Side SPA amb Suport Multi-Etapa Infantil/Primària, Web Worker & Plantilla Excel)  
**Data d'actualització:** Juliol 2026  
**Tecnologies principals:** React 19, Vite 8, Web Workers, ExcelJS, jsPDF, Tailwind CSS v4, Lucide Icons  

---

## 📌 1. Arquitectura i Visió General

El **Generador d'Horaris** és una aplicació web d'una sola pàgina (*Single Page Application - SPA*) dissenyada per solucionar la confecció d'horaris lectius en centres educatius d'**Educació Infantil (I3-I5)** i **Educació Primària (1r-6è)**.

---

## 🎨 2. Arquitectura Multi-Etapa (Infantil vs Primària)

1. **Atribut d'Etapa en Grups (`group.stage`):**
   - Atribut `"INFANTIL"` o `"PRIMARIA"` assignat a cada grup classe.
2. **Esquemes de Franges per Etapa (`slotsByStageAndDay`):**
   - Suport per a vectors de franges diferenciats per a Infantil (*Hàbits, Ambients, Racons, Esbarjo Infantil*) i Primària (*Sessions lectives ordinàries*).
3. **Suggeriments d'Àrees Curriculars Dinàmics:**
   - Arrays `INFANTIL_SUBJECTS` i `PRIMARIA_SUBJECTS` a [sampleData.js](./web-app/src/utils/sampleData.js) amb persistència i edició dinàmica a `App.jsx` (`localStorage`) i modal a [ActivitiesTab.jsx](./web-app/src/components/ActivitiesTab.jsx).
4. **Reordenació i Classificació de Franges:**
   - Suport Drag & Drop (`GripVertical`) i algoritme de classificació cronològica (`sortSlotsChronologically`) segons minuts reals d'inici a [SchoolSettingsModal.jsx](./web-app/src/components/SchoolSettingsModal.jsx) i [TimeSlotsModal.jsx](./web-app/src/components/TimeSlotsModal.jsx).
5. **Prevenció de Conflictes d'Especialistes Cross-Stage:**
   - Comprobació d'intervals temporals en minuts reals per evitar solapaments quan un mestre d'Anglès, Música o Educació Física/Psicomotricitat fa classe a Infantil i Primària.

---

## 📊 3. Mòdul de Plantilla Excel (`excelTemplate.js`)

- 6 fulls estructurats (`1_CENTRE`, `2_FRANGES`, `3_MESTRES`, `4_GRUPS_I_AULES`, `5_ACTIVITATS`, `6_INSTRUCCIONS`).
- Suport per a importació i exportació de sessions de 45m, 50m, 1h, 1.5h i 2h.
- Columnes dedicades per a Grups i Etapa (`Infantil` / `Primària`).

---

## ⚡ 4. Arquitectura de Càlcul amb Web Worker (`solverWorker.js` i `solver.js`)

- Fil secundari per mantenir la UI 100% responsive durant la resolució CSP.
- Càlcul dinàmic de les sessions setmanals desglossades segons la durada decimal de la sessió (`sessionHours`).

---

## 🚀 5. Execució en Local i Producció

```bash
cd web-app
npm run dev    # Servidor local a http://localhost:5173/
npm run build  # Genera el bundle optimitzat a web-app/dist/
```
