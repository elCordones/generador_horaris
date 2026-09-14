import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import WizardNav from "./components/WizardNav";
import SchoolSettingsModal from "./components/SchoolSettingsModal";

import TeachersTab from "./components/TeachersTab";
import GroupsTab from "./components/GroupsTab";
import ActivitiesTab from "./components/ActivitiesTab";
import ValidationTab from "./components/ValidationTab";
import GlobalBlocksTab from "./components/GlobalBlocksTab";
import GenerateTab from "./components/GenerateTab";
import ScheduleViewTab from "./components/ScheduleViewTab";
import ExportTab from "./components/ExportTab";

import {
  DEFAULT_DAYS,
  DEFAULT_SLOTS,
  DEFAULT_SLOTS_BY_DAY,
  INITIAL_SCHOOL_SETTINGS,
  INITIAL_TEACHERS,
  INITIAL_GROUPS,
  INITIAL_ROOMS,
  INITIAL_ACTIVITIES,
  INITIAL_BLOCKED_SLOTS,
  INFANTIL_SUBJECTS,
  PRIMARIA_SUBJECTS
} from "./utils/sampleData";

import { validateProject } from "./utils/validation";
import { generateExcelTemplate, parseExcelTemplate } from "./utils/excelTemplate";

const LOCAL_STORAGE_KEY = "GENERADOR_HORARIS_PROJECT_DATA_V3.0";

export default function App() {
  const [schoolSettings, setSchoolSettings] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_SETTINGS`);
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_SETTINGS;
  });

  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_DAYS`);
    return saved ? JSON.parse(saved) : DEFAULT_DAYS;
  });

  const [slotsByDay, setSlotsByDay] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_SLOTS_BY_DAY`);
    return saved ? JSON.parse(saved) : DEFAULT_SLOTS_BY_DAY;
  });

  const [slots, setSlots] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_SLOTS`);
    return saved ? JSON.parse(saved) : DEFAULT_SLOTS;
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_TEACHERS`);
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_GROUPS`);
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ROOMS`);
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ACTIVITIES`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [blockedSlots, setBlockedSlots] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_BLOCKED`);
    return saved ? JSON.parse(saved) : INITIAL_BLOCKED_SLOTS;
  });

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_SCHEDULES`);
    return saved ? JSON.parse(saved) : {};
  });

  const [infantilSubjects, setInfantilSubjects] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_INFANTIL_SUBJECTS`);
    return saved ? JSON.parse(saved) : INFANTIL_SUBJECTS;
  });

  const [primariaSubjects, setPrimariaSubjects] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_PRIMARIA_SUBJECTS`);
    return saved ? JSON.parse(saved) : PRIMARIA_SUBJECTS;
  });

  const [activeStep, setActiveStep] = useState(1);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_SETTINGS`, JSON.stringify(schoolSettings));
  }, [schoolSettings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_DAYS`, JSON.stringify(days));
  }, [days]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_SLOTS_BY_DAY`, JSON.stringify(slotsByDay));
  }, [slotsByDay]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_SLOTS`, JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_TEACHERS`, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_GROUPS`, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ROOMS`, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ACTIVITIES`, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_BLOCKED`, JSON.stringify(blockedSlots));
  }, [blockedSlots]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_SCHEDULES`, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_INFANTIL_SUBJECTS`, JSON.stringify(infantilSubjects));
  }, [infantilSubjects]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_PRIMARIA_SUBJECTS`, JSON.stringify(primariaSubjects));
  }, [primariaSubjects]);

  // Real-time validation computation
  const validationStatus = useMemo(() => {
    return validateProject({ teachers, groups, rooms, activities, blockedSlots, days, slots, slotsByDay });
  }, [teachers, groups, rooms, activities, blockedSlots, days, slots, slotsByDay]);

  // Handlers
  const handleLoadSampleData = () => {
    if (confirm("Vols carregar les dades d'exemple amb franges asimètriques per dia (ex. Lectura dilluns 9-9:30)? Això substituirà el projecte actual.")) {
      setSchoolSettings(INITIAL_SCHOOL_SETTINGS);
      setDays(DEFAULT_DAYS);
      setSlotsByDay(DEFAULT_SLOTS_BY_DAY);
      setSlots(DEFAULT_SLOTS);
      setTeachers(INITIAL_TEACHERS);
      setGroups(INITIAL_GROUPS);
      setRooms(INITIAL_ROOMS);
      setActivities(INITIAL_ACTIVITIES);
      setBlockedSlots(INITIAL_BLOCKED_SLOTS);
      setSchedules({});
      setActiveStep(1);
    }
  };

  const handleReset = () => {
    if (confirm("Segur que vols esborrar totes les dades del projecte actual?")) {
      setTeachers([]);
      setGroups([]);
      setRooms([]);
      setActivities([]);
      setBlockedSlots([]);
      setSchedules({});
      setActiveStep(1);
    }
  };

  const handleSaveProjectJSON = () => {
    const data = {
      version: "3.0",
      timestamp: new Date().toISOString(),
      schoolSettings,
      days,
      slots,
      slotsByDay,
      teachers,
      groups,
      rooms,
      activities,
      blockedSlots,
      schedules
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Projecte_Horaris_${(schoolSettings.institutionName || "Escola").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadProjectJSON = (data) => {
    if (data.teachers && data.groups && data.activities) {
      if (data.schoolSettings) setSchoolSettings(data.schoolSettings);
      if (data.days) setDays(data.days);
      if (data.slotsByDay) setSlotsByDay(data.slotsByDay);
      if (data.slots) setSlots(data.slots);
      setTeachers(data.teachers || []);
      setGroups(data.groups || []);
      setRooms(data.rooms || []);
      setActivities(data.activities || []);
      setBlockedSlots(data.blockedSlots || []);
      setSchedules(data.schedules || {});
      setActiveStep(1);
      alert("Projecte carregat correctament!");
    } else {
      alert("Fitxer JSON incomplet o amb format incompatible.");
    }
  };

  const handleDownloadExcelTemplate = () => {
    generateExcelTemplate(schoolSettings, days, slotsByDay);
  };

  const handleImportExcelTemplate = async (fileBuffer) => {
    try {
      const parsed = await parseExcelTemplate(fileBuffer);
      if (parsed) {
        if (parsed.schoolSettings && Object.keys(parsed.schoolSettings).length > 0) {
          setSchoolSettings(prev => ({ ...prev, ...parsed.schoolSettings }));
        }
        if (parsed.days && parsed.days.length > 0) setDays(parsed.days);
        if (parsed.slotsByDay && Object.keys(parsed.slotsByDay).length > 0) setSlotsByDay(parsed.slotsByDay);
        if (parsed.teachers) setTeachers(parsed.teachers);
        if (parsed.groups) setGroups(parsed.groups);
        if (parsed.rooms) setRooms(parsed.rooms);
        if (parsed.activities) setActivities(parsed.activities);
        setSchedules({});
        setActiveStep(1);

        alert(`🌱 S'ha carregat la plantilla Excel amb èxit!\n\n` +
          `• Mestres carregats: ${parsed.teachers.length}\n` +
          `• Grups de classe: ${parsed.groups.length}\n` +
          `• Aules especials: ${parsed.rooms.length}\n` +
          `• Activitats lectives: ${parsed.activities.length}`);
      }
    } catch (err) {
      alert("Error en llegir o importar el fitxer Excel: " + err.message);
    }
  };

  const projectData = { schoolSettings, teachers, groups, rooms, activities, blockedSlots, days, slots, slotsByDay };
  const hasSchedule = schedules && Object.keys(schedules).length > 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Header */}
      <Header
        schoolSettings={schoolSettings}
        onSaveProject={handleSaveProjectJSON}
        onLoadProject={handleLoadProjectJSON}
        onLoadSample={handleLoadSampleData}
        onReset={handleReset}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onDownloadExcelTemplate={handleDownloadExcelTemplate}
        onImportExcelTemplate={handleImportExcelTemplate}
      />

      {/* School Settings Modal */}
      <SchoolSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        schoolSettings={schoolSettings}
        setSchoolSettings={setSchoolSettings}
        rooms={rooms}
        setRooms={setRooms}
        days={days}
        setDays={setDays}
        slots={slots}
        setSlots={setSlots}
        slotsByDay={slotsByDay}
        setSlotsByDay={setSlotsByDay}
        teachers={teachers}
        setTeachers={setTeachers}
        blockedSlots={blockedSlots}
        setBlockedSlots={setBlockedSlots}
      />

      {/* 8-Step Wizard Bar */}
      <WizardNav
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        validationStatus={validationStatus}
        hasSchedule={hasSchedule}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeStep === 1 && (
          <TeachersTab
            teachers={teachers}
            setTeachers={setTeachers}
            days={days}
            slots={slots}
            slotsByDay={slotsByDay}
          />
        )}

        {activeStep === 2 && (
          <GroupsTab
            groups={groups}
            setGroups={setGroups}
            rooms={rooms}
            setRooms={setRooms}
            activities={activities}
          />
        )}

        {activeStep === 3 && (
          <ActivitiesTab
            activities={activities}
            setActivities={setActivities}
            teachers={teachers}
            groups={groups}
            rooms={rooms}
            days={days}
            slots={slots}
            slotsByDay={slotsByDay}
            infantilSubjects={infantilSubjects}
            setInfantilSubjects={setInfantilSubjects}
            primariaSubjects={primariaSubjects}
            setPrimariaSubjects={setPrimariaSubjects}
          />
        )}

        {activeStep === 4 && (
          <ValidationTab validationStatus={validationStatus} onGoToStep={setActiveStep} />
        )}

        {activeStep === 5 && (
          <GlobalBlocksTab
            blockedSlots={blockedSlots}
            setBlockedSlots={setBlockedSlots}
            days={days}
            slots={slots}
            slotsByDay={slotsByDay}
          />
        )}

        {activeStep === 6 && (
          <GenerateTab
            projectData={projectData}
            validationStatus={validationStatus}
            setSchedules={setSchedules}
            onGoToStep={setActiveStep}
            schedules={schedules}
          />
        )}

        {activeStep === 7 && (
          <ScheduleViewTab
            schedules={schedules}
            setSchedules={setSchedules}
            teachers={teachers}
            groups={groups}
            rooms={rooms}
            activities={activities}
            blockedSlots={blockedSlots}
            days={days}
            slots={slots}
            slotsByDay={slotsByDay}
          />
        )}

        {activeStep === 8 && (
          <ExportTab
            schedules={schedules}
            blockedSlots={blockedSlots}
            days={days}
            slots={slots}
            slotsByDay={slotsByDay}
            schoolSettings={schoolSettings}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-xs text-slate-400 space-y-2">
        <p className="font-semibold text-slate-300">
          © 2026 David Cordones
        </p>
        <p className="text-slate-400">
          Llicència del codi: <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-400 hover:text-blue-300 underline">AGPL v3</a> · Contingut: <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1">
            <svg className="w-4 h-4 text-slate-300 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1.8-10.7a1.9 1.9 0 0 1 1.4.6l-1 1a.7.7 0 0 0-.5-.3 1 1 0 0 0-1 1 1 1 0 0 0 1 1 .7.7 0 0 0 .5-.3l1 1a1.9 1.9 0 0 1-1.4.6 2.3 2.3 0 0 1-2.3-2.3 2.3 2.3 0 0 1 2.3-2.3zm4.5 0a1.9 1.9 0 0 1 1.4.6l-1 1a.7.7 0 0 0-.5-.3 1 1 0 0 0-1 1 1 1 0 0 0 1 1 .7.7 0 0 0 .5-.3l1 1a1.9 1.9 0 0 1-1.4.6 2.3 2.3 0 0 1-2.3-2.3 2.3 2.3 0 0 1 2.3-2.3z"/>
            </svg>
            <span>CC BY-SA 4.0</span>
          </a>
        </p>
        <p className="text-[11px] text-slate-500 pt-0.5">
          Aquesta obra està sota llicència <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">CC BY-SA 4.0</a>
        </p>
      </footer>

    </div>
  );
}
