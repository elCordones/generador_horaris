import React, { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { Play, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Cpu, Activity } from "lucide-react";
import { solveScheduleClientSide } from "../utils/solver";

export default function GenerateTab({ projectData, validationStatus, setSchedules, onGoToStep, schedules }) {
  const [isSolving, setIsSolving] = useState(false);
  const [solveResult, setSolveResult] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const workerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) workerRef.current.terminate();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleGenerate = () => {
    if (!validationStatus.isValid) {
      alert("No es pot generar l'horari mentre hi hagi errors greus a la pestanya de Validació.");
      return;
    }

    setIsSolving(true);
    setSolveResult(null);
    setElapsedSeconds(0);

    const startTime = performance.now();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    // Try executing in background Web Worker
    try {
      if (workerRef.current) {
        workerRef.current.terminate();
      }

      workerRef.current = new Worker(
        new URL("../utils/solverWorker.js", import.meta.url),
        { type: "module" }
      );

      workerRef.current.onmessage = (e) => {
        clearInterval(timerRef.current);
        const result = e.data;
        setIsSolving(false);
        workerRef.current.terminate();
        workerRef.current = null;

        if (result.success) {
          setSchedules(result.schedules);
          setSolveResult({
            success: true,
            iterations: result.iterations,
            restarts: result.restarts,
            timeMs: result.timeMs
          });

          try {
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 }
            });
          } catch (err) {}
        } else {
          setSolveResult({
            success: false,
            message: result.message
          });
        }
      };

      workerRef.current.onerror = (err) => {
        console.warn("Web Worker Error, falling back to main thread:", err);
        runInlineFallback(startTime);
      };

      workerRef.current.postMessage({ projectData });

    } catch (err) {
      console.warn("Web Worker initialization failed, running fallback inline:", err);
      runInlineFallback(startTime);
    }
  };

  const runInlineFallback = (startTime) => {
    setTimeout(() => {
      const result = solveScheduleClientSide(projectData);
      const endTime = performance.now();
      const elapsedMs = Math.round(endTime - startTime);

      if (timerRef.current) clearInterval(timerRef.current);
      setIsSolving(false);

      if (result.success) {
        setSchedules(result.schedules);
        setSolveResult({
          success: true,
          iterations: result.iterations,
          restarts: result.restarts,
          timeMs: elapsedMs
        });

        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      } else {
        setSolveResult({
          success: false,
          message: result.message
        });
      }
    }, 50);
  };

  const hasGeneratedSchedule = schedules && Object.keys(schedules).length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-xl">
        
        <div className="inline-flex p-4 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl text-white shadow-lg shadow-blue-500/25">
          <Cpu className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center justify-center gap-2">
            <span>Motor de Generació CSP (Web Worker)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-normal">
              Background Thread
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-2">
            El motor executarà l'algorisme de resolució de restriccions en un fil segundari (*Web Worker*) per mantenir la interfície fluida i sense congelacions.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleGenerate}
            disabled={isSolving || !validationStatus.isValid}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all mx-auto ${
              isSolving
                ? "bg-slate-700 text-slate-400 cursor-not-allowed border border-blue-500/40"
                : !validationStatus.isValid
                ? "bg-rose-900/50 text-rose-300 border border-rose-700 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30 hover:scale-[1.02]"
            }`}
          >
            {isSolving ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
                <span>Calculant la millor combinació en segon pla ({elapsedSeconds}s)...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{hasGeneratedSchedule ? "Tornar a Generar Horari" : "Generar Horari Ara"}</span>
              </>
            )}
          </button>
        </div>

        {/* Results Banner */}
        {solveResult && solveResult.success && (
          <div className="p-5 bg-emerald-950/50 border border-emerald-600/60 rounded-xl text-emerald-200 text-left space-y-3 shadow-inner">
            <div className="flex items-center justify-between font-bold text-sm text-emerald-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Horari calculat amb èxit!</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono">
                ⚡ {solveResult.timeMs} ms
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-emerald-800/60">
              <div className="bg-emerald-900/40 p-2 rounded-lg">
                <span className="block text-emerald-400 font-bold text-sm">{solveResult.timeMs} ms</span>
                <span className="text-[10px] text-emerald-300/80">Temps de càlcul</span>
              </div>
              <div className="bg-emerald-900/40 p-2 rounded-lg">
                <span className="block text-emerald-400 font-bold text-sm">{solveResult.iterations}</span>
                <span className="text-[10px] text-emerald-300/80">Comprovacions</span>
              </div>
              <div className="bg-emerald-900/40 p-2 rounded-lg">
                <span className="block text-emerald-400 font-bold text-sm">{solveResult.restarts}</span>
                <span className="text-[10px] text-emerald-300/80">Re-intents</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => onGoToStep(7)}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>Retocar i Arrossegar Horari</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onGoToStep(8)}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>Exportar Excel / PDF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {solveResult && !solveResult.success && (
          <div className="p-4 bg-rose-950/50 border border-rose-600/60 rounded-xl text-rose-200 text-xs text-left space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>No s'ha pogut generar l'horari</span>
            </div>
            <p>{solveResult.message}</p>
          </div>
        )}

      </div>
    </div>
  );
}

