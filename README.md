# 📅 Generador d'Horaris Escolars

<p align="center">
  <img src="./web-app/src/assets/hero.png" alt="Generador d'Horaris Escolars" width="160" style="border-radius: 16px; margin-bottom: 12px;" />
</p>

<p align="center">
  <strong>Aplicació web oberta, ràpida i intuïtiva per a la confecció, optimització i gestió d'horaris lectius en centres d'Educació Infantil i Primària.</strong>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB" alt="React 19"></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite_8-646CFF?logo=vite&logoColor=white" alt="Vite 8"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://www.gnu.org/licenses/agpl-3.0.html"><img src="https://img.shields.io/badge/Codi-AGPL_v3-blue.svg" alt="Llicència Codi AGPL v3"></a>
  <a href="https://creativecommons.org/licenses/by-sa/4.0/"><img src="https://img.shields.io/badge/Continguts-CC_BY--SA_4.0-orange.svg" alt="Llicència Continguts CC BY-SA 4.0"></a>
  <a href="https://rgpd.cat/"><img src="https://img.shields.io/badge/Privacitat-100%25_Client--Side-22c55e.svg" alt="Privacitat 100% Client-Side"></a>
</p>

---

## 🌐 Accés Directe a l'Aplicació

Pots utilitzar l'aplicació en línia directament sense instal·lar cap programa al teu ordinador:

👉 **[Obrir el Generador d'Horaris Escolars](https://elcordones.github.io/generador-horaris/)** *(desplegat a GitHub Pages)*

> [!TIP]
> **Instal·lable en 1 clic (App d'escriptori / PWA):** Des de Google Chrome o Microsoft Edge, pots fer clic a la icona de la barra d'adreces **"Instal·lar aplicació"** per tenir una icona directa a l'escriptori del teu ordinador. Funciona fins i tot **sense connexió a Internet**!

---

## ✨ Característiques Principals

### 🎨 1. Suport Multi-Etapa Nadiu (Infantil I3-I5 vs Primària 1r-6è)
* **Franges horàries diferenciades:** Defineix esquemes de temps específics per a Infantil (*Hàbits d'entrada, Ambients d'aprenentatge, Racons, Esbarjo propi*) i Primària (*Sessions lectives ordinàries*).
* **Àmbits i Àrees curriculars intel·ligents:** Suggeriments automàtics d'assignatures segons l'etapa del grup, amb modal personalitzable per afegir matèries pròpies de centre (Robòtica, Teatre, Filosofia, Escacs...).
* **Detecció de conflictes creuats:** L'algorisme comprova intervals en minuts reals per garantir que els especialistes compartits (Anglès, Música, Educació Física / Psicomotricitat) o els espais comuns (Gimnàs, Aula de Psicomotricitat) no tinguin cap solapament.

### ⚡ 2. Motor de Càlcul CSP en Fil Secundari (Web Worker)
* **Interfície sempre fluida:** La resolució matemàtica de restriccions lectives (*Constraint Satisfaction Problem*) s'executa en un Web Worker independent (`solverWorker.js`).
* **Resolució ultraràpida:** Generació completa d'horaris en mil·lisegons, amb detecció prèvia de colls d'ampolla i avisos preventius abans de calcular.

### 📥 3. Plantilla Excel Reorganitzada en 6 Fulls (`excelTemplate.js`)
* Permet als equips directius preparar les dades des de qualsevol full de càlcul Excel:
  1. `1_CENTRE`: Nom de la institució, curs escolar i criteris generals.
  2. `2_FRANGES`: Hores d'inici i finalització diferenciades per dia i etapa.
  3. `3_MESTRES`: Noms de la plantilla docent amb reconeixement d'especialitat entre parèntesis `Nom (Educació Física, Tutor 5è A)`.
  4. `4_GRUPS_I_AULES`: Llistat de grups classe amb assignació d'etapa (*Infantil* / *Primària*) i espais específics.
  5. `5_ACTIVITATS`: Matèries, cotutories, aules especials i durada de sessió.
  6. `6_INSTRUCCIONS`: Guia integrada amb exemples reals per emplenar fàcilment el document.

### 🖱️ 4. Visualitzador i Editor Interactiu (Drag & Drop + Desfer `Ctrl+Z`)
* **3 Vistes flexibles:** Visió per **Grup Classe**, per **Mestre** o vista **Màster de Centre**.
* **Retocs manuals fàcils:** Arrossega qualsevol sessió d'una franja a una altra amb el ratolí.
* **Historial complet de canvis:** Desfés qualsevol error en un instant prement `Ctrl+Z` o el botó de desfer.

### 🖨️ 5. Exportació Professional en PDF i Excel
* **Logotip oficial del centre:** Puja l'escut o logotip de la teva escola des de la configuració i s'incrustarà automàticament a la capçalera de tots els documents.
* **Informes llestos per imprimir:** Horaris individuals per a cada docent, horaris de grup per penjar a l'aula i graella mestra general per a la sala de mestres.

### ⏱️ 6. Mòduls Flexibles i Ordenació Cronològica
* Suport directe per a mòduls de **30 minuts, 45 minuts, 50 minuts, 1 hora, 1.5 hores o 2 hores**.
* Botó **`Ordenar Cronològicament`** i nanses d'arrossegar (`GripVertical`) per ordenar les franges del dia de matí a tarda en 1 sol clic.

### 🔒 7. Privacitat Total (100% Client-Side / RGPD)
* **Zero servidors externs:** Totes les dades (noms de mestres, grups i configuracions) es processen exclusivament a la memòria del navegador de l'usuari i al seu `localStorage`.
* **Seguretat escolar garantida:** Compliment absolut del Reglament General de Protecció de Dades (RGPD) sense dependre de bases de dades a tercers.

---

## 🚀 Guia Ràpida d'Ús

```mermaid
flowchart LR
    A["1. Mestres & Disponibilitat"] --> B["2. Grups & Etapes"]
    B --> C["3. Activitats & Durades"]
    C --> D["4. Generar & Retocar"]
    D --> E["5. Exportar PDF & Excel"]
```

1. **👥 Pas 1 - Equip Docent:** Afegeix els mestres de l'escola i marca la seva disponibilitat o reduccions horàries.
2. **🏫 Pas 2 - Grups i Etapes:** Crea els grups classe assignant-los l'etapa corresponent (**Infantil** o **Primària**).
3. **📚 Pas 3 - Activitats:** Assigna matèries, àmbits, hores setmanals, mestres tutors i especialistes.
4. **⚡ Pas 4 - Generació:** Prem **`Generar Horari Ara`**. El motor trobarà l'assignació òptima evitant solapaments.
5. **🖨️ Pas 5 - Retoc i Exportació:** Ajusta sessions manuals amb Drag & Drop si cal i descarrega els documents en PDF o Excel llestos per imprimir.

---

## 🛠️ Tecnologies Utilitzades

| Tecnologia | Finalitat |
| :--- | :--- |
| **React 19** | Biblioteca declarativa d'interfícies d'usuari d'última generació |
| **Vite 8** | Eina de desenvolupament ultraràpida i empaquetador de producció |
| **Tailwind CSS v4** | Motor d'estils modern basat en utilitats amb suport de mode fosc |
| **Web Workers API** | Càlcul de l'algorisme en un fil d'execució secundari no bloquejant |
| **ExcelJS** | Generació, lectura i estil avançat de fulls de càlcul `.xlsx` |
| **jsPDF & jsPDF-AutoTable** | Generació de documents vectorials i graelles en format PDF |
| **Lucide React** | Conjunt d'icones vectorials netes i consistents |
| **Canvas Confetti** | Animacions visuals de celebració en completar càlculs amb èxit |

---

## 💻 Entorn de Desenvolupament Local

Si vols descarregar el repositori i contribuir al codi o executar-lo al teu equip local:

### Requisits previs
* [Node.js](https://nodejs.org/) v18.0 o superior
* [npm](https://www.npmjs.com/) v9.0 o superior

### Instal·lació pas a pas

```bash
# 1. Clonar el repositori
git clone https://github.com/elCordones/generador-horaris.git

# 2. Entrar al directori de l'aplicació
cd generador-horaris/web-app

# 3. Instal·lar les dependències del projecte
npm install

# 4. Iniciar el servidor local de desenvolupament
npm run dev
```

L'aplicació s'obrirà automàticament a `http://localhost:5173/`.

### Comandes disponibles

* `npm run dev`: Inicia el servidor de desenvolupament amb recàrrega en calent (*HMR*).
* `npm run build`: Compila i minifica el projecte per a producció a la carpeta `web-app/dist/`.
* `npm run lint`: Executa l'analitzador de codi estàtic ràpid `oxlint`.
* `npm run preview`: Previsualitza el paquet de producció generat en local.

---

## 📂 Estructura del Projecte

```text
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD per a desplegament automàtic a GitHub Pages
├── web-app/
│   ├── public/                   # Fitxers estàtics i favicons
│   ├── src/
│   │   ├── assets/               # Imatges i logotips
│   │   ├── components/           # Components React de la interfície
│   │   │   ├── ActivitiesTab.jsx        # Gestió d'activitats i àmbits
│   │   │   ├── ExportTab.jsx            # Mòdul d'impressió i exportació
│   │   │   ├── GenerateTab.jsx          # Llançador del motor de càlcul
│   │   │   ├── GlobalBlocksTab.jsx      # Bloquejos i hores fixes de centre
│   │   │   ├── GroupsTab.jsx            # Gestió de grups i aules
│   │   │   ├── Header.jsx               # Barra superior i accions principals
│   │   │   ├── ScheduleViewTab.jsx      # Taules d'horari amb Drag & Drop
│   │   │   ├── SchoolSettingsModal.jsx  # Paràmetres generals del centre
│   │   │   ├── TeachersTab.jsx          # Gestió de la plantilla docent
│   │   │   ├── TimeSlotsModal.jsx       # Editor de franges horàries
│   │   │   ├── ValidationTab.jsx        # Diagnòstic previ de viabilitat
│   │   │   └── WizardNav.jsx            # Selector de passos guiats
│   │   ├── utils/                # Lògica de negoci i càlculs
│   │   │   ├── excelTemplate.js         # Generador i lector de plantilles Excel
│   │   │   ├── exporters.js             # Motors de renderitzat PDF i Excel
│   │   │   ├── sampleData.js            # Dades inicials i suggeriments curriculars
│   │   │   ├── solver.js                # Algorisme CSP de resolució
│   │   │   ├── solverWorker.js          # Web Worker en fil independent
│   │   │   └── validation.js            # Validador de regles i restriccions
│   │   ├── App.jsx               # Component arrel i gestió d'estat global
│   │   ├── main.jsx              # Punt d'entrada de l'aplicació
│   │   └── index.css             # Estils globals i Tailwind CSS
│   ├── package.json              # Dependències i scripts
│   └── vite.config.js            # Configuració de Vite amb rutes relatives
├── DOCUMENTACIO_TECNICA.md       # Arquitectura detallada del codi
├── GUIA_US_USUARI.md             # Manual d'usuari per a equips directius
├── PROJECT_STATUS.md             # Estat actual, punt de control i roadmap
└── LICENSE                       # Llicències oficials (AGPL v3 + CC BY-SA 4.0)
```

---

## 🗺️ Full de Ruta (Roadmap)

- [x] Suport Multi-Etapa per a Educació Infantil (I3-I5) i Educació Primària (1r-6è).
- [x] Reorganització de plantilla Excel en 6 fulls estructurats.
- [x] Motor de resolució CSP en segon pla mitjançant Web Workers.
- [x] Suport per a mòduls de 45 minuts i sessions mixtes.
- [x] Reordenació de franges amb Drag & Drop i auto-ordenació cronològica.
- [x] Gestor personalitzable d'àmbits i matèries curriculars.
- [ ] **Mòdul de Gàrdies i Substitucions:** Assignació diària de mestres de guàrdia davant d'ausències imprevistes.
- [ ] **Exportació de Fulls de Guàrdia:** PDF diari automàtic de substitucions per a la cartel·lera de la sala de mestres.
- [ ] **Sincronització iCal:** Exportació dels horaris en format de calendari estàndard per a Google Calendar / Outlook.

---

## 📜 Autoria i Llicències

* **Autor:** David Cordones
* **Any:** 2026

* **Llicència del codi:** [GNU Affero General Public License v3.0 (AGPL v3)](https://www.gnu.org/licenses/agpl-3.0.html). El codi és 100% lliure i obert.
* **Llicència dels continguts educatius:** [Creative Commons Reconeixement-CompartirIgual 4.0 Internacional (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).

<p align="center">
  <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">
    <img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-sa.svg" alt="Llicència CC BY-SA 4.0" width="88" height="31" />
  </a>
  <br>
  <strong>© David Cordones · 2026</strong><br>
  <em>Generador d'Horaris Escolars per a centres educatius</em>
</p>
