export { Info };

// const draw = require('./draw.js');
import {
  beginPath,
  moveTo,
  lineTo,
  closePath,
  fill,
  text,
  blankText,
} from "./draw";

class Info {
  constructor() {
    this._info = {};
    this._textsize = 15;
    this._x = 20;
    this._y = 50;
    this._lastDateTime = null;
    this._showTimeout = false;
  }

  process(info) {
    if (info.cabincode != undefined) {
      this._info["cabincode"] = info.cabincode;
      this._cabincode();
    }
    if (info.direction != undefined) {
      this._info["direction"] = info.direction;
      this._direction();
    }
    if (info.logic != undefined) {
      this._info["logic"] = info.logic;
      this._logic();
    }
    if (info.safety != undefined) {
      this._info["safety"] = info.safety;
      this._safety();
    }

    if (info.user !== undefined) {
      if (String(info.user).toLowerCase() == "computer") info.user = null;
      this._info["user"] = info.user;
      this._user();
    }

    if (info.datetime === undefined) info.datetime = null;
    this._info["timedout"] = info.timedout;
    this._timedout();
  }

  redraw() {
    this._user();
    this._safety();
    this._logic();
    this._direction();
    this._cabincode();
  }

  _user() {
    beginPath();
    moveTo(1280, 950);
    lineTo(1920, 950);
    lineTo(1920, 1080);
    lineTo(1280, 1080);
    closePath();
    fill("#000000");
    if (this._info["user"] != "")
      text(
        1890,
        990,
        "Signaller : " + this._info["user"],
        this._textsize,
        "#FFFFFF",
        "right",
        "verdana-bold"
      );
  }

  _safety() {
    blankText(
      this._x,
      this._y + 4.5 * this._textsize,
      "Safety Mode : ENABLED (WITH SAFETY NET)     ",
      this._textsize,
      "left",
      "verdana-bold"
    );
    text(
      this._x,
      this._y + 4.5 * this._textsize,
      "Safety Mode : " + this._info["safety"],
      this._textsize,
      "#FFFFFF",
      "left",
      "verdana-bold"
    );
  }
  _logic() {
    blankText(
      this._x,
      this._y + 3 * this._textsize,
      "Logic : Manual       ",
      this._textsize,
      "left",
      "verdana-bold"
    );
    text(
      this._x,
      this._y + 3 * this._textsize,
      "Logic : " + this._info["logic"],
      this._textsize,
      "#FFFFFF",
      "left",
      "verdana-bold"
    );
  }
  _direction() {
    blankText(
      this._x,
      this._y + 1.5 * this._textsize,
      "Direction : Westbound   ",
      this._textsize,
      "left",
      "verdana-bold"
    );
    text(
      this._x,
      this._y + 1.5 * this._textsize,
      "Direction : " + this._info["direction"],
      this._textsize,
      "#FFFFFF",
      "left",
      "verdana-bold"
    );
  }
  _cabincode() {
    blankText(
      this._x,
      this._y,
      "Cabin Code : XX",
      this._textsize,
      "left",
      "verdana-bold"
    );
    text(
      this._x,
      this._y,
      "Cabin Code : " + this._info["cabincode"],
      this._textsize,
      "#FFFFFF",
      "left",
      "verdana-bold"
    );
  }
  _timedout() {
    if (this._info["timedout"]) {
      if (this._timeoutInterval === undefined) {
        this._timeoutInterval = setInterval(this._flashTimeout, 1000);
      }
    } else {
      blankText(1680, 180, "OUT OF DATE", 22, "left", "verdana-bold");
      clearInterval(this._timeoutInterval);
    }
  }
  _flashTimeout() {
    this._showTimeout = !this._showTimeout;
    blankText(1680, 180, "OUT OF DATE", 22, "left", "verdana-bold");
    if (this._showTimeout) {
      text(1680, 180, "OUT OF DATE", 22, "#FFFF00", "left", "verdana-bold");
    }
  }
}
