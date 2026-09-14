import { solveScheduleClientSide } from "./solver.js";

/**
 * Web Worker for running the CSP Solver in a background thread.
 * Keeps the main UI thread 100% smooth and responsive even for large schools.
 */

self.onmessage = function(e) {
  const { projectData, maxRestarts = 15, maxIterationsPerAttempt = 30000 } = e.data;
  const startTime = performance.now();

  try {
    const result = solveScheduleClientSide(projectData, maxRestarts, maxIterationsPerAttempt);
    const endTime = performance.now();
    const elapsedMs = Math.round(endTime - startTime);

    self.postMessage({
      ...result,
      timeMs: elapsedMs
    });
  } catch (err) {
    self.postMessage({
      success: false,
      message: "Error en el fil de càlcul segon pla (Web Worker): " + err.message
    });
  }
};
