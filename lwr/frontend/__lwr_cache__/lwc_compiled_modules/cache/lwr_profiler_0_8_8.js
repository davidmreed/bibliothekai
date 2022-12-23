var Phase;
(function (Phase) {
  Phase[Phase["Start"] = 0] = "Start";
  Phase[Phase["End"] = 1] = "End";
})(Phase || (Phase = {}));

// Attach a custom dispatcher
let customDispatcher;
export function attachDispatcher(dispatcher) {
  customDispatcher = dispatcher;
} // Check if the Performance API is available
// e.g. JSDom (used in Jest) doesn't implement these

const perf = globalThis.performance;
const isPerfSupported = typeof perf !== 'undefined' && typeof perf.mark === 'function' && typeof perf.clearMarks === 'function' && typeof perf.measure === 'function' && typeof perf.clearMeasures === 'function'; // For marking request metrics
// Fallback to the Performance API if there is no custom dispatcher

export function logOperationStart({
  id,
  specifier
}) {
  if (customDispatcher) {
    customDispatcher({
      id,
      phase: Phase.Start,
      specifier
    });
  } else if (isPerfSupported) {
    perf.mark(id + (specifier ? `.${specifier}` : ''));
  }
} // For measuring duration metrics
// Fallback to the Performance API if there is no custom dispatcher

/* istanbul ignore next */

export function logOperationEnd({
  id,
  specifier
}) {
  if (customDispatcher) {
    customDispatcher({
      id,
      phase: Phase.End,
      specifier
    });
  } else if (isPerfSupported) {
    const suffix = specifier ? `.${specifier}` : '';
    const markName = id + suffix;
    const measureName = `${id}.duration${suffix}`;
    perf.measure(measureName, markName); // Clear the created mark and measure to avoid filling the performance entry buffer
    // Even if they get deleted, existing PerformanceObservers preserve copies of the entries

    perf.clearMarks(markName);
    perf.clearMeasures(measureName);
  }
}