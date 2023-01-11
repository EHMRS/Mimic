class Settings {
  _keys = {
    SignalLabels: {
      label: "Show Signal Labels",
      default: false,
    },
    PointLabels: {
      label: "Show Point Labels",
      default: false,
    },
    SectionLabels: {
      label: "Show Section Labels",
      default: false,
    },
  };
  constructor() {
    this._load();
    this._callback = function (settingName, value) {}; //eslint-disable-line no-unused-vars
    this._createModal();
  }
  _createModal() {
    var settingsModalBody = document.createElement("div");
    settingsModalBody.classList.add("modal-body");

    var check;
    var label;
    var p;

    for (var k in this._keys) {
      p = document.createElement("p");
      check = document.createElement("input");
      check.type = "checkbox";
      check.id = k;
      check.name = k;
      check.checked = this.get(k) == 1;
      check.addEventListener("change", (event) => this._handleChange(event));
      label = document.createElement("label");
      label.setAttribute("for", k);
      label.innerHTML = this._keys[k].label;
      p.appendChild(check);
      p.appendChild(label);
      settingsModalBody.appendChild(p);
    }

    var settingsModalHeader = document.createElement("div");
    settingsModalHeader.classList.add("modal-header");
    var close = document.createElement("span");
    close.id = "modalClose";
    close.classList.add("close");
    close.innerHTML = "&times;";
    close.addEventListener("click", () => this.hide());
    var h2 = document.createElement("h2");
    h2.innerHTML = "Settings";
    settingsModalHeader.appendChild(close);
    settingsModalHeader.appendChild(h2);

    var settingsModalContent = document.createElement("div");
    settingsModalContent.classList.add("modal-content");
    settingsModalContent.appendChild(settingsModalHeader);
    settingsModalContent.appendChild(settingsModalBody);

    var settingsModal = document.createElement("div");
    settingsModal.classList.add("modal");
    settingsModal.id = "settingsModal";
    settingsModal.addEventListener("click", (event) => {
      if (event.target == document.getElementById("settingsModal")) this.hide();
    });
    settingsModal.appendChild(settingsModalContent);
    document.body.appendChild(settingsModal);
  }
  show() {
    document.getElementById("settingsModal").style.display = "block";
  }
  hide() {
    document.getElementById("settingsModal").style.display = "none";
  }
  _handleChange(event) {
    var name = event.target.name;
    this.set(name, event.target.checked ? true : false);
    this._callback(name, event.target.checked ? true : false);
  }
  _load() {
    this._settings = {};
    for (var k in this._keys) {
      var result = localStorage.getItem(k);
      if (result === null) {
        result = this._keys[k].default;
      } else {
        if (result == "false") {
          result = false;
        } else {
          result = true;
        }
      }
      this._settings[k] = result;
    }
  }

  _save() {
    for (var k in this._settings) {
      localStorage.setItem(k, this._settings[k]);
    }
  }
  get(key) {
    return this._settings[key];
  }
  set(key, value) {
    this._settings[key] = value;
    this._save();
  }
  registerCallback(func) {
    this._callback = func;
  }
}

export var settings = new Settings();
