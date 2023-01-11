import { sectionWidth, yHeight, yOffset, xOffset } from "./config";
import {
  trackHorizontal,
  trackDiagonal,
  trackHorizontalUnmonitored,
} from "./vectorart/drawTrack";
import { signalHorizontalTrack } from "./vectorart/drawSignals";
import { PointState } from "./enums";
import { settings } from "./settings";
import { config, trackHeight } from "./config";
import {
  beginPath,
  closePath,
  fill,
  moveTo,
  lineTo,
  blankSignallingText,
  signallingText,
} from "./draw";

var pointStates = {};
var pointSectionStates = {};
var sectionStates = {};
var crossingStates = {};
var signalStates = {};
var signalSpadStates = {};
var callinStates = {};
var trtsStates = {};
var trtsText = {};
var requestStates = {};
var requestInterval = null;
var requestThere = true;
// var pointLabelsThere = false;
var sectionLabelsThere = false;

export function drawSection(section, sectionObject = null) {
  if (section.diagram === undefined) return;
  var currentState;
  var sectionState = sectionObject.state;
  currentState = sectionStates[section.name];
  if (currentState == sectionState && sectionState != null) {
    // No change
    return;
  }
  // We can draw this

  // Blank it out first
  trackHorizontal(
    section.diagram.x * sectionWidth + xOffset,
    section.diagram.y * yHeight + yOffset,
    section.diagram.width * sectionWidth - 2,
    "blank"
  );

  // Now draw it
  trackHorizontal(
    section.diagram.x * sectionWidth + xOffset,
    section.diagram.y * yHeight + yOffset,
    section.diagram.width * sectionWidth - 2,
    sectionState === null ? currentState : sectionState
  );
  if (sectionObject.headcode) {
    console.log("Headcode found: " + sectionObject.headcode);
    drawHeadcode(section, sectionObject.headcode);
  }
  sectionStates[section.name] = sectionState;
}

function drawHeadcode(section, headcode) {
  // Blank out the headcode space
  beginPath();
  moveTo(
    section.diagram.x * sectionWidth +
      xOffset +
      Math.floor((section.diagram.width * sectionWidth) / 2) -
      20,
    section.diagram.y * yHeight + yOffset
  );
  lineTo(
    section.diagram.x * sectionWidth +
      xOffset +
      Math.floor((section.diagram.width * sectionWidth) / 2) +
      20,
    section.diagram.y * yHeight + yOffset
  );
  lineTo(
    section.diagram.x * sectionWidth +
      xOffset +
      Math.floor((section.diagram.width * sectionWidth) / 2) +
      20,
    section.diagram.y * yHeight + yOffset + trackHeight
  );
  lineTo(
    section.diagram.x * sectionWidth +
      xOffset +
      Math.floor((section.diagram.width * sectionWidth) / 2) -
      20,
    section.diagram.y * yHeight + yOffset + trackHeight
  );
  closePath();
  fill("#000000");
  console.log(
    section.diagram.x * sectionWidth +
      xOffset +
      (section.diagram.width * sectionWidth) / 2 -
      12
  );
  signallingText(
    section.diagram.x * sectionWidth +
      xOffset +
      Math.floor((section.diagram.width * sectionWidth) / 2),
    section.diagram.y * yHeight + yOffset - 2,
    headcode,
    "green",
    "center"
  );
}

export function drawSectionLabels(sections, force = false) {
  var t = true;
  if (t) return;
  if (settings.get("SectionLabels")) {
    if (!sectionLabelsThere || force) {
      sections.forEach((section) => {
        if (section.diagram === undefined) return;
        signallingText(
          section.diagram.x * sectionWidth +
            xOffset +
            (section.diagram.width / 2) * sectionWidth,
          section.diagram.y * yHeight + yOffset - 13,
          section.name,
          "grey",
          "center"
        );
      });
      sectionLabelsThere = true;
    }
  } else {
    sections.forEach((section) => {
      if (section.diagram === undefined) return;
      blankSignallingText(
        section.diagram.x * sectionWidth +
          xOffset +
          (section.diagram.width / 2) * sectionWidth,
        section.diagram.y * yHeight + yOffset - 13,
        section.name,
        "center"
      );
    });
    sectionLabelsThere = false;
  }
}

export function drawSectionExtras(section) {
  if (section.diagram === undefined) return;
  const yOffsetLocal = -3;
  const unmonitoredLength = 1;
  if (section.diagram.label_left) {
    trackHorizontalUnmonitored(
      section.diagram.x * sectionWidth +
        xOffset -
        unmonitoredLength * sectionWidth,
      section.diagram.y * yHeight + yOffset,
      unmonitoredLength * sectionWidth - 2
    );
    signallingText(
      section.diagram.x * sectionWidth +
        xOffset -
        unmonitoredLength * sectionWidth -
        5,
      section.diagram.y * yHeight + yOffset + yOffsetLocal,
      section.diagram.label_left + " " + String.fromCharCode(140),
      "grey",
      "right"
    );
  }
  if (section.diagram.label_right) {
    trackHorizontalUnmonitored(
      section.diagram.x * sectionWidth +
        xOffset +
        section.diagram.width * sectionWidth,
      section.diagram.y * yHeight + yOffset,
      unmonitoredLength * sectionWidth - 2
    );
    signallingText(
      section.diagram.x * sectionWidth +
        xOffset +
        section.diagram.width * sectionWidth +
        unmonitoredLength * sectionWidth +
        10,
      section.diagram.y * yHeight + yOffset + yOffsetLocal,
      String.fromCharCode(141) + " " + section.diagram.label_right,
      "grey",
      "left"
    );
  }
  if (section.diagram.continuation_left) {
    continuationText(
      section.diagram.x * sectionWidth + xOffset,
      section.diagram.y * yHeight + yOffset - 3,
      section.diagram.continuation_left,
      "left",
      section.diagram.arrow_override
    );
  }
  if (section.diagram.continuation_right) {
    continuationText(
      section.diagram.x * sectionWidth +
        xOffset +
        section.diagram.width * sectionWidth +
        5,
      section.diagram.y * yHeight + yOffset - 3,
      section.diagram.continuation_right,
      "right",
      section.diagram.arrow_override
    );
  }
}

export function drawPoint(point, pointState = null, pointSectionState = null) {
  if (point.diagram === undefined) return;
  var currentState;
  var currentSectionState;
  currentState = pointStates[point.name];
  currentSectionState = pointSectionStates[point.name];
  if (
    currentState == pointState &&
    pointState != null &&
    currentSectionState == pointSectionState &&
    pointSectionState != null
  ) {
    // No change
    return;
  }
  // We can draw this

  var diagonalHeight;
  var yLocalOffset = 0;
  var xLocalOffset = 0;
  var xLocalMultiplier = 1;
  var yLocalMultiplier = 1;
  var xLocalBlank = 0;
  var yLocalBlank = 0;

  if (point.diagram.horizontal == "left" && point.diagram.vertical == "up") {
    xLocalOffset = sectionWidth;
    xLocalMultiplier = -1;
    diagonalHeight = yHeight;
    yLocalOffset = 0;
    yLocalMultiplier = -1;
  } else if (
    point.diagram.horizontal == "right" &&
    point.diagram.vertical == "up"
  ) {
    xLocalOffset = 2;
    xLocalMultiplier = 1;
    diagonalHeight = -yHeight;
    yLocalOffset = 0;
    yLocalMultiplier = 1;
  } else if (
    point.diagram.horizontal == "left" &&
    point.diagram.vertical == "down"
  ) {
    xLocalOffset = sectionWidth;
    xLocalMultiplier = -1;
    diagonalHeight = -yHeight;
    yLocalOffset = 0;
    yLocalMultiplier = -1;
    yLocalBlank = trackHeight;
    xLocalBlank = -8;
  } else {
    xLocalOffset = 2;
    xLocalMultiplier = 1;
    diagonalHeight = -yHeight;
    yLocalOffset = 0;
    yLocalMultiplier = -1;
    yLocalBlank = trackHeight;
    xLocalBlank = 8;
  }

  if (point.diagram.yScale !== undefined) {
    diagonalHeight *= point.diagram.yScale;
  }

  // Blank out the whole lot
  trackHorizontal(
    point.diagram.x * sectionWidth + xOffset,
    point.diagram.y * yHeight + yOffset,
    sectionWidth - 2,
    "blank"
  );
  trackDiagonal(
    point.diagram.x * sectionWidth + xOffset + xLocalOffset - 2,
    point.diagram.y * yHeight + yOffset + yLocalOffset,
    (sectionWidth - 2) * xLocalMultiplier,
    diagonalHeight * yLocalMultiplier,
    "blank"
  );
  // Now draw the diagonal
  trackDiagonal(
    point.diagram.x * sectionWidth + xOffset + xLocalOffset - 2,
    point.diagram.y * yHeight + yOffset + yLocalOffset,
    (sectionWidth - 2) * xLocalMultiplier,
    diagonalHeight * yLocalMultiplier,
    "unoccupied"
  );
  // And the horizontal
  trackHorizontal(
    point.diagram.x * sectionWidth + xOffset,
    point.diagram.y * yHeight + yOffset,
    sectionWidth - 2,
    "unoccupied"
  );

  if (pointState == PointState.Reverse) {
    trackHorizontal(
      point.diagram.x * sectionWidth + xOffset + xLocalOffset - 2,
      point.diagram.y * yHeight + yOffset,
      ((sectionWidth - 2) * xLocalMultiplier) / 2,
      "blank"
    );
    trackDiagonal(
      point.diagram.x * sectionWidth + xOffset + xLocalOffset - 2,
      point.diagram.y * yHeight + yOffset + yLocalOffset,
      (sectionWidth - 2) * xLocalMultiplier,
      diagonalHeight * yLocalMultiplier,
      pointSectionState === null ? currentState : pointSectionState
    );
  } else {
    trackDiagonal(
      point.diagram.x * sectionWidth + xOffset + xLocalOffset - 2,
      point.diagram.y * yHeight + yOffset + yLocalOffset,
      ((sectionWidth - 2) * xLocalMultiplier) / 8 + xLocalBlank,
      (diagonalHeight * yLocalMultiplier) / 8 + yLocalBlank,
      "blank",
      "horizontal"
    );
    trackHorizontal(
      point.diagram.x * sectionWidth + xOffset,
      point.diagram.y * yHeight + yOffset,
      sectionWidth - 2,
      pointSectionState === null ? currentState : pointSectionState
    );
  }
  // Now draw it
  pointSectionStates[point.name] = pointSectionState;
  pointStates[point.name] = pointState;
}

export function drawPointLabels() {
  // This would do it
}

export function drawPointExtras(point) {
  if (point.diagram === undefined) return;
  var yOffsetLocal = -3;
  const unmonitoredLength = 1;
  if (point.diagram.label_left) {
    signallingText(
      point.diagram.x * sectionWidth + xOffset - 10,
      point.diagram.y * yHeight + yOffset + yOffsetLocal,
      point.diagram.label_left + " " + String.fromCharCode(140),
      "grey",
      "right"
    );
  }
  if (point.diagram.label_right) {
    signallingText(
      point.diagram.x * sectionWidth +
        xOffset +
        point.diagram.width * sectionWidth +
        10,
      point.diagram.y * yHeight + yOffset + yOffsetLocal,
      String.fromCharCode(141) + " " + point.diagram.label_right,
      "grey",
      "left"
    );
  }
  if (point.diagram.continuation_left) {
    continuationText(
      point.diagram.x * sectionWidth + xOffset,
      point.diagram.y * yHeight + yOffset - 3,
      point.diagram.continuation_left,
      "left"
    );
  }
  if (point.diagram.continuation_right) {
    continuationText(
      point.diagram.x * sectionWidth +
        xOffset +
        point.diagram.width * sectionWidth +
        5,
      point.diagram.y * yHeight + yOffset - 3,
      point.diagram.continuation_right,
      "right"
    );
  }
  if (point.diagram.continuation_left_top) {
    trackHorizontalUnmonitored(
      point.diagram.x * sectionWidth + xOffset - sectionWidth,
      point.diagram.y * yHeight + yOffset - yHeight,
      unmonitoredLength * sectionWidth - 2
    );
    continuationText(
      point.diagram.x * sectionWidth +
        xOffset -
        unmonitoredLength * sectionWidth,
      point.diagram.y * yHeight + yOffset - 3 - yHeight,
      point.diagram.continuation_left_top,
      "left",
      "top"
    );
  }
  if (point.diagram.continuation_right_top) {
    continuationText(
      point.diagram.x * sectionWidth +
        xOffset +
        sectionWidth +
        5 +
        unmonitoredLength * sectionWidth,
      point.diagram.y * yHeight + yOffset - 3 - yHeight,
      point.diagram.continuation_right_top,
      "right",
      "top"
    );

    trackHorizontalUnmonitored(
      point.diagram.x * sectionWidth + xOffset + sectionWidth,
      point.diagram.y * yHeight + yOffset - yHeight,
      unmonitoredLength * sectionWidth - 2
    );
  }
}

export function drawSignal(signal, signalState = "danger", spad = false) {
  if (signal.diagram === undefined) return;
  var section = config.sections[signal.diagram.section];
  if (section.diagram === undefined) return;

  var currentState;
  var currentSpad;
  currentState = signalStates[signal.name];
  currentSpad = signalSpadStates[signal.name];
  if (
    currentState == signalState &&
    signalState != null &&
    currentSpad == spad &&
    currentSpad != null
  ) {
    // No change
    return;
  }

  var xLocalOffset;
  var yLocalOffset;
  var signalHead;
  var shuntHead;
  var leftward;

  if (signal.type == "limit_of_shunt") {
    signalHead = false;
    shuntHead = true;
    if (signal.diagram.end == "left") {
      xLocalOffset = 15;
      yLocalOffset = 5;
      leftward = true;
      signallingText(
        section.diagram.x * sectionWidth + xOffset + xLocalOffset + 10,
        section.diagram.y * yHeight + yOffset + 11,
        "LOS",
        "grey",
        "left"
      );
    }
    if (signal.diagram.end == "right") {
      xLocalOffset = section.diagram.width * sectionWidth - 20;
      yLocalOffset = 0;
      leftward = false;
      signallingText(
        section.diagram.x * sectionWidth + xOffset + xLocalOffset,
        section.diagram.y * yHeight + yOffset - 18,
        "LOS",
        "grey",
        "right"
      );
    }
  } else {
    shuntHead = signal.shunt || signal.type == "shunt_two";
    signalHead =
      signal.type == "standard_three" || signal.type == "standard_two";
    if (signal.diagram.end == "left") {
      xLocalOffset = 15;
      yLocalOffset = 5;
      leftward = true;
    }
    if (signal.diagram.end == "right") {
      xLocalOffset = section.diagram.width * sectionWidth - 20;
      yLocalOffset = 0;
      leftward = false;
    }
  }
  if (signal.diagram.offset)
    xLocalOffset += signal.diagram.offset * sectionWidth;

  signalHorizontalTrack(
    section.diagram.x * sectionWidth + xOffset + xLocalOffset,
    section.diagram.y * yHeight + yOffset + yLocalOffset,
    signalState,
    leftward,
    shuntHead,
    signalHead,
    spad
  );
  signalStates[signal.name] = signalState;
  signalSpadStates[signal.name] = spad;
}

export function drawCrossing(crossing, state) {
  if (crossing === undefined) return;
  if (crossing.diagram == undefined) return;
  if (crossingStates[crossing.name] == state && state !== null) {
    return;
  }

  var texty;
  if (typeof crossing.diagram.y == "object") {
    if (
      typeof crossing.diagram.y[0] != "number" ||
      typeof crossing.diagram.y[1] != "number"
    )
      return;
    _drawCrossingPart(
      crossing.diagram.x * sectionWidth + xOffset - 10,
      crossing.diagram.y[0] * yHeight + yOffset - 18,
      10,
      15
    );
    _drawCrossingPart(
      crossing.diagram.x * sectionWidth + xOffset - 10,
      crossing.diagram.y[0] * yHeight + yOffset + 12,
      10,
      crossing.diagram.y[1] * yHeight -
        crossing.diagram.y[0] * yHeight -
        trackHeight -
        10
    );
    _drawCrossingPart(
      crossing.diagram.x * sectionWidth + xOffset - 10,
      crossing.diagram.y[1] * yHeight + yOffset + 12,
      10,
      15
    );
    texty = crossing.diagram.y[0];
  } else if (typeof crossing.diagram.y == "number") {
    texty = crossing.diagram.y;
    _drawCrossingPart(
      crossing.diagram.x * sectionWidth + xOffset - 10,
      crossing.diagram.y * yHeight + yOffset - 18,
      10,
      15
    );
    _drawCrossingPart(
      crossing.diagram.x * sectionWidth + xOffset - 10,
      crossing.diagram.y * yHeight + yOffset + 12,
      10,
      15
    );
  } else {
    return;
  }
  signallingText(
    crossing.diagram.x * sectionWidth + xOffset - 5,
    texty * yHeight + yOffset - 75,
    crossing.name,
    "grey",
    "center"
  );
  signallingText(
    crossing.diagram.x * sectionWidth + xOffset - 5,
    texty * yHeight + yOffset - 55,
    "N  ",
    "white",
    "center"
  );
  signallingText(
    crossing.diagram.x * sectionWidth + xOffset - 5,
    texty * yHeight + yOffset - 55,
    "  F",
    "green",
    "center"
  );
  var crossingText;
  crossingText = state ? "pq" : "qp";
  // Blank them out first
  signallingText(
    crossing.diagram.x * sectionWidth + xOffset - 5,
    texty * yHeight + yOffset - 40,
    "q  ",
    "black",
    "center",
    false
  );
  signallingText(
    crossing.diagram.x * sectionWidth + xOffset - 5,
    texty * yHeight + yOffset - 40,
    "  q",
    "black",
    "center",
    false
  );
  signallingText(
    crossing.diagram.x * sectionWidth + xOffset - 5,
    texty * yHeight + yOffset - 40,
    crossingText[0] + "  ",
    "white",
    "center",
    false
  );
  signallingText(
    crossing.diagram.x * sectionWidth + xOffset - 5,
    texty * yHeight + yOffset - 40,
    "  " + crossingText[1],
    "green",
    "center",
    false
  );
  crossingStates[crossing.name] = state;
}

export function drawCallin(callin, value) {
  if (callinStates[callin] == value) return; // No change
  if (config.signals[callin] === undefined) return; // Referenced signal doesn't exist

  var signal = config.signals[callin];
  if (signal.diagram === undefined) return; // Signal doesn't have a diagram setting

  if (!signal.diagram.callin) return; // Signal does not have a callin

  var section = config.sections[signal.diagram.section];
  if (section.diagram === undefined) return; // Signal references an invalid section

  var text;
  if (value.ars == true) {
    text = "qA";
  } else {
    text = "pA";
  }
  var xLocalOffset = 0;
  var yLocalOffset = 0;
  var xLocalTextOffset = 0;
  var yLocalTextOffset = 0;
  var localAlign;
  if (signal.diagram.end == "left") {
    xLocalOffset = 25;
    yLocalOffset = 10;
    localAlign = "left";
    xLocalTextOffset = 0;
    yLocalTextOffset = 15;
  } else if (signal.diagram.end == "right") {
    xLocalOffset = section.diagram.width * sectionWidth - 35;
    yLocalOffset = -18;
    localAlign = "right";
    xLocalTextOffset = -5;
    yLocalTextOffset = -20;
  }
  // Blank out previous state
  signallingText(
    section.diagram.x * sectionWidth + xOffset + xLocalOffset,
    section.diagram.y * yHeight + yOffset + yLocalOffset,
    "qA",
    "black",
    "left",
    false
  );
  signallingText(
    section.diagram.x * sectionWidth + xOffset + xLocalOffset,
    section.diagram.y * yHeight + yOffset + yLocalOffset,
    text,
    "blue",
    "left",
    false
  );
  console.log(callin);
  console.log(value);
  console.log(callinStates[callin]);
  if (value.waiting == true) {
    if (callinStates[callin] !== undefined) {
      signallingText(
        section.diagram.x * sectionWidth +
          xOffset +
          xLocalOffset +
          xLocalTextOffset,
        section.diagram.y * yHeight + yOffset + yLocalOffset + yLocalTextOffset,
        callinStates[callin].value,
        "black",
        localAlign,
        false
      );
    }
    signallingText(
      section.diagram.x * sectionWidth +
        xOffset +
        xLocalOffset +
        xLocalTextOffset,
      section.diagram.y * yHeight + yOffset + yLocalOffset + yLocalTextOffset,
      value.value,
      "blue",
      localAlign,
      false
    );
  } else {
    if (callinStates[callin] !== undefined) {
      signallingText(
        section.diagram.x * sectionWidth +
          xOffset +
          xLocalOffset +
          xLocalTextOffset,
        section.diagram.y * yHeight + yOffset + yLocalOffset + yLocalTextOffset,
        callinStates[callin].value,
        "black",
        localAlign,
        false
      );
    }
  }
  callinStates[callin] = value;
}

export function drawTrts(trts, value) {
  if (requestInterval == null)
    requestInterval = setInterval(requestFlash, 1000);
  if (trtsStates[trts] === value.state) return; // No change

  if (value.state) {
    _drawTrts(trts, "q", "white");
    _drawTrtsText(trts, value.text, "blue");
  } else {
    _drawTrts(trts, "p", "orange");
    _drawTrtsText(trts, trtsText[trts], "black");
  }
  trtsStates[trts] = value.state;
  trtsText[trts] = value.text;
}

export function drawRequest(request, value) {
  if (requestInterval == null)
    requestInterval = setInterval(requestFlash, 1000);
  if (requestStates[request] === value) return; // No change
  if (value == "notrequested") {
    _drawRequest(request, "p", "green");
  } else if (value == "requested") {
    _drawRequest(request, "p", "white");
  } else if (value == "granted") {
    _drawRequest(request, "q", "white");
  }
  requestStates[request] = value;
}

function requestFlash() {
  requestThere = !requestThere;
  Object.keys(trtsStates).forEach((trts) => {
    var state = trtsStates[trts];
    if (state) {
      _drawTrts(trts, "q", requestThere ? "black" : "white");
    }
  });
  Object.keys(requestStates).forEach((request) => {
    var state = requestStates[request];
    if (state == "requested") {
      if (requestThere) {
        _drawRequest(request, "q", "white");
      } else {
        _drawRequest(request, "p", "white");
      }
    }
  });
}

function _drawTrts(trts, character, colour) {
  if (config.signals[trts] === undefined) return; // Referenced signal doesn't exist

  var signal = config.signals[trts];
  if (signal.diagram === undefined) return; // Signal doesn't have a diagram setting

  if (!signal.diagram.trts) return; // Signal does not have trts

  var section = config.sections[signal.diagram.section];
  if (section.diagram === undefined) return; // Signal references an invalid section
  var xLocalOffset = 0;
  var yLocalOffset = 0;
  if (signal.diagram.end == "left") {
    xLocalOffset = 10;
    yLocalOffset = 25;
  } else if (signal.diagram.end == "right") {
    xLocalOffset = section.diagram.width * sectionWidth - 27;
    yLocalOffset = -15;
  }
  // Blank out previous state
  signallingText(
    section.diagram.x * sectionWidth + xOffset + xLocalOffset,
    section.diagram.y * yHeight + yOffset + yLocalOffset,
    "q",
    "black",
    "left",
    false
  );
  signallingText(
    section.diagram.x * sectionWidth + xOffset + xLocalOffset,
    section.diagram.y * yHeight + yOffset + yLocalOffset,
    character,
    colour,
    "left",
    false
  );
}

function _drawTrtsText(trts, text, colour) {
  if (text === undefined) return;
  if (config.signals[trts] === undefined) return; // Referenced signal doesn't exist

  var signal = config.signals[trts];
  if (signal.diagram === undefined) return; // Signal doesn't have a diagram setting

  if (!signal.diagram.trts) return; // Signal does not have trts

  var section = config.sections[signal.diagram.section];
  if (section.diagram === undefined) return; // Signal references an invalid section
  var xLocalOffset = 0;
  var yLocalOffset = 0;
  var localAlign = "";
  if (signal.diagram.end == "left") {
    xLocalOffset = 25;
    yLocalOffset = 25;
    localAlign = "left";
  } else if (signal.diagram.end == "right") {
    xLocalOffset = section.diagram.width * sectionWidth - 30;
    yLocalOffset = -15;
    localAlign = "right";
  }
  console.log("Drawing text: " + text);
  // Draw the text
  signallingText(
    section.diagram.x * sectionWidth + xOffset + xLocalOffset,
    section.diagram.y * yHeight + yOffset + yLocalOffset,
    text,
    colour,
    localAlign,
    true
  );
}

function _drawRequest(request, character, colour) {
  if (config.signals[request] === undefined) return; // Referenced signal doesn't exist

  var signal = config.signals[request];
  if (signal.diagram === undefined) return; // Signal doesn't have a diagram setting

  if (!signal.diagram.request) return; // Signal does not have request

  var section = config.sections[signal.diagram.section];
  if (section.diagram === undefined) return; // Signal references an invalid section
  var xLocalOffset = 0;
  var yLocalOffset = 0;
  if (signal.diagram.end == "left") {
    xLocalOffset = 22 + signal.diagram.offset * sectionWidth;
    yLocalOffset = 12;
  } else if (signal.diagram.end == "right") {
    xLocalOffset =
      section.diagram.width * sectionWidth -
      27 +
      signal.diagram.offset * sectionWidth;
    yLocalOffset = -15;
  }
  // Blank out previous state
  signallingText(
    section.diagram.x * sectionWidth + xOffset + xLocalOffset,
    section.diagram.y * yHeight + yOffset + yLocalOffset,
    "q",
    "black",
    "left",
    false
  );
  signallingText(
    section.diagram.x * sectionWidth + xOffset + xLocalOffset,
    section.diagram.y * yHeight + yOffset + yLocalOffset,
    character,
    colour,
    "left",
    false
  );
}
function _drawCrossingPart(x, y, width, height) {
  beginPath();
  moveTo(x, y);
  lineTo(x + width, y);
  lineTo(x + width, y + height);
  lineTo(x, y + height);
  closePath();
  fill("#ff7f00");
}

function continuationText(x, y, text, direction, arrowOverride) {
  let textDirection;
  let arrowChar;
  let xArrowOffset;
  let yArrowOffset;
  if (direction == "left") {
    textDirection = "right";
    arrowChar = String.fromCharCode(140);
    xArrowOffset = Math.floor(sectionWidth / 2) - 12;
    yArrowOffset = -12;
  } else {
    textDirection = "left";
    arrowChar = String.fromCharCode(141);
    xArrowOffset = -Math.floor(sectionWidth / 2) + 4;
    yArrowOffset = 14;
  }
  if (arrowOverride == "top") {
    yArrowOffset = -12;
  }
  if (arrowOverride == "bottom") {
    yArrowOffset = 14;
  }
  signallingText(x, y, "(" + text + ")", "grey", textDirection);
  signallingText(x + xArrowOffset, y + yArrowOffset, arrowChar, "grey", "left");
}
