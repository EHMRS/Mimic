// var draw = require('./draw');
import { beginPath, moveTo, lineTo, closePath, fill, text } from "./draw";
import {
  rawConfig,
  xOffset,
  yOffset,
  sectionWidth,
  yHeight,
  messageTickSpeed,
} from "./config";

var _messages = {};
var _interval = null;
var _counter = {};

export function setMessages(messages) {
  if (messages == undefined) return;
  var localMessages = {};
  rawConfig["messages"].forEach((thisElement) => {
    localMessages[thisElement.name] = [];
    if (_counter[thisElement.name] === undefined)
      _counter[thisElement.name] = -1;
  });
  if (messages.length) {
    messages.forEach((thisElement) => {
      if (localMessages[thisElement.type] === undefined) return;
      localMessages[thisElement.type].push(thisElement.text);
    });
  }
  _messages = localMessages;
  if (_interval === null) {
    // Set up the interval
    _interval = setInterval(refreshMessages, messageTickSpeed * 1000);
  }
}

function refreshMessages() {
  rawConfig["messages"].forEach((thisElement) => {
    // First blank out the previous messages
    beginPath();
    moveTo(
      thisElement.bounding.x * sectionWidth + xOffset,
      thisElement.bounding.y * yHeight + yOffset
    );
    lineTo(
      thisElement.bounding.x * sectionWidth +
        xOffset +
        thisElement.bounding.width * sectionWidth,
      thisElement.bounding.y * yHeight + yOffset
    );
    lineTo(
      thisElement.bounding.x * sectionWidth +
        xOffset +
        thisElement.bounding.width * sectionWidth,
      thisElement.bounding.y * yHeight +
        yOffset +
        thisElement.bounding.height * yHeight
    );
    lineTo(
      thisElement.bounding.x * sectionWidth + xOffset,
      thisElement.bounding.y * yHeight +
        yOffset +
        thisElement.bounding.height * yHeight
    );
    closePath();
    fill("#000000");

    if (_messages[thisElement.name].length == 0) {
      // We don't need to display no messages
      _counter[thisElement.name] = 0;
      return;
    }

    _counter[thisElement.name]++;

    if (_counter[thisElement.name] >= _messages[thisElement.name].length) {
      _counter[thisElement.name] = 0;
    }
    var prefix = "";
    if (_messages[thisElement.name].length > 1) {
      prefix =
        "(" +
        (_counter[thisElement.name] + 1) +
        " of " +
        _messages[thisElement.name].length +
        ") ";
    }

    text(
      thisElement.bounding.x * sectionWidth + xOffset + 10,
      thisElement.bounding.y * yHeight + yOffset + thisElement.size + 10,
      prefix + _messages[thisElement.name][_counter[thisElement.name]],
      thisElement.size,
      thisElement.colour,
      "left",
      "verdana-bold"
    );
  });
}
