import { RoadNode } from "./RoadNode.js"
import { IntersectionRoadNode } from "./IntersectionRoadNode.js"
import { Car } from "./Car.js"
import { Road } from "./Road.js"
import { TrafficMap } from "./TrafficMap.js"

//THIS IS WHERE WE INITIALIZE STUFF!!!
//drawing road
const intersect1 = new IntersectionRoadNode(600, 600, "yield");
const intersect2 = new IntersectionRoadNode(800, 800, "yield");
const intersect3 = new IntersectionRoadNode(1000, 600, "yield");
const intersect4 = new IntersectionRoadNode(800, 400, "yield");
//let road1 = new Road([intersect1, intersect2, intersect3, intersect4, intersect1], "", 1, "yellow");
const road1 = new Road([intersect1, intersect4, intersect3, intersect2, intersect1], 1, "yellow");
road1.roadEnd = road1;

// const source1 = new Node(300, 600, "source");
// const source2 = new Node(1300, 600, "source");
// const collect1 = new Node(800, 1100, "collector");
// const collect2 = new Node(800, 100, "collector");
// const road2 = new Road([intersect1, source1], 2, "blue");
// const road3 = new Road([intersect2, collect1], 2, "blue");
// const road4 = new Road([intersect3, source2], 2, "blue");
// const road5 = new Road([intersect4, collect2], 2, "blue");

const road2 = new Road([intersect1, new RoadNode(300,600)], 2, "blue");
const road3 = new Road([intersect2, new RoadNode(800,1100)], 2, "blue");
const road4 = new Road([intersect3, new RoadNode(1300,600)], 2, "blue");
const road5 = new Road([intersect4, new RoadNode(800,100)], 2, "blue");

intersect1.ruleset = ["yield", road1, -200];
intersect2.ruleset = ["yield", road1, -200];
intersect3.ruleset = ["yield", road1, -200];
intersect4.ruleset = ["yield", road1, -200];

const car1 = new Car(150, road2, -1, 0, 0.01, 25, [intersect1, road1, 1, intersect2, road3, 1]);
const car2 = new Car(150, road4, -1, 0, 0.01, 25, [intersect3, road1, 1, intersect4, road5, 1]);
//source1.ruleset = [new Car(150, road2, -1, 0, 0.01, 25, [intersect1, road1, 1, intersect2, road3, 1]), 1000];
// const ruleset1 = { position: 150, size: 25, road: road2, direction: -1, speed: 0, power: 0.01, ruleset: [intersect1, road1, 1, intersect2, road3, 1] };
//source2.ruleset = [new Car(150, road4, -1, 0, 0.01, 25, [intersect3, road1, 1, intersect4, road5, 1]), 1000];
// const ruleset2 = { position: 150, size: 25, road: road4, direction: -1, speed: 0, power: 0.01, ruleset: [intersect3, road1, 1, intersect4, road5, 1] };

//const map = { roads: [road1, road2, road3, road4, road5], intersections: [intersect1, intersect2, intersect3, intersect4], cars: [], sources: [source1], collectors: [collect1, collect2]};
const roads = [road1, road2, road3, road4, road5];
const intersections = [intersect1, intersect2, intersect3, intersect4]
const cars = [car1, car2];
const trafficMap = new TrafficMap(roads, intersections, cars);

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
    for (let road of trafficMap.roads) {
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
    for (let intersection of trafficMap.intersections) {
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

    // for (let source of trafficMap.sources) {
    //     if (counter % source.ruleset[1] == 0) {
    //         const newCar = new Car(ruleset1.position, ruleset1.size, ruleset1.road, ruleset1.direction, ruleset1.speed, ruleset1.power, ruleset1.ruleset);
    //         map.cars.push(newCar);
    //     }
    // }

    // Draw cars
    for (let car of trafficMap.cars) {
        let brakingDistance = (car.calculateStoppingDistance() + 100);
        let obstacle = trafficMap.checkCarPath(car, brakingDistance * car.direction);
        context.fillStyle = "black";
        if (obstacle) {
            if (obstacle.isObstacle(car)) {
                car.brake();
                context.fillStyle = "red";
                if (obstacle instanceof IntersectionRoadNode && obstacle.queue.indexOf(car) == -1) {
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
        trafficMap.updatePosition(car);
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