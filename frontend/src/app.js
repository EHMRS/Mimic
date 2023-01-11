//@check-ts
import { settings } from "./js/settings.js";
import { WebSocketConnector } from "./js/websocketconnector";
import { text, blankText } from "./js/draw";
import { rawConfig, configLoaded } from "./js/config";
import {
  // drawSection,
  drawSectionLabels,
  drawSectionExtras,
  drawPointExtras,
  drawCrossing,
  drawCallin,
  drawTrts,
  drawRequest,
} from "./js/track";
import { drawPlatform, drawLabel, drawLogo } from "./js/extras";

import blackUrl from "./img/black.png";
import blueUrl from "./img/blue.png";
import greenUrl from "./img/green.png";
import greyUrl from "./img/grey.png";
import logoUrl from "./img/logo.png";
import orangeUrl from "./img/orange.png";
import redUrl from "./img/red.png";
import whiteUrl from "./img/white.png";

var img;

img = new Image();
img.src = blackUrl;
img.style.display = "none";
document.getElementById("body").appendChild(img);

img = new Image();
img.src = blueUrl;
img.style.display = "none";
document.getElementById("body").appendChild(img);

img = new Image();
img.src = greenUrl;
img.style.display = "none";
document.getElementById("body").appendChild(img);

img = new Image();
img.src = greyUrl;
img.style.display = "none";
document.getElementById("body").appendChild(img);

img = new Image();
img.src = logoUrl;
img.style.display = "none";
document.getElementById("body").appendChild(img);

img = new Image();
img.src = orangeUrl;
img.style.display = "none";
document.getElementById("body").appendChild(img);

img = new Image();
img.src = redUrl;
img.style.display = "none";
document.getElementById("body").appendChild(img);

img = new Image();
img.src = whiteUrl;
img.style.display = "none";
document.getElementById("body").appendChild(img);

const VERSION = "2.0.0a";

var websock = new WebSocketConnector();

function drawExtras() {
  if (!configLoaded) return;
  if (rawConfig.sections === undefined) return;
  rawConfig.sections.forEach((thisElement) => {
    drawSectionExtras(thisElement);
  });
  rawConfig.points.forEach((thisElement) => {
    drawPointExtras(thisElement);
  });
  rawConfig.platforms.forEach((thisElement) => {
    drawPlatform(thisElement);
  });
  rawConfig.labels.forEach((thisElement) => {
    drawLabel(thisElement);
  });
  rawConfig.crossings.forEach((thisElement) => {
    drawCrossing(thisElement, null);
  });
  drawLogo();
  rawConfig.signals.forEach((thisElement) => {
    if (thisElement.diagram !== undefined) {
      if (thisElement.diagram.callin) {
        drawCallin(thisElement.name, { ars: false });
      }
      if (thisElement.diagram.trts) {
        drawTrts(thisElement.name, false);
      }
      if (thisElement.diagram.request) {
        drawRequest(thisElement.name, "notrequested");
      }
    }
  });
}

function sectionLabels() {
  if (!configLoaded) return;
  drawSectionLabels(rawConfig.sections);
}

function onLoad() {
  console.log("ModernMimic v" + VERSION);
  websock.connect();
  setTimeout(drawExtras, 100);
  setInterval(sectionLabels, 100);
  // onResize();
}

function onKeyDown(event) {
  if (event.altKey) {
    if (event.keyCode == 84 || event.keyCode == 116) {
      var sectionLabels = !settings.get("SectionLabels");
      settings.set("SectionLabels", sectionLabels);
      onSettingsChange("SectionLabels", sectionLabels);
    }
    if (event.keyCode == 83 || event.keyCode == 115) {
      var signalLabels = !settings.get("SignalLabels");
      settings.set("SignalLabels", signalLabels);
      onSettingsChange("SignalLabels", signalLabels);
    }
    if (event.keyCode == 80 || event.keyCode == 112) {
      var pointLabels = !settings.get("PointLabels");
      settings.set("PointLabels", pointLabels);
      onSettingsChange("PointLabels", pointLabels);
    }
  }
}

window.addEventListener("load", () => onLoad());
window.addEventListener("keydown", (event) => onKeyDown(event), true);
onLoad();
function drawClock() {
  let currentDate = new Date();
  let time =
    String(currentDate.getHours()).padStart(2, "0") +
    ":" +
    String(currentDate.getMinutes()).padStart(2, "0") +
    ":" +
    String(currentDate.getSeconds()).padStart(2, "0");
  blankText(1680, 120, "33:33:33 ", 40, "left", "verdana-bold");
  text(1680, 120, time, 40, "#FFFFFF", "left", "verdana-bold");
}
setInterval(drawClock, 100);

function onSettingsChange() {}
// function onSettingsChange(settingName, value) {
//   switch (settingName) {
//     case "SignalLabels":
//       value == 1 ? signals.showLabels() : signals.hideLabels()
//       signals.redraw()
//       break
//     case "PointLabels":
//       value == 1 ? points.showLabels() : points.hideLabels()
//       points.redraw()
//       break
//     case "SectionLabels":
//       value == 1 ? sections.showLabels() : sections.hideLabels();
//       sections.redraw();
//       break;
//   }
// }
settings.registerCallback(onSettingsChange);
// settings.get('SignalLabels') == 1 ? signals.showLabels() : signals.hideLabels()
// settings.get('PointLabels') == 1 ? points.showLabels() : points.hideLabels()
// settings.get("SectionLabels") == 1
//   ? sections.showLabels()
//   : sections.hideLabels();
document.getElementById("mimic").addEventListener("dblclick", () => {
  settings.show();
});
