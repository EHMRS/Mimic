//@ts-check
import { SectionState } from "../enums";
import {
  beginPath,
  moveTo,
  lineTo,
  closePath,
  fill,
  text,
  blankText,
} from "../draw";
import { trackHorizontal } from "./drawTrack";
// const track = require('./js');

export function LHPoint(
  name = "",
  x,
  y,
  drawName = false,
  leftward = true,
  normal = true,
  state = SectionState.Unoccupied
) {
  var xmult;
  var ymult;
  var down;
  var xlatey;
  var xlatex;
  var reversex, reversey;
  if (leftward) {
    blankText(x - 30, y - 10, name, 12, "center");
    if (drawName) {
      text(x - 30, y - 10, name, 12, "#999999", "center");
    }
    xmult = 1;
    ymult = 1;
    x = x - 60;
    xlatex = 60;
    down = false;
    reversex = x;
    reversey = y + 30;
    xlatey = -30;
  } else {
    blankText(x + 30, y + 25, name, 12, "center");
    if (drawName) {
      text(x + 30, y + 25, name, 12, "#999999", "center");
    }
    xmult = -1;
    ymult = -1;
    down = false;
    xlatey = 2;
    reversex = x;
    reversey = y;
  }
  if (normal) {
    _PointReverse(
      reversex,
      reversey,
      xmult,
      ymult,
      down,
      SectionState.Unoccupied,
      xlatex,
      xlatey
    );
    _PointNormal(x, y, xmult, ymult, state, xlatex);
  } else {
    _PointNormal(x, y, xmult, ymult, SectionState.Unoccupied, xlatex);
    _PointReverse(
      reversex,
      reversey,
      xmult,
      ymult,
      down,
      state,
      xlatex,
      xlatey
    );
  }
}

export function RHPoint(
  name = "",
  x,
  y,
  drawName = false,
  leftward = true,
  normal = true,
  state = SectionState.Unoccupied
) {
  var xmult;
  var ymult;
  var down;
  var xlatex = 0;
  var xlatey = 0;

  var normalx, normaly;

  var size = 12;

  if (leftward) {
    blankText(x - 30, y + 25, name, size, "center");
    if (drawName) {
      text(x - 30, y + 25, name, size, "#999999", "center");
    }
    xmult = 1;
    ymult = -1;
    down = true;
    x = x - 60;
    // x = x + 20;
    y = y - 30;
    normalx = x;
    normaly = y + 30;
    xlatex = 60;
    xlatey = 32;
  } else {
    blankText(x + 30, y - 10, name, size, "center");
    if (drawName) {
      text(x + 30, y - 10, name, size, "#999999", "center");
    }
    xmult = -1;
    ymult = 1;
    down = true;
    normalx = x;
    normaly = y;
  }

  if (normal) {
    _PointReverse(x, y, xmult, ymult, down, SectionState.Blank, xlatex, xlatey);
    _PointNormal(normalx, normaly, xmult, ymult, SectionState.Blank, xlatex);
    _PointReverse(
      x,
      y,
      xmult,
      ymult,
      down,
      SectionState.Unoccupied,
      xlatex,
      xlatey
    );
    _PointNormal(normalx, normaly, xmult, ymult, state, xlatex);
  } else {
    _PointNormal(normalx, normaly, xmult, ymult, SectionState.Blank, xlatex);
    _PointReverse(x, y, xmult, ymult, down, SectionState.Blank, xlatex, xlatey);
    _PointNormal(
      normalx,
      normaly,
      xmult,
      ymult,
      SectionState.Unoccupied,
      xlatex
    );
    _PointReverse(x, y, xmult, ymult, down, state, xlatex, xlatey);
  }
}

export function LHPointOutline(x, y, leftward = true) {
  var down;
  var reversey = y;
  if (leftward) {
    x = x - 60;
    down = false;
    reversey = y + 30;
  } else {
    down = false;
  }
  trackHorizontalOutline(x, y, 60, false, false);
  track22Outline(x, reversey, 60, false, false, down);
  if (leftward) {
    beginPath();
    moveTo(x + 60, y - 3);
    lineTo(x + 45, y - 3);
    lineTo(x + 45, y + 5);
    lineTo(x + 56, y + 5);
    closePath();
    fill("#000000");
  } else {
    beginPath();
    moveTo(x + 4, y - 5);
    lineTo(x + 15, y - 5);
    lineTo(x + 15, y + 3);
    lineTo(x, y + 3);
    closePath();
    fill("#000000");
  }
}

export function RHPointOutline(x, y, leftward = true) {
  var down;
  var normaly = y;
  if (leftward) {
    down = true;
    x = x - 60;
    y = y - 30;
  } else {
    down = true;
  }
  trackHorizontalOutline(x, normaly, 60, false, false);
  track22Outline(x, y, 60, false, false, down);

  if (leftward) {
    beginPath();
    moveTo(x + 56, y + 25);
    lineTo(x + 45, y + 25);
    lineTo(x + 45, y + 33);
    lineTo(x + 60, y + 33);
    closePath();
    fill("#000000");
  } else {
    beginPath();
    moveTo(x, y - 3);
    lineTo(x + 15, y - 3);
    lineTo(x + 15, y + 5);
    lineTo(x + 4, y + 5);
    closePath();
    fill("#000000");
  }
}

function _PointNormal(x, y, xmult, ymult, state, xlatex = 0) {
  trackHorizontal(x, y, 60, state, true, true);

  // Block off reverse
  beginPath();
  moveTo(x - xmult * 58 + xlatex, y + ymult * 5);
  lineTo(x - xmult * 2 + xlatex, y + ymult * 5);
  lineTo(x - xmult * 2 + xlatex, y + ymult * 11);
  lineTo(x - xmult * 58 + xlatex, y + ymult * 11);
  closePath();
  fill("#000000");
}

function _PointReverse(
  x,
  y,
  xmult,
  ymult,
  down,
  state,
  xlatex = 0,
  xlatey = 0
) {
  track22(x, y, 60, state, true, true, down);

  // Block off normal
  beginPath();
  moveTo(x - xmult * 2 + xlatex, y - ymult * 12 + xlatey); // Top right
  lineTo(x - xmult * 46 + xlatex, y + ymult * 12 + xlatey); // Top left
  lineTo(x - xmult * 46 + xlatex, y + ymult * 19 + xlatey); // Bottom left
  lineTo(x - xmult * 2 + xlatex, y - ymult * 4 + xlatey); // Bottom right
  closePath();
  fill("#000000");
}
