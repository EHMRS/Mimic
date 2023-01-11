export { Station };
import { beginPath, closePath, fill, moveTo, lineTo, text } from "./draw";
// const draw = require('./js');

class Station {
  draw() {
    this._drawPlatform1();
    this._drawPlatform2();
  }

  _drawPlatform1() {
    let x = 760;
    let y = 840;
    // Platform 1
    beginPath();
    moveTo(x, y);
    lineTo(x + 160, y);
    lineTo(x + 160, y + 22);
    lineTo(x + 210, y + 22);
    lineTo(x + 210, y);
    lineTo(x + 370, y);
    lineTo(x + 370, y + 22);
    lineTo(x, y + 22);
    closePath();

    fill("#ff7f00");

    text(x + 5, y + 17, "1a", 12);
    text(x + 215, y + 17, "1b", 12);
  }

  _drawPlatform2() {
    var x = 875;
    var y = 710;
    // Platform 2
    beginPath();
    moveTo(x, y);
    lineTo(x + 250, y);
    lineTo(x + 250, y + 22);
    lineTo(x, y + 22);
    closePath();

    fill("#ff7f00");

    text(x + 5, y + 17, "2", 12);
  }
}
