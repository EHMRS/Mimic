import {
  beginPath,
  closePath,
  fill,
  stroke,
  moveTo,
  lineTo,
  arc,
  text,
  blankText,
} from "./draw";

export class Crossings {
  constructor() {
    this._open = false;
  }
  crossing(crossing, open) {
    if (crossing == "site") this.drawSiteLevelCrossing(open);
  }
  redraw() {
    this.drawSiteLevelCrossing(this._open);
  }
  drawSiteLevelCrossing(open = false) {
    // OP Left
    var x = 1560;
    var y = 505;
    beginPath();
    moveTo(x, y);
    lineTo(x + 26, y);
    lineTo(x + 26, y + 26);
    lineTo(x, y + 26);
    closePath();
    fill("#ff7f00");

    // Center
    beginPath();
    moveTo(x + 55, y);
    lineTo(x + 141, y);
    lineTo(x + 141, y + 26);
    lineTo(x + 55, y + 26);
    closePath();
    fill("#ff7f00");

    // DE Right
    beginPath();
    moveTo(x + 170, y);
    lineTo(x + 196, y);
    lineTo(x + 196, y + 26);
    lineTo(x + 170, y + 26);
    closePath();
    fill("#ff7f00");

    y = y - 40;
    // Label
    beginPath();
    moveTo(x + 210, y);
    lineTo(x + 320, y);
    lineTo(x + 320, y + 106);
    lineTo(x + 210, y + 106);
    lineTo(x + 210, y);
    closePath();
    stroke("#00C000", 2);
    blankText(x + 265, y + 18, "Center", 14, "center");
    text(x + 265, y + 18, "Center", 14, "#00C000", "center");
    blankText(x + 265, y + 36, "Crossing", 14, "center");
    text(x + 265, y + 36, "Crossing", 14, "#00C000", "center");

    blankText(x + 230, y + 62, "Open", 12, "left");
    text(x + 230, y + 62, "Open", 12, "#00C000", "left");
    beginPath();
    arc(x + 300, y + 57, 6, 0, 2 * Math.PI);
    closePath();
    stroke("#00C000", 2);
    if (open) {
      fill("#00C000");
    } else {
      fill("#000000");
    }

    blankText(x + 230, y + 88, "Closed", 12, "left");
    text(x + 230, y + 88, "Closed", 12, "#00C000", "left");
    beginPath();
    arc(x + 300, y + 83, 6, 0, 2 * Math.PI);
    closePath();
    stroke("#00C000", 2);
    if (!open) {
      fill("#00C000");
    } else {
      fill("#000000");
    }
  }
}
