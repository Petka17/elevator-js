const EventEmitter = require("events").EventEmitter;

const elevatorObserver = new EventEmitter();

const doorState = document.getElementById("door-state");
const currentFloor = document.getElementById("current-floor");
const currentDirection = document.getElementById("direction");
const floors = document.getElementsByClassName("floor");

elevatorObserver.on("newState", state => {
  console.log(state);

  if (state.doorsOpen) {
    doorState.innerHTML = "Open";
  } else {
    doorState.innerHTML = "Closed";
  }

  currentFloor.innerHTML = state.floor;

  currentDirection.innerHTML =
    state.direction === -1
      ? "Going Down"
      : state.direction === 1
      ? "Going Up"
      : "Not moving";

  for (let i = 0; i < floors.length; i++) {
    const floor = floors[i];
    const cabin = floor.children[0];
    const floorNumber = Number(cabin.innerText);

    cabin.className = "cabin";

    if (floorNumber === state.floor) {
      if (state.doorsOpen) {
        cabin.classList.add("door-open");
      } else {
        cabin.classList.add("door-closed");
      }
    }
  }
});

const queue = document.getElementById("queue");
const nextFloor = document.getElementById("next-floor");

elevatorObserver.on("queue-change", (floor, arr1, arr2, arr3) => {
  queue.innerHTML =
    arr1.join(", ") + " | " + arr2.join(", ") + " | " + arr3.join(", ");
  nextFloor.innerHTML = floor;
});

module.exports = elevatorObserver;
