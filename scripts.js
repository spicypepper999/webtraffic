//classes

//
//
class Node {
  constructor(x,y, isIntersection, ruleset){
    this.x = x;
    this.y = y;
    this.isIntersection = isIntersection;
    this.ruleset = ruleset;
    this.queue = [];
    this.currentVehicle;
  }
  set x(value){
    this._x = value;
  }
  get x(){
    return this._x;
  }
  set y(value){
    this._y = value;
  }
  get y(){
    return this._y;
  }
  set isIntersection(value){
    this._isIntersection = value;
  }
  get isIntersection(){
    return this._isIntersection;
  }
  set ruleset(value){
    this._ruleset = value;
  }
  get ruleset(){
    return this._ruleset;
  }
  set queue(value){
    this._queue = value;
  }
  get queue(){
    return this._queue;
  }
  set currentVehicle(value){
    this._currentVehicle = value;
  }
  get currentVehicle(){
    return this._currentVehicle;
  }
  distanceXTo(node){
    let distanceX = this._x - node.x;
    return distanceX;
  }
  distanceYTo(node){
    let distanceY = this._y - node.y;
    return distanceY;
  }
  distanceTo(node){
    let distanceX = this.distanceXTo(node);
    let distanceY = this.distanceYTo(node);
    let distance = Math.sqrt((distanceX**2)+(distanceY**2));
    return distance;
  }
  directionTo(node){
    let direction = Math.atan2(this.distanceYTo(node),this.distanceXTo(node));
    return direction;
  }
  setXY(x,y){
    this._x = x;
    this._y = y;
  }
  setXY(node){
    this._x = node.x;
    this._y = node.y;
  }
  isObstacle(car){
    if(this._ruleset == "stop"){
      if((car.speed == 0 && this._queue[this._queue.length - 1] == car) || this._currentVehicle == car){
        this._currentVehicle = car;
        if(this.distanceTo(car.road.XYFromPosition(car.position)) < car.speed){
          this._queue.pop();
          for(let i = 0; i < car.ruleset.length; i += 4){
            let intersect = car.ruleset[i];
            let nextNode = car.ruleset[i+1];
            let nextRoad = car.ruleset[i+2];
            let direction = car.ruleset[i+3];
            if(intersect == this && nextNode == this){
              car.road = nextRoad;
              car.direction = direction;
              car.position = nextRoad.positionOfNode(nextNode)[0];
            }
          }
        }
        return false;
      }else{
        return true;
      }
    }
  }
}
//
//


//
//
class Road {
  constructor(nodes, roadEnd, speedLimit, color){
    this.nodes = nodes;
    this.roadEnd = roadEnd;
    this.speedLimit = speedLimit;
    this.color = color;
  }
  set nodes(value){
    this._nodes = value;
  }
  get nodes() {
    return this._nodes;
  }
  set roadEnd(value){
    this._roadEnd = value;
  }
  get roadEnd() {
    return this._roadEnd;
  }
  set speedLimit(value){
    this._speedLimit = value;
  }
  get speedLimit() {
    return this._speedLimit;
  }
  set color(value){
    this._color = value;
  }
  get color() {
    return this._color;
  }
  XYFromPosition(position){
    let node = new Node(0,0);
    if(position <= 0){
      node.setXY(this._nodes[0]);
      return node;
    }
    if(position > this.length()){
      if(Object.keys(this._roadEnd).length > 0){
        node.setXY(this._roadEnd.XYFromPosition(position - this.length()));
        return node;
      }else{
      node.setXY(this._nodes[this._nodes.length-1]);
      return node;
      }
    }
    let distanceLeft = position;
    node.setXY(this._nodes[0]);
    for(let i = 1; i < this._nodes.length && distanceLeft > 0; i++){
      if(distanceLeft < node.distanceTo(this._nodes[i])){
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
  length(){
  let length = 0;
  let nodeCompare = this._nodes[0];
  for(let node of this._nodes){
      length += node.distanceTo(nodeCompare);
      nodeCompare = node;
    }
    return length;
  }
  positionOfNode(node){
    let positions = [];
    let position = 0;
    let nodePrevious = this._nodes[0];
      for(let nodeCompare of this._nodes){
        position += nodePrevious.distanceTo(nodeCompare);
        if(node == nodeCompare){
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
  constructor(position,size,road,direction,speed,power,ruleset) {
    this.position = position;
    this.size = size;
    this.road = road;
    this.direction = direction;
    this.speed = speed;
    this.power = power;
    this.ruleset = ruleset;
  }
  set position(value){
    this._position = value;
  }
  get position(){
    return this._position;
  }
  set size(value){
    this._size = value;
  }
  get size(){
    return this._size;
  }
  set road(value){
    this._road = value;
  }
  get road(){
    return this._road;
  }
  set direction(value){
    this._direction = value;
  }
  get direction(){
    return this._direction;
  }
  set speed(value){
    this._speed = value;
  }
  get speed(){
    return this._speed;
  }
  set power(value){
    this._power = value;
  }
  get power(){
    return this._power;
  }
  set ruleset(value){
    this._ruleset = value;
  }
  get ruleset(){
    return this._ruleset;
  }
  getXY(){
    let node = this._road.XYFromPosition(this._position);
    return node;
  }
  updatePosition(){
    this._position += (this._speed * this._direction);
    if(this._position > this._road.length() && Object.keys(this._road._roadEnd).length > 0){
      this._position -= this._road._roadEnd.length();
    }
  }
  //checks if specified distance in front of car is clear of any other cars and intersections, returns the object if one is found
  checkPath(distance){
    let detected;
      for(let car of map.cars){
        if((car != this) && (car.road == this._road)){
          if(distance > 0 && (car.position-this._position) <= distance && (car.position-this._position) >= 0){
            detected = car;
            return detected;
          }else if (distance < 0 && (car.position-this._position) >= distance && (car.position-this._position) <= 0){
            detected = car;
            return detected;
          }
        }
      }
      for(let node of this._road.nodes){
        let closestPosition = Number.MAX_VALUE;
        for(let position of this._road.positionOfNode(node)){
          if (Math.abs(position - this._position) < Math.abs(closestPosition)){
            closestPosition = position - this._position;
          }
        }
        if(distance > 0 && closestPosition <= distance && closestPosition >= 0 && node.isIntersection){
          detected = node;
          return detected;
        }else if (distance < 0 && closestPosition >= distance && closestPosition <= 0 && node.isIntersection){
          detected = node;
          return detected;
        }
      }

    return detected;
  }
  calculateStoppingDistance(){
    let distance = 0;
    distance = (this._speed**2)/(this._power*2);
    return distance;
  }
  calculateStoppingDistanceToCar(car){
    let distance = 0;
    distance = ((this._speed-car.speed)**2)/(this._power*2);
    return distance;
  }
  brake(){
    if(this._speed > 0){
      this._speed -= this._power;
    }
    if(this._speed < 0){
      this._speed = 0;
    }
  }
  accelerate(){
    if(this._speed < this._road.speedLimit){
      this._speed += this._power;
    }
  }
  isObstacle(car){
    return true;
  }
}
//
//


//THIS IS WHERE WE INITIALIZE STUFF!!!
//drawing road
let intersect1 = new Node(500, 300, true, "stop");
let intersect2 = new Node(500, 1000, true, "stop");
let road1 = new Road([intersect1, new Node(700,300), new Node(1100,700), new Node(1300,900), new Node(1300, 1000), intersect2, intersect1], "", 2, "blue")
road1.roadEnd = road1;

let road2 = new Road([intersect2, new Node(200,1000), new Node(200,300), intersect1],"", 1, "red");

let roads = [road1, road2];

intersect1.roads = [road1, road2];
intersect2.roads = [road1, road2];

let car1 = new Car(1000,25,road1, 1, 0.5, 0.01, [intersect1, road2.nodes[3], road2, -1, intersect2, road1.nodes[5], road1, 1]);
let car2 = new Car(1100,25,road1, 1, 0.5, 0.01, [intersect1, road1.nodes[0], road1, 1]);
let car3 = new Car(1250,25,road1, 1, 0.5, 0.01, [intersect1, road1.nodes[0], road1, 1]);
let car4 = new Car(1300,25,road1, 1, 0.5, 0.01, [intersect1, road1.nodes[0], road1, 1]);
let car5 = new Car(1400,25,road1, 1, 0.5, 0.01, [intersect1, road2.nodes[3], road2, -1, intersect2, road1.nodes[5], road1, 1]);
let map = {roads, intersections : [intersect1, intersect2], cars : [car1, car2, car3, car4, car5]};

// Set up the canvas and context
let canvas = document.getElementById('game-canvas');
let context = canvas.getContext('2d');
canvas.width = window.innerWidth * .9;
canvas.height = window.innerHeight * .9;

// Set up the game loop
function gameLoop() {

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw roads
  for(let road of map.roads){
    context.beginPath();
    context.moveTo(road.nodes[0].x,road.nodes[0].y);
    for(let roadNode of road.nodes){
    context.strokeStyle = "lightgray";
    context.lineWidth = 40;
    context.lineTo(roadNode.x,roadNode.y);
    context.stroke();

    context.strokeStyle = road.color;
    context.lineWidth = 5;
    context.lineTo(roadNode.x,roadNode.y);
    context.stroke();
    }
  }

  // Draw intersections
  for(let intersection of map.intersections){
  context.beginPath();
  context.fillStyle = "purple";
  context.arc(intersection.x, intersection.y, 30, 0, 2 * Math.PI);
  context.fill();
  }

  // Draw cars
  //temp let
  for(let car of map.cars){
    let brakingDistance = (car.calculateStoppingDistance() + 100);
    let obstacle = car.checkPath(brakingDistance * car.direction);
    context.fillStyle = "black";
    if(obstacle){
      if(obstacle.isObstacle(car)){
        if(obstacle instanceof Car){
        brakingDistance = (car.calculateStoppingDistanceToCar(obstacle) + 100);
        }
        context.fillStyle = "red";
        car.brake();
      }else{
        car.accelerate();
        context.fillStyle = "green";
      }
      if(obstacle instanceof Node && obstacle.queue.indexOf(car) == -1 && obstacle.distanceTo(car.road.XYFromPosition(car.position)) > car.speed){
        obstacle.queue.push(car);
      }
    }else{
      if(car.speed > (car.road.speedLimit + car.power)){
        car.brake();
        context.fillStyle = "red";
      }else{
      car.accelerate();
      context.fillStyle = "green";
      }
    }
    car.updatePosition();
    let carNode = car.getXY();
    context.beginPath();
    context.fillRect(carNode.x-(car.size/2),carNode.y-(car.size/2),car.size,car.size);
    context.fill();
  }

  // Request the next frame
  window.requestAnimationFrame(gameLoop);
}

// Set up the key listeners
let keys = {};
document.addEventListener('keydown', function(event) {
  keys[event.code] = true;
});
document.addEventListener('keyup', function(event) {
  keys[event.code] = false;
});

// Start the game loop
gameLoop();