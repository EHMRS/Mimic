var c = document.getElementById("mimic");
export var ctx = c.getContext("2d");

import blackUrl from "../img/black.png";
import blueUrl from "../img/blue.png";
import greenUrl from "../img/green.png";
import greyUrl from "../img/grey.png";
import orangeUrl from "../img/orange.png";
import redUrl from "../img/red.png";
import whiteUrl from "../img/white.png";

var images = {
  black: blackUrl,
  blue: blueUrl,
  green: greenUrl,
  grey: greyUrl,
  orange: orangeUrl,
  red: redUrl,
  white: whiteUrl,
};

// var textc = document.createElement("canvas");
// var textctx = textc.getContext("2d");

export function beginPath() {
  ctx.beginPath();
}

export function closePath() {
  ctx.closePath();
}
export function fill(colour = "#666666") {
  ctx.fillStyle = colour;
  ctx.fill();
}
export function stroke(colour = "#666666", lineWidth = 2) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

export function dash(colour = "#666666", lineWidth = 2) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([15, 15]);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function moveTo(x, y) {
  ctx.moveTo(scale(x), scale(y));
}
export function lineTo(x, y) {
  ctx.lineTo(scale(x), scale(y));
}
export function arc(x, y, radius, angle1, angle2, counterclockwise) {
  ctx.arc(scale(x), scale(y), scale(radius), angle1, angle2, counterclockwise);
}

export function text(
  x,
  y,
  text,
  size = 50,
  colour = "#000000",
  position = "left",
  font = "signalling"
) {
  text = text.toUpperCase();
  ctx.fillStyle = colour;
  ctx.font = scale(size) + "px " + font;
  ctx.textAlign = position;
  ctx.fillText(text, scale(x), scale(y));
}

export function blankSignallingText(x, y, text, align = "left") {
  signallingText(x, y, text, "black", align);
}

export function signallingText(
  x,
  y,
  text,
  colour,
  align = "left",
  capitalise = true
) {
  if (capitalise) text = text.toUpperCase();
  x -= 4;
  if (align == "right") {
    x = x - 8 * text.length;
  }
  if (align == "center") {
    x = Math.floor(x - (8 * text.length) / 2) + 4;
  }
  for (var i = 0; i < text.length; i++) {
    drawCharacter(text[i], x + i * 8, y, colour);
  }
}

function drawCharacter(char, x, y, colour) {
  var code = char.charCodeAt(0);
  var img = new Image();
  img.src = images[colour];
  ctx.drawImage(img, 8 * code, 0, 8, 12, x, y, 8, 12);
}

export function blankText(
  x,
  y,
  text,
  size,
  align = "left",
  font = "signalling"
) {
  text = text.toUpperCase();
  ctx.font = size + "px " + font;
  ctx.textAlign = align;
  var width = ctx.measureText(text).width;
  var height = size;
  var newx;
  if (align == "left") {
    newx = x;
  } else if (align == "right") {
    newx = x - width;
  } else if (align == "center") {
    newx = x - Math.ceil(width / 2);
  } else {
    return;
  }
  ctx.fillStyle = "#000000";
  ctx.fillRect(
    scale(newx - 4),
    scale(y - (size + size * 0.16)),
    scale(width + 8),
    scale(height + size * 0.33)
  );
}

function scale(value) {
  return value;
}
