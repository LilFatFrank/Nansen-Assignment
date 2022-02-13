import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [userFloor, setUserFloor] = useState(0);
  const [elevatorFloor, setElevatorFloor] = useState(0);
  const [destinationFloor, setDestinationFloor] = useState();
  const [direction, setDirection] = useState("None");
  const [doors, setDoors] = useState("Closed");

  const DIRECTIONS = {
    UP: 1,
    HOME: 0,
    DOWN: -1
  };

  useEffect(() => {
    if (elevatorFloor == userFloor || elevatorFloor == destinationFloor) {
      stopAndOpenDoors();
      setDestinationFloor("");
    }
    if (destinationFloor) {
      setUserFloor(elevatorFloor);
    }
  }, [elevatorFloor]);

  useEffect(() => {
    if (userFloor) getCurrentFloor();
  }, [userFloor]);

  useEffect(() => {
    if (direction) getCurrentDirection();
  }, [direction]);

  const on = (event, callback) => {
    switch (event) {
      case "doorsClosed":
        callback();
        break;
      case "beforeFloor":
        //do nothing;
        break;
      case "floorButtonPressed":
        callback();
        break;
      case "cabinButtonPressed":
        callback();
        break;
      default:
        break;
    }
  };

  const moveUp = (floor, targetFloor) => {
    setDirection("UP");
    let current = floor;
    const interval = setInterval(() => {
      setElevatorFloor((current = parseInt(current) + 1));
    }, 1000);
    setTimeout(() => clearInterval(interval), (targetFloor - floor) * 1000);
  };

  const moveDown = (floor, targetFloor) => {
    setDirection("DOWN");
    let current = floor;
    const interval = setInterval(() => {
      setElevatorFloor((current -= 1));
    }, 1000);
    setTimeout(() => clearInterval(interval), (floor - targetFloor) * 1000);
  };

  const floorButtonPressed = (floor, targetFloor) => {
    if (floor != userFloor) {
      if (userFloor < floor)
        on("doorsClosed", () => moveDown(floor, targetFloor));
      else on("doorsClosed", () => moveUp(floor, targetFloor));
    } else {
      on("doorsClosed", () => stopAndOpenDoors());
    }
  };

  const stopAndOpenDoors = () => {
    setDirection("None");
    setDoors("Open");
    setTimeout(() => setDoors("Closed"), 2000);
  };

  const cabinButtonPressed = (floor) => {
    setDestinationFloor(floor);
    setDirection(floor > elevatorFloor ? "UP" : "DOWN");
    let current = elevatorFloor;
    const interval = setInterval(() => {
      setElevatorFloor(
        floor > current ? (current = parseInt(current) + 1) : (current -= 1)
      );
    }, 1000);
    setTimeout(
      () => clearInterval(interval),
      (floor > elevatorFloor ? floor - elevatorFloor : elevatorFloor - floor) *
        1000
    );
  };

  const getCurrentFloor = () => {
    return userFloor;
  };

  const getCurrentDirection = () => {
    return direction;
  };

  return (
    <>
      <ul>
        <li>
          use the destination floor input to set the floor the user needs to go
          to.
        </li>
        <li>
          use the user floor input to set the floor the user is at the moment.
        </li>
        <li>
          the move up and move down button are like floor buttons used to get
          the elevator to the user.
        </li>
      </ul>
      <div className="app">
        <div className="button-area">
          <button
            onClick={() =>
              on("floorButtonPressed", () =>
                floorButtonPressed(elevatorFloor, userFloor)
              )
            }
          >
            Move Up
          </button>
          <button
            onClick={() =>
              on("floorButtonPressed", () =>
                floorButtonPressed(elevatorFloor, userFloor)
              )
            }
          >
            Move Down
          </button>
        </div>
        <div className="button-area">
          <input
            id="destination"
            disabled={!(userFloor == elevatorFloor)}
            placeholder={"set destination floor"}
            pattern={/^[0-9]*$/}
          />
          <button
            onClick={() =>
              on("cabinButtonPressed", () =>
                cabinButtonPressed(document.getElementById("destination").value)
              )
            }
          >
            Go
          </button>
        </div>
        <div className="button-area">
          <input
            id="user"
            disabled={destinationFloor}
            placeholder={"set user floor"}
            pattern={/^[0-9]*$/}
          />
          <button
            onClick={() => setUserFloor(document.getElementById("user").value)}
          >
            Go
          </button>
        </div>
        <div className="app">
          <div>User Floor: {getCurrentFloor()}</div>
          <div>Elevator Floor: {elevatorFloor}</div>
          <div>Destination Floor: {destinationFloor}</div>
          <div>Direction: {DIRECTIONS[getCurrentDirection()]}</div>
          <div>Doors: {doors}</div>
        </div>
      </div>
    </>
  );
};

export default App;
