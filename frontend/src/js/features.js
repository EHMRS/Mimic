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

export function redraw() {
  drawTunnel();
  drawBridge();
  drawSignalBox();
}

export function drawTunnel() {
  let x = 1250;
  let y = 210;

  // Left end
  beginPath();
  moveTo(x, y);
  lineTo(x + 5, y);
  lineTo(x + 5, y + 10);
  lineTo(x + 5, y);
  closePath();
  stroke("#666666", 3);

  beginPath();
  moveTo(x, y + 50);
  lineTo(x + 5, y + 50);
  lineTo(x + 5, y + 40);
  lineTo(x + 5, y + 50);
  closePath();
  stroke("#666666", 3);

  // Right end
  beginPath();
  moveTo(x + 150, y);
  lineTo(x + 145, y);
  lineTo(x + 145, y + 10);
  lineTo(x + 145, y);
  closePath();
  stroke("#666666", 3);

  beginPath();
  moveTo(x + 150, y + 50);
  lineTo(x + 145, y + 50);
  lineTo(x + 145, y + 40);
  lineTo(x + 145, y + 50);
  closePath();
  stroke("#666666", 3);

  // Top
  beginPath();
  moveTo(x + 25, y);
  lineTo(x + 45, y);
  stroke("#666666", 3);

  beginPath();
  moveTo(x + 65, y);
  lineTo(x + 85, y);
  stroke("#666666", 3);

  beginPath();
  moveTo(x + 105, y);
  lineTo(x + 125, y);
  stroke("#666666", 3);

  // Bottom
  beginPath();
  moveTo(x + 25, y + 50);
  lineTo(x + 45, y + 50);
  stroke("#666666", 3);

  beginPath();
  moveTo(x + 65, y + 50);
  lineTo(x + 85, y + 50);
  stroke("#666666", 3);

  beginPath();
  moveTo(x + 105, y + 50);
  lineTo(x + 125, y + 50);
  stroke("#666666", 3);

  blankText(x + 75, y + 100, "Amwell Rise Tunnel", 20, "center");
  text(x + 75, y + 100, "Amwell Rise Tunnel", 20, "#666666", "center");
}

export function drawBridge() {
  let x = 550;
  let y = 326;

  // Top side
  beginPath();
  moveTo(x - 20, y - 15);
  lineTo(x, y);
  lineTo(x + 80, y);
  lineTo(x + 100, y - 15);
  lineTo(x + 80, y);
  lineTo(x, y);
  closePath();
  stroke();
  beginPath();

  // Bottom Side
  beginPath();
  moveTo(x - 20, y + 55);
  lineTo(x, y + 40);
  lineTo(x + 80, y + 40);
  lineTo(x + 100, y + 55);
  lineTo(x + 80, y + 40);
  lineTo(x, y + 40);
  closePath();
  stroke();
  beginPath();

  blankText(x + 50, y - 40, "Amwell Bridge", 20, "center");
  text(x + 50, y - 40, "Amwell Bridge", 20, "#666666", "center");
}

export function drawSignalBox() {
  let x = 462;
  let y = 600;

  beginPath();
  moveTo(x, y);
  lineTo(x, y + 10);
  lineTo(x, y);
  lineTo(x + 100, y);
  lineTo(x + 100, y + 10);
  lineTo(x + 100, y);
  closePath();
  stroke("#666666", 4);

  beginPath();
  moveTo(x, y + 15);
  lineTo(x, y + 35);
  closePath();
  stroke("#666666", 4);

  beginPath();
  moveTo(x, y + 40);
  lineTo(x, y + 60);
  closePath();
  stroke("#666666", 4);

  beginPath();
  moveTo(x + 100, y + 15);
  lineTo(x + 100, y + 35);
  closePath();
  stroke("#666666", 4);

  beginPath();
  moveTo(x + 100, y + 40);
  lineTo(x + 100, y + 60);
  closePath();
  stroke("#666666", 4);

  beginPath();
  moveTo(x, y + 75);
  lineTo(x, y + 65);
  lineTo(x, y + 75);
  lineTo(x + 100, y + 75);
  lineTo(x + 100, y + 65);
  lineTo(x + 100, y + 75);
  closePath();
  stroke("#666666", 4);

  beginPath();
  moveTo(x + 50, y + 50);
  arc(x + 50, y + 50, 7, 0, 2 * Math.PI);
  closePath();
  fill("#666666");

  beginPath();
  moveTo(x + 25, y + 22);
  lineTo(x + 25, y + 28);
  lineTo(x + 75, y + 28);
  lineTo(x + 75, y + 22);
  closePath();
  fill("#666666");
}
