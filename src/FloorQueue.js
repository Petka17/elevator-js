/**
 *          x->
 * -1-2-3-4-5-6-7-8-9-
 *          ----1----> onTheWayFloors
 * <--------2--------- onTheWayBackFloors
 * ---3--->            turnWayFloors
 */
function FloorQueue(observer) {
  this._onTheWayFloors = []; // 1
  this._onTheWayBackFloors = []; // 2
  this._turnWayFloors = []; // 3

  this._observer = observer;
}

FloorQueue.prototype = {
  /**
   * Get next floor
   */
  nextFloor: function() {
    return this._onTheWayFloors.length > 0
      ? this._onTheWayFloors[0]
      : this._onTheWayBackFloors.length > 0
      ? this._onTheWayBackFloors[0]
      : null;
  },

  /**
   * Add new floor to the queue
   * @param {number} currentFloor
   * @param {number} newFloor
   * @param {number} newFloorDirection - direction, where -1 means down, +1 means up
   */
  addFloor: function(currentFloor, newFloor, newFloorDirection) {
    const nextFloor = this.nextFloor() || newFloor;
    const currDirection =
      currentFloor < nextFloor ? 1 : currentFloor > nextFloor ? -1 : 0;

    if (newFloorDirection !== currDirection) {
      this._addToList(this._onTheWayBackFloors, newFloor, newFloorDirection);
    } else if (currentFloor * currDirection < newFloor * currDirection) {
      this._addToList(this._onTheWayFloors, newFloor, newFloorDirection);
    } else {
      this._addToList(this._turnWayFloors, newFloor, newFloorDirection);
    }

    this._notify();
  },

  removeNextFloor: function() {
    if (this._onTheWayFloors.length > 0) {
      this._onTheWayFloors.splice(0, 1);
      if (this._onTheWayFloors.length === 0) {
        this._makeTurn();
      }
    } else {
      this._onTheWayBackFloors.splice(0, 1);
      this._makeTurn();
    }

    this._notify();
  },

  _makeTurn: function() {
    this._onTheWayFloors = this._onTheWayBackFloors;
    this._onTheWayBackFloors = this._turnWayFloors;
    this._turnWayFloors = [];
  },

  /**
   * Add a floor to one of the arrays
   * @param {array} list one of the lists
   * @param {number} floor
   * @param {number} order -1 or 1
   */
  _addToList: function(list, floor, order) {
    let i;

    for (i = 0; i < list.length; i++)
      if (list[i] * order >= floor * order) break;

    if (list[i] !== floor) list.splice(i, 0, floor);
  },

  _notify: function() {
    this._observer.emit(
      "queue-change",
      this.nextFloor(),
      this._onTheWayFloors,
      this._onTheWayBackFloors,
      this._turnWayFloors
    );
  }
};

module.exports = FloorQueue;
