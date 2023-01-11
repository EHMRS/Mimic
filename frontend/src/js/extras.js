import { config } from "./config";
import { sectionWidth, yHeight, yOffset, xOffset, trackHeight } from "./config";
import {
  beginPath,
  closePath,
  fill,
  moveTo,
  lineTo,
  signallingText,
  ctx,
} from "./draw";
import logoUrl from "../img/logo.png";

export function drawLabel(label) {
  let colour = "grey";
  if (
    label.colour == "grey" ||
    label.colour == "black" ||
    label.colour == "green" ||
    label.colour == "blue" ||
    label.colour == "red" ||
    label.colour == "white"
  ) {
    colour = label.colour;
  }

  signallingText(
    label.x * sectionWidth + xOffset,
    label.y * yHeight + yOffset,
    label.text,
    colour,
    "left",
    label.capitalise
  );
}

export function drawPlatform(platform) {
  var section = config.sections[platform.section];
  var xLocalOffset;
  var yLocalOffset;
  if (platform.position == "above") {
    xLocalOffset = 6;
    yLocalOffset = -(trackHeight + 12);
  } else {
    xLocalOffset = 20;
    yLocalOffset = 12;
  }
  _drawPlatform(
    section.diagram.x * sectionWidth + xOffset + xLocalOffset,
    section.diagram.y * yHeight + yOffset + yLocalOffset,
    section.diagram.width * sectionWidth - 30,
    12,
    platform.name
  );
}

function _drawPlatform(x, y, width, height, name) {
  beginPath();
  moveTo(x, y);
  lineTo(x + width, y);
  lineTo(x + width, y + height);
  lineTo(x, y + height);
  closePath();
  fill("#ff7f00");

  signallingText(x + 10, y, "P" + String(name), "black", "left");
}

export function drawLogo() {
  var img = new Image();
  img.src = logoUrl;
  ctx.drawImage(img, 800, 50, 100, 100);
}
