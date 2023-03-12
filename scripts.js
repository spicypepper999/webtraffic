//classes

//
//
class Node {
  constructor(x, y, type, ruleset) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.ruleset = ruleset;
    this.queue = [];
    this.currentVehicle;
  }
  set x(value) {
    this._x = value;
  }
  get x() {
    return this._x;
  }
  set y(value) {
    this._y = value;
  }
  get y() {
    return this._y;
  }
  set type(value) {
    this._type = value;
  }
  get type() {
    return this._type;
  }
  set ruleset(value) {
    this._ruleset = value;
  }
  get ruleset() {
    return this._ruleset;
  }
  set queue(value) {
    this._queue = value;
  }
  get queue() {
    return this._queue;
  }
  set currentVehicle(value) {
    this._currentVehicle = value;
  }
  get currentVehicle() {
    return this._currentVehicle;
  }
  distanceXTo(node) {
    let distanceX = this._x - node.x;
    return distanceX;
  }
  distanceYTo(node) {
    let distanceY = this._y - node.y;
    return distanceY;
  }
  distanceTo(node) {
    let distanceX = this.distanceXTo(node);
    let distanceY = this.distanceYTo(node);
    let distance = Math.sqrt((distanceX ** 2) + (distanceY ** 2));
    return distance;
  }
  directionTo(node) {
    let direction = Math.atan2(this.distanceYTo(node), this.distanceXTo(node));
    return direction;
  }
  setXY(x, y) {
    this._x = x;
    this._y = y;
  }
  setXY(node) {
    this._x = node.x;
    this._y = node.y;
  }
  isObstacle(car) {
    if (this._ruleset[0] == "stop") {
      if (car.speed == 0 || this._currentVehicle == car) {
        this._currentVehicle = car;
        return false;
      } else {
        return true;
      }
    }
    if (this._ruleset[0] == "yield") {
      let yieldRoad = this._ruleset[1];
      let yieldDistance = this._ruleset[2];
      let blocked = false;
      if (car.road == yieldRoad) {
        return false;
      } else {
        for (let car2 of map.cars) {
          if (car2.road == yieldRoad && car2 != car) {
            let carDistance = car2.position - yieldRoad.positionOfNode(this)[0];
            if (yieldDistance >= 0 && carDistance <= yieldDistance && carDistance >= 0) {
              blocked = true;
            }
            if (yieldDistance < 0 && carDistance >= yieldDistance && carDistance <= 0) {
              blocked = true;
            }
          }
        }
        if (this._currentVehicle == car) {
          blocked = false;
        }
        return blocked;
      }
    }
  }

}

//
//


//
//
class Road {
  constructor(nodes, roadEnd, speedLimit, color) {
    this.nodes = nodes;
    this.roadEnd = roadEnd;
    this.speedLimit = speedLimit;
    this.color = color;
  }
  set nodes(value) {
    this._nodes = value;
  }
  get nodes() {
    return this._nodes;
  }
  set roadEnd(value) {
    this._roadEnd = value;
  }
  get roadEnd() {
    return this._roadEnd;
  }
  set speedLimit(value) {
    this._speedLimit = value;
  }
  get speedLimit() {
    return this._speedLimit;
  }
  set color(value) {
    this._color = value;
  }
  get color() {
    return this._color;
  }
  XYFromPosition(position) {
    let node = new Node(0, 0);
    if (position < 0) {
      node.setXY(this._nodes[0]);
      return node;
    }
    if (position > this.length()) {
      if (Object.keys(this._roadEnd).length > 0) {
        node.setXY(this._roadEnd.XYFromPosition(position - this.length()));
        return node;
      } else {
        node.setXY(this._nodes[this._nodes.length - 1]);
        return node;
      }
    }
    let distanceLeft = position;
    node.setXY(this._nodes[0]);
    for (let i = 1; i < this._nodes.length && distanceLeft > 0; i++) {
      if (distanceLeft < node.distanceTo(this._nodes[i])) {
        let dx = (Math.cos(node.directionTo(this._nodes[i])) * distanceLeft);
        let dy = (Math.sin(node.directionTo(this._nodes[i])) * distanceLeft);
        dx = node.x - dx;
        dy = node.y - dy;
        node = new Node(dx, dy);
        return node;
      }
      distanceLeft -= node.distanceTo(this._nodes[i]);
      node.setXY(this._nodes[i]);
    }
    return node;
  }
  length() {
    let length = 0;
    let nodeCompare = this._nodes[0];
    for (let node of this._nodes) {
      length += node.distanceTo(nodeCompare);
      nodeCompare = node;
    }
    return length;
  }
  //since i want to support road loops, there could be 2 separate position values for an intersection node
  positionOfNode(node) {
    let positions = [];
    let position = 0;
    let nodePrevious = this._nodes[0];
    for (let nodeCompare of this._nodes) {
      position += nodePrevious.distanceTo(nodeCompare);
      if (node == nodeCompare) {
        positions.push(position);
      }
      nodePrevious = nodeCompare;
    }
    return positions;
  }
}
//
//


//
//
class Car {
  constructor(position, size, road, direction, speed, power, ruleset) {
    this.position = position;
    this.size = size;
    this.road = road;
    this.direction = direction;
    this.speed = speed;
    this.power = power;
    this.ruleset = ruleset;
  }
  set position(value) {
    this._position = value;
  }
  get position() {
    return this._position;
  }
  set size(value) {
    this._size = value;
  }
  get size() {
    return this._size;
  }
  set road(value) {
    this._road = value;
  }
  get road() {
    return this._road;
  }
  set direction(value) {
    this._direction = value;
  }
  get direction() {
    return this._direction;
  }
  set speed(value) {
    this._speed = value;
  }
  get speed() {
    return this._speed;
  }
  set power(value) {
    this._power = value;
  }
  get power() {
    return this._power;
  }
  set ruleset(value) {
    this._ruleset = value;
  }
  get ruleset() {
    return this._ruleset;
  }
  getXY() {
    let node = this._road.XYFromPosition(this._position);
    return node;
  }
  updatePosition() {
    for (let i = 0; i < this._ruleset.length; i += 3) {
      let node = this._ruleset[i];
      let nextRoad = this._ruleset[i + 1];
      let direction = this._ruleset[i + 2];
      if (this.checkPath(this._speed * this._direction) == node) {
        console.log("gfds");
        this._road = nextRoad;
        this._direction = direction;
        this._position = nextRoad.positionOfNode(node)[0];
        node.queue.pop();
      }
    }
    this._position += (this._speed * this._direction);
  }
  //checks if specified distance in front of car is clear of any other cars and intersections, returns the closest object if one is found
  checkPath(distance) {
    let detected;
    for (let car of map.cars) {
      if ((car != this) && (car.road == this._road)) {
        if (distance > 0 && (car.position - this._position) <= distance && (car.position - this._position) >= 0) {
          detected = car;
          return detected;
        } else if (distance < 0 && (car.position - this._position) >= distance && (car.position - this._position) <= 0) {
          detected = car;
          return detected;
        }
      }
    }
    for (let node of this._road.nodes) {
      let closestPosition = Number.MAX_VALUE;
      for (let position of this._road.positionOfNode(node)) {
        if (Math.abs(position - this._position) < Math.abs(closestPosition)) {
          closestPosition = position - this._position;
        }
      }
      if (distance > 0 && closestPosition <= distance && closestPosition >= 0 && node.type == "intersection") {
        detected = node;
        return detected;
      } else if (distance < 0 && closestPosition >= distance && closestPosition <= 0 && node.type == "intersection") {
        detected = node;
        return detected;
      }
    }
    return detected;
  }

  calculateStoppingDistance() {
    let distance = 0;
    distance = (this._speed ** 2) / (this._power * 2);
    return distance;
  }
  calculateStoppingDistanceToCar(car) {
    let distance = 0;
    distance = ((this._speed - car.speed) ** 2) / (this._power * 2);
    return distance;
  }
  brake() {
    if (this._speed > 0) {
      this._speed -= this._power;
    }
    if (this._speed <= 0) {
      this._speed = 0;
    }
  }
  accelerate() {
    if (this._speed < this._road.speedLimit) {
      this._speed += this._power;
    }
  }
  isObstacle(car) {
    return true;
  }
}
//
//


//THIS IS WHERE WE INITIALIZE STUFF!!!
//drawing road
let intersect1 = new Node(500, 300, "intersection");
let intersect2 = new Node(500, 1000, "intersection");
let road1 = new Road([intersect1, new Node(700, 300), new Node(1100, 700), new Node(1300, 900), new Node(1300, 1000), intersect2, intersect1], "", 2, "blue")
road1.roadEnd = road1;

let road2 = new Road([intersect2, new Node(200, 1000), new Node(200, 300), intersect1], "", 1, "red");

intersect1.roads = [road1, road2];
intersect1.ruleset = ["stop"];
intersect2.roads = [road1, road2];
intersect2.ruleset = ["yield", road1, -600];

let car1 = new Car(1005, 25, road1, 1, 0.5, 0.01, [intersect1, road2, -1, intersect2, road1, 1]);
let car2 = new Car(1100, 25, road1, 1, 0.5, 0.01, [intersect1, road1, 1]);
let car3 = new Car(1250, 25, road1, 1, 0.5, 0.01, [intersect1, road1, 1]);
let car4 = new Car(1300, 25, road1, 1, 0.5, 0.01, [intersect1, road1, 1]);
let car5 = new Car(1400, 25, road1, 1, 0.5, 0.01, [intersect1, road2, -1, intersect2, road1, 1]);
let car6 = new Car(1500, 25, road1, 1, 0.5, 0.01, [intersect1, road2, -1, intersect2, road1, 1]);
let car7 = new Car(1600, 25, road1, 1, 0.5, 0.01, [intersect1, road1, 1]);
let map = { roads: [road1, road2], intersections: [intersect1, intersect2], cars: [car1, car2, car3, car4, car5, car6, car7], sources: [] };

// Set up the canvas and context
let canvas = document.getElementById('game-canvas');
let context = canvas.getContext('2d');
canvas.width = window.innerWidth * .9;
canvas.height = window.innerHeight * .9;
let counter = 0;

// Set up the game loop
function gameLoop() {

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw roads
  for (let road of map.roads) {
    context.beginPath();
    context.moveTo(road.nodes[0].x, road.nodes[0].y);
    for (let roadNode of road.nodes) {
      context.strokeStyle = "lightgray";
      context.lineWidth = 40;
      context.lineTo(roadNode.x, roadNode.y);
      context.stroke();

      context.strokeStyle = road.color;
      context.lineWidth = 5;
      context.lineTo(roadNode.x, roadNode.y);
      context.stroke();
    }
  }

  // Draw intersections
  for (let intersection of map.intersections) {
    context.beginPath();
    context.fillStyle = "purple";
    if (intersection.ruleset[0] == "stop") {
      context.fillStyle = "darkred";
    }
    if (intersection.ruleset[0] == "yield") {
      context.fillStyle = "yellow";
    }
    context.arc(intersection.x, intersection.y, 30, 0, 2 * Math.PI);
    context.fill();
  }

  // Draw cars
  for (let car of map.cars) {
    let brakingDistance = (car.calculateStoppingDistance() + 100);
    let obstacle = car.checkPath(brakingDistance * car.direction);
    context.fillStyle = "black";
    if (obstacle) {
      if (obstacle.isObstacle(car)) {
        car.brake();
        context.fillStyle = "red";
        if (obstacle instanceof Node && obstacle.queue.indexOf(car) == -1) {
          obstacle.queue.push(car);
        }
      } else {
        car.accelerate();
        context.fillStyle = "green";
      }
    } else {
      if (car.speed > (car.road.speedLimit + car.power)) {
        car.brake();
        context.fillStyle = "red";
      } else {
        car.accelerate();
        context.fillStyle = "green";
      }
    }
    car.updatePosition();
    let carNode = car.getXY();
    context.beginPath();
    context.fillRect(carNode.x - (car.size / 2), carNode.y - (car.size / 2), car.size, car.size);
    context.fill();
  }

  // Request the next frame
  window.requestAnimationFrame(gameLoop);
  counter++;
}

// Set up the key listeners
let keys = {};
document.addEventListener('keydown', function (event) {
  keys[event.code] = true;
});
document.addEventListener('keyup', function (event) {
  keys[event.code] = false;
});

// Start the game loop
gameLoop();