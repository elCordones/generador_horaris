# 📘 Guia d'Ús de l'Aplicació: Generador d'Horaris Escolars

**Versió:** 3.4.0 Web (amb Suport Multi-Etapa per a Infantil I3-I5 i Primària 1r-6è)  
**Destinataris:** Equips directius, caps d'estudis i coordinadors pedagògics  

---

## 🌟 Introducció

Benvingut/da al **Generador d'Horaris Escolars**, una aplicació web dissenyada per simplificar i automatitzar la creació dels horaris lectius del teu centre educatiu (Infantil, Primària, Secundària, ZERs i Instituts-Escola).

### 💡 Avantatges principals per al centre:
- **Diferenciació d'Etapes (Infantil vs Primària):** Permet definir esquemes de franges horàries i ritmes diferenciats per a Infantil (ambients, racons, hàbits) i Primària (matèries reglades).
- **Suggeriments d'Àrees Adaptades:** Desplegables de matèries i àmbits automàtics segons si el grup és d'Infantil (*Ambients d'Aprenentatge, Psicomotricitat, Racons, Anglès d'Infantil...*) o de Primària (*Matemàtiques, Català, Anglès, Medi...*).
- **Personalització d'Àmbits i Àrees Suggerides:** Botó **`⚙️ Editar`** a la pestanya 3 per afegir noves assignatures ràpides (Robòtica, Escacs, Teatre...), eliminar-ne o restaurar la llista oficial.
- **Reordenació de Franges amb Drag & Drop i Auto-Ordre:** Arrossegar franges horàries directament o ordenar-les automàticament de matí a tarda amb el botó **`Ordenar Cronològicament`**.
- **Suport per a Sessions de 45 Minuts i Mòduls Mixtos:** Selecció directa de durada per sessió (30m, 45m, 50m, 1h, 1.5h, 2h) amb càlcul automàtic del nombre de sessions setmanals resultants.
- **Càrrega Masiva des d'Excel:** Plantilla d'Excel amb suport per a durades de 45m i pestanya dedicada `4_GRUPS_I_AULES` amb suport per especificar l'etapa de cada grup.
- **Informació d'Especialitats entre Parèntesis:** Suport per escriure `Nom (Educació Física, Tutor 5è A)` als fulls de càlcul.
- **Logo Oficial del Centre:** Logotip personalitzat a les capçaleres de PDF i Excel.
- **Motor en Segon Pla (Web Worker):** Calculador CSP 100% fluid.
- **Edició Interactiva Drag & Drop i Desfer (`Ctrl+Z`):** Retocs manuals intuïtius.

---

## ⚙️ Com utilitzar la Configuració del Centre i Etapes

En clicar el botó **`Configuració`** a la barra superior:

1. **⏰ Franges Horàries per Etapa i Dia:**
   - Selecciona l'etapa (**📚 Educació Primària** or **🎨 Educació Infantil**).
   - Defineix les franges horàries específiques per a cada dia. Pots reordenar-les arrossegant amb el ratolí (**Drag & Drop**) o prem **`Ordenar Cronològicament`** per ordenar-les automàticament de matí a tarda.
2. **🏢 Aules i Espais:** Afegeix aules ordinàries i espais especials com l'*Aula de Psicomotricitat*, *Gimnàs* o *Aula de Música*.
3. **🏫 Identitat i Logo:** Defineix les dades del centre i puja el logo oficial.
4. **🎯 Criteris Pedagògics:** Limita hores diàries per mestre, evita finestres i protegeix divendres tarda.

---

## 📋 Pas a Pas: Com crear un horari

### 1️⃣ Pas 1: Gestió de Mestres i Disponibilitat
- Escriu els mestres de centre i especialistes compartits.

### 2️⃣ Pas 2: Grups i Etapes
- Afaga els grups d'Infantil (*I3, I4, I5*) triant l'etapa **🎨 Educació Infantil** i els grups de Primària (*1r A, 2n A...*) triant **📚 Educació Primària**.

### 3️⃣ Pas 3: Assignar Activitats i Àmbits
- Selecciona les àrees suggerides o prem **`⚙️ Editar`** per personalitzar els botons d'àmbits ràpids del centre (afegir *Robòtica*, *Teatre*, *Escacs*...).
- Tria la durada per sessió (30m, 45m, 1h, 1.5h, 2h) i el sistema calcularà automàticament el nombre de sessions setmanals desglossades.

### 4️⃣ Pas 4: Generar i Visualitzar l'Horari
- Prem **Generar Horari Ara**. L'algorisme trobarà la millor combinació garantint que cap especialista ni espai compartit (com el gimnàs) tingui conflictes entre Infantil i Primària.
- Retoca amb **Drag & Drop** o utilitza **Desfer (`Ctrl+Z`)**.

---

<p align="center">
  David Cordones (2026)<br>
  Llicència del codi: AGPL v3 · Contingut: Aquesta obra està sota llicència <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
</p>
