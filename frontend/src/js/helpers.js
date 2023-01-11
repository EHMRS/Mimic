//@ts-check
import { SectionState, SignalState } from "./enums";
// const enums = require('./js');

export function sectionColour(state) {
  switch (state) {
    case SectionState.Unoccupied:
      return "#666666";

    case SectionState.Occupied:
      return "#FF0000";

    case SectionState.Route:
      return "#FFFFFF";

    case SectionState.Engineer:
      return "#00FFFF";

    case SectionState.Blank:
      return "#000000";
  }
}

/**
 * Get the colour of the shunt aspect of a signal
 * @param {string} state The state of the signal
 * @param {boolean} signal Whether this signal has a signal head and shunt head
 * @returns {String} colour of the signal aspect
 */
export function shuntColour(state, signal = true) {
  switch (state) {
    case SignalState.Shunt:
      return "#FFFFFF";
    case SignalState.NoAspect:
      return "#666666";
    default:
      if (!signal) return "#FF0000";
      return "#666666";
  }
}

/**
 * Get the colour of the signal aspect of a signal
 * @param {string} state The state of the signal
 * @returns {String} colour of the signal aspect
 */
export function signalColour(state) {
  switch (state) {
    case SignalState.Danger:
    case SignalState.Shunt:
      return "#FF0000";

    case SignalState.Caution:
      return "#FFFF00";

    case SignalState.Clear:
      return "#00FF00";

    case SignalState.Engineer:
      return "#0000FF";

    case SignalState.NoAspect:
      return "#666666";
  }
}
