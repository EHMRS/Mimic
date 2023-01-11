import axios from "axios";
import { load } from "js-yaml";
import { drawSection, drawPoint, drawSignal } from "./track";

export var config = Object();
export var rawConfig;
export var configLoaded = false;

const signallingUrl = new URL("../../signalling.yml", import.meta.url).href;

axios.get(signallingUrl).then((res) => {
  rawConfig = load(res.data);
  configLoaded = true;
  rawConfig["sections"].forEach((thisElement) => {
    if (config.sections === undefined) {
      config.sections = {};
    }
    config.sections[thisElement.name] = thisElement;
    drawSection(thisElement, "unoccupied");
  });
  rawConfig["points"].forEach((thisElement) => {
    if (config.points === undefined) {
      config.points = {};
    }
    config.points[thisElement.name] = thisElement;
    drawPoint(thisElement, "unoccupied", "normal");
  });
  rawConfig["signals"].forEach((thisElement) => {
    if (config.signals === undefined) {
      config.signals = {};
    }
    config.signals[thisElement.name] = thisElement;
    drawSignal(thisElement, "danger");
  });
  rawConfig["crossings"].forEach((thisElement) => {
    if (config.crossings === undefined) {
      config.crossings = {};
    }
    config.crossings[thisElement.name] = thisElement;
  });
  rawConfig["messages"].forEach((thisElement) => {
    if (config.messages === undefined) {
      config.messages = {};
    }
    config.messages[thisElement.name] = thisElement;
  });
});

export const sectionWidth = 25;
export const yOffset = 50;
export const xOffset = 50;
export const yHeight = 30;
export const trackHeight = 7;
export const messageTickSpeed = 3; // In seconds
