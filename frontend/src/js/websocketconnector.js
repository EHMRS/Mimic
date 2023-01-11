import {
  drawSection,
  drawPoint,
  drawSignal,
  drawCrossing,
  drawCallin,
  drawTrts,
  drawRequest,
} from "./track";
import { config } from "./config";
import { setMessages } from "./messages";

const websockethost = "ws://localhost:4000";

var state = {
  points: [],
  sections: [],
  signals: [],
  requests: [],
  callin: [],
  messages: [],
  crossings: [],
  info: {},
  connected: false,
};

export class WebSocketConnector {
  constructor() {}

  callback = null;

  onMessage(event) {
    if (config === null) return;
    if (config.points === undefined) return;
    if (config.sections === undefined) return;
    if (config.signals === undefined) return;
    if (config.crossings === undefined) return;
    var object = JSON.parse(event.data);
    var localVersion = sessionStorage.getItem("serverversion");
    if (localVersion == null) {
      sessionStorage.setItem("serverversion", object.version);
    } else {
      if (localVersion < object.version) {
        sessionStorage.setItem("serverversion", object.version);
        window.location.reload(true);
      }
    }
    var k;
    for (k in object.points) {
      let kn = k.substring(1);
      if (config.points[kn] !== undefined) {
        drawPoint(
          config.points[kn],
          object.points[k].route,
          object.points[k].state
        );
      }
    }
    for (k in object.sections) {
      if (config.sections[k] !== undefined) {
        drawSection(config.sections[k], object.sections[k]);
      }
    }
    for (k in object.signals) {
      if (config.signals[k] !== undefined) {
        drawSignal(
          config.signals[k],
          object.signals[k].signal,
          object.signals[k].spad
        );
      }
    }
    for (k in object.requests) {
      if (object.requests[k].type == "trts") {
        drawTrts(k, object.requests[k]);
      }
      if (object.requests[k].type == "slot") {
        drawRequest(k, object.requests[k].state);
      }
    }
    for (k in object.callin) {
      drawCallin(k, object.callin[k]);
    }
    setMessages(object.messages);
    for (k in object.crossings) {
      drawCrossing(config.crossings[k], object.crossings[k]["open"]);
    }
    for (k in object.info) {
      state.info[k] = object.info[k];
    }
  }

  connect() {
    if (this.ws === undefined || (this.ws && this.ws.readyState === 3)) {
      this.ws = new WebSocket(websockethost);
      let self = this;
      this.ws.onmessage = (event) => {
        self.onMessage(event, this);
      };
      this.ws.onopen = () => {
        clearInterval(self._interval);
        state.connected = true;
      };
      this.ws.onclose = () => {
        state.connected = false;
        self._interval = setInterval(() => self.connect(), 500);
      };
    }
  }
  disconnnect() {
    if (this.ws === undefined || (this.ws && this.ws.readyState === 3)) {
      return;
    }
    return this.ws.close();
  }
  refresh() {
    if (this.ws !== undefined && this.ws && this.ws.readyState === 1) {
      state.connected = true;
    } else {
      state.connected = false;
    }
  }
}
