// @ts-check

import { sectionColour } from "../helpers";
import { SectionState } from "../enums";
import { beginPath, moveTo, lineTo, closePath, fill, stroke } from "../draw";
import { trackHeight } from "../config";

export function trackHorizontal(x, y, length, state = SectionState.Unoccupied) {
  _drawHorizontalTrack(x, y, length, SectionState.Blank);
  _drawHorizontalTrack(x, y, length, state);
}

function _drawHorizontalTrack(x, y, length, state) {
  beginPath();
  moveTo(x, y);
  lineTo(x + length, y);
  lineTo(x + length, y + trackHeight);
  lineTo(x, y + trackHeight);
  closePath();
  fill(sectionColour(state));
}

export function trackDiagonal(
  x,
  y,
  length,
  height,
  state = SectionState.Unoccupied,
  toporbottom
) {
  _drawDiagonalTrack(x, y, length, height, SectionState.Blank, toporbottom);
  _drawDiagonalTrack(x, y, length, height, state, toporbottom);
}

function _drawDiagonalTrack(x, y, length, height, state, toporbottom) {
  var localx = 0;
  var localy = trackHeight;
  if (toporbottom == "horizontal") {
    localx = length * (trackHeight / height);
    localy = 0;
  }
  beginPath();
  moveTo(x, y);
  lineTo(x + length, y + height);
  lineTo(x + length - localx, y + height + localy);
  lineTo(x, y + trackHeight);
  closePath();
  fill(sectionColour(state));
}

export function trackHorizontalUnmonitored(x, y, length) {
  _drawHorizontalTrackUnmonitored(x, y, length);
  _drawHorizontalTrackUnmonitored(x, y, length);
}

function _drawHorizontalTrackUnmonitored(x, y, length) {
  beginPath();
  moveTo(x, y + 1);
  lineTo(x + length, y + 1);
  closePath();
  stroke(sectionColour("unoccupied"), 1);
  beginPath();
  moveTo(x, y + 6);
  lineTo(x + length, y + 6);
  closePath();
  stroke(sectionColour("unoccupied"), 1);
}
