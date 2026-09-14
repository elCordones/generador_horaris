# Generador d'Horaris Escolars - Estat i Documentació del Projecte

## 1. Descripció i Especificacions del Projecte
- **Objectiu principal**: Aplicació web SPA (Single Page Application) gratuïta i oberta per a la confecció, optimització algorítmica i edició interactiva d'horaris escolars a centres d'Educació Infantil (I3-I5) i Educació Primària (1r-6è).
- **Públic destinatari**: Equips directius, caps d'estudis, coordinadors pedagògics i docents.
- **Stack tecnològic**:
  - **Framework / Runtime**: React 19, Vite 8
  - **Estils**: Tailwind CSS v4 (amb suport fosc/clar)
  - **Càlcul**: Web Workers API (CSP Solver en fil secundari sense bloquejar la UI)
  - **Formats i I/O**: ExcelJS (lectura i escriptura de `.xlsx` amb estil), jsPDF & jsPDF-AutoTable (PDFs vectorials), Canvas Confetti
  - **Icones**: Lucide React
  - **Qualitat de codi**: oxlint
- **Arquitectura i fitxers clau**:
  - `web-app/src/App.jsx`: Gestió d'estat global, persistència a `localStorage` i pestanyes de l'assistent.
  - `web-app/src/utils/solver.js` & `solverWorker.js`: Motor de resolució CSP per a la generació automàtica d'horaris.
  - `web-app/src/utils/excelTemplate.js`: Mòdul de creació i lectura de la plantilla Excel estructurada en 6 fulls.
  - `web-app/src/utils/exporters.js`: Exportadors de PDF i Excel amb suport per al logotip oficial del centre.
  - `web-app/src/components/ScheduleViewTab.jsx`: Taula interactiva d'horaris amb Drag & Drop i historial de desfer (`Ctrl+Z`).

## 2. Estat Actual i Punt de Control (Sessió: 2026-09-14)
- **Estat general**: **Versió 3.4.0** plenament funcional, provada i llesta per al desplegament a producció / GitHub.
- **Funcionalitats completades**:
  - [x] Suport Multi-Etapa natiu (Infantil I3-I5 vs Primària 1r-6è) amb franges, racons i àmbits independents.
  - [x] Resolució CSP creuada per evitar conflictes d'especialistes (Anglès, Música, Psicomotricitat) o aules comunes.
  - [x] Plantilla Excel en 6 pestanyes oficials amb reconeixement d'especialitats entre parèntesis.
  - [x] Logotip del centre oficial als documents PDF i graelles Excel.
  - [x] Resolució CSP en fil segon pla (Web Worker) garantint 60fps constants.
  - [x] Suport per a sessions de 45m i mòduls mixtos amb auto-ordenació cronològica.
  - [x] Gestor d'àmbits i assignatures suggerides editable i persistent.
  - [x] Auditoria de seguretat superada (zero secrets, zero PII, 100% Client-Side).
  - [x] README.md professional per a GitHub i configuració de GitHub Pages (.github/workflows/deploy.yml).
- **Punt exacte on ens hem quedat**:
  - S'ha creat el README.md d'estàndard professional, el fitxer `.gitignore` arrel i el flux de treball de GitHub Actions. S'està procedint a la inicialització de Git i preparació del commit inicial per pujar el repositori a GitHub.

## 3. Full de Ruta d'Implementació (Roadmap / Propers Passos)
- **Tasques immediates per a la següent sessió**:
  - [ ] Enllaçar el repositori local amb el repositori remot de GitHub (`git remote add origin ...`) i fer `git push`.
  - [ ] Verificar el desplegament automàtic a GitHub Pages mitjançant GitHub Actions.
- **Millores futures i backlog**:
  - [ ] **Mòdul de Gàrdies i Substitucions**: Gestor d'incidències i ausències diàries amb assignació automàtica de professorat de guàrdia.
  - [ ] **Full de Guàrdia Imprimible**: Generació de PDF diari de substitucions per a la sala de mestres.
  - [ ] **Publicació i Enllaços iCal / Google Calendar**: Exportació i sincronització de calendaris per al professorat.
