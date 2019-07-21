const ElevatorController = require("./ElevatorController");
const elevatorObserver = require("./elevatorObserver");

const controller = new ElevatorController(elevatorObserver);

const moveUpBtn = document.getElementById("move-up");
moveUpBtn.addEventListener("click", () => {
  controller.hw.moveUp();
});

const moveDownBtn = document.getElementById("move-down");
moveDownBtn.addEventListener("click", () => {
  controller.hw.moveDown();
});

const stopBtn = document.getElementById("stop-and-open");
stopBtn.addEventListener("click", () => {
  controller.hw.stopAndOpenDoors();
});

const floors = document.getElementsByClassName("floor");

for (let i = 0; i < floors.length; i++) {
  const floor = floors[i];
  const floorNumber = Number(floor.children[0].innerText);
  const floorButtons = floor.children[1];

  floorButtons.children[0].addEventListener("click", () => {
    controller.hw.emit("floorButtonPressed", floorNumber, 1);
  });

  floorButtons.children[1].addEventListener("click", () => {
    controller.hw.emit("floorButtonPressed", floorNumber, -1);
  });
}

const cabinButtons = document.getElementsByClassName("num-button");

for (let i = 0; i < cabinButtons.length; i++) {
  const cabinButton = cabinButtons[i];
  const floorNumber = Number(cabinButton.innerText);

  cabinButton.addEventListener("click", () => {
    controller.hw.emit("cabinButtonPressed", floorNumber);
  });
}
