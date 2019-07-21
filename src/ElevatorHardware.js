const EventEmitter = require("events").EventEmitter;

const DIRECTION_DOWN = -1;
const DIRECTION_NONE = 0;
const DIRECTION_UP = 1;

function HardwareElevator(observer) {
  this.state = {
    floor: 1,
    direction: DIRECTION_NONE,
    doorsOpen: false
  };
  observer.emit("newState", this.state);

  this._updateState = function(changedPart) {
    this.state = Object.assign(this.state, changedPart);
    observer.emit("newState", this.state);
  };

  this.currentAction = null;
  this.events = new EventEmitter();

  this.startToMove = function(direction) {
    if (this.state.direction !== DIRECTION_NONE) {
      console.error("The elevator is already moving");
      return;
    }
    if (this.state.doorsOpen) {
      console.error("The doors are open");
      return;
    }

    this._updateState({ direction: direction });

    clearInterval(this.currentAction);
    this.currentAction = setInterval(() => {
      this.events.emit("beforeFloor");
      this._updateState({ floor: this.state.floor + direction });
    }, 1000);
  };

  this.events.on("moveUp", () => {
    this.startToMove(DIRECTION_UP);
  });
  this.events.on("moveDown", () => {
    this.startToMove(DIRECTION_DOWN);
  });
  this.events.on("stop", () => {
    clearInterval(this.currentAction);
    setTimeout(() => {
      this._updateState({ direction: DIRECTION_NONE, doorsOpen: true });
    }, 0);
    setTimeout(() => {
      this._updateState({ doorsOpen: false });
      this.events.emit("doorsClosed");
    }, 3000);
  });
}

HardwareElevator.prototype = {
  on: function(event, cb) {
    this.events.on(event, cb);
  },
  emit: function(event, ...args) {
    const externalEvent = ["floorButtonPressed", "cabinButtonPressed"];

    if (externalEvent.indexOf(event) === -1) {
      console.error(event + " is not in allowed list.");
      return;
    }

    this.events.emit(event, ...args);
  },
  //------------------------------
  moveUp: function() {
    this.events.emit("moveUp");
  },
  moveDown: function() {
    this.events.emit("moveDown");
  },
  stopAndOpenDoors: function() {
    this.events.emit("stop");
  },
  getCurrentFloor: function() {
    return this.state.floor;
  },
  getCurrentDirection: function() {
    return this.state.direction;
  }
};

module.exports = HardwareElevator;
