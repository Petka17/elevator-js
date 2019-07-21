const HardwareElevator = require("./ElevatorHardware");
const FloorQueue = require("./FloorQueue");

function _bind(func, context) {
  return func.bind(context);
}

function ElevatorController(elevatorObserver) {
  this.hw = new HardwareElevator(elevatorObserver);

  this.hw.on("floorButtonPressed", _bind(this.onFloorButtonPressed, this));
  this.hw.on("cabinButtonPressed", _bind(this.onCabinButtonPressed, this));
  this.hw.on("doorsClosed", _bind(this.onDoorsClosed, this));
  this.hw.on("beforeFloor", _bind(this.onBeforeFloor, this));

  this.floorQueue = new FloorQueue(elevatorObserver);
}

ElevatorController.prototype = {
  onFloorButtonPressed: function(floor, direction) {
    this.floorQueue.addFloor(this.hw.getCurrentFloor(), floor, direction);
    this._startMoving();
  },
  onCabinButtonPressed: function(floor) {
    const currentFloor = this.hw.getCurrentFloor();
    const floorDirection = floor > currentFloor ? 1 : -1;
    this.floorQueue.addFloor(this.hw.getCurrentFloor(), floor, floorDirection);
    this._startMoving();
  },
  onDoorsClosed: function() {
    this._startMoving();
  },
  onBeforeFloor: function() {
    const nextFloor = this.hw.getCurrentFloor() + this.hw.getCurrentDirection();
    if (this.floorQueue.nextFloor() === nextFloor) {
      this.floorQueue.removeNextFloor();
      this.hw.stopAndOpenDoors();
    }
  },
  _startMoving: function() {
    const nextFloor = this.floorQueue.nextFloor();
    if (nextFloor === null) return;

    if (this.hw.getCurrentDirection() === 0) {
      if (this.hw.getCurrentFloor() < nextFloor) {
        this.hw.moveUp(nextFloor);
      } else if (this.hw.getCurrentFloor() > nextFloor) {
        this.hw.moveDown(nextFloor);
      } else {
        this.floorQueue.removeNextFloor();
      }
    }
  }
};

module.exports = ElevatorController;
