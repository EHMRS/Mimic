//@ts-check

import { beginPath, closePath, fill, moveTo, lineTo, arc } from "../draw";
import { signalColour, shuntColour } from "../helpers";

export function signalHorizontalTrack(
  x,
  y,
  state,
  leftward,
  shunt,
  signal,
  spad
) {
  if (leftward) {
    y = y + 5;
  } else {
    y = y - 5;
  }
  _signalPostHorizontalTrack(x, y, leftward, spad);
  _signalHeadHorizontalTrack(x, y, state, leftward, shunt, signal);
}

function _signalPostHorizontalTrack(startx, starty, leftward, spad) {
  var xmult;
  var ymult;
  if (leftward) {
    ymult = 1;
    xmult = 1;
  } else {
    ymult = -1;
    xmult = -1;
  }
  var x = startx;
  var y = starty;
  beginPath();
  moveTo(x, y);
  y = y + ymult * 7;
  lineTo(x, y);
  x = x - xmult * 4;
  lineTo(x, y);
  y = y + ymult * 2;
  lineTo(x, y);
  x = x - xmult * 1;
  lineTo(x, y);
  y = y - ymult * 6;
  lineTo(x, y);
  x = x + xmult * 1;
  lineTo(x, y);
  y = y + ymult * 2;
  lineTo(x, y);
  x = x + xmult * 2;
  lineTo(x, y);
  y = y - ymult * 6;
  lineTo(x, y);
  closePath();
  fill("#000000");
  if (spad) {
    fill("#6600CC");
  } else {
    fill("#666666");
  }
}
function _signalHeadHorizontalTrack(
  startx,
  starty,
  state,
  leftward,
  shunt,
  signal
) {
  if (shunt) {
    _signalShuntHeadHorizontalTrack(startx, starty, state, leftward, signal);
  }
  if (signal) {
    _signalSignalHeadHorizontalTrack(startx, starty, state, leftward, shunt);
  }
}
function _signalShuntHeadHorizontalTrack(
  startx,
  starty,
  state,
  leftward,
  signal
) {
  var angle1;
  var angle2;
  var xmult;
  var ymult;
  if (leftward) {
    ymult = 1;
    xmult = 1;
    angle1 = Math.PI;
    angle2 = Math.PI / 2;
  } else {
    ymult = -1;
    xmult = -1;
    angle1 = 0;
    angle2 = Math.PI + Math.PI / 2;
  }
  var x = startx - xmult * 4;
  var y = starty + ymult * 3;
  beginPath();
  moveTo(x, y);
  arc(x, y, 6, angle1, angle2, true);
  lineTo(x, y);
  closePath();
  fill("#000000");
  fill(shuntColour(state, signal));
}
function _signalSignalHeadHorizontalTrack(
  startx,
  starty,
  state,
  leftward,
  shunt
) {
  var xmult;
  var ymult;
  var x, y;
  if (leftward) {
    ymult = 1;
    xmult = 1;
  } else {
    ymult = -1;
    xmult = -1;
  }
  if (shunt) {
    x = startx - xmult * 14;
  } else {
    x = startx - xmult * 10;
  }
  y = starty + ymult * 6;
  beginPath();
  moveTo(x, y);
  arc(x, y, 4, 0, 2 * Math.PI);
  lineTo(x, y);
  closePath();
  fill("#000000");
  fill(signalColour(state));
}
