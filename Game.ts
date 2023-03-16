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
// const source1 = new SpecialRoadNode(300, 600, "source", []);
// const source2 = new SpecialRoadNode(1300, 600, "source", []);
// const collector1 = new SpecialRoadNode(800, 1100, "collector", []);
const road1 = new Road([intersect1, intersect4, intersect3, intersect2, intersect1], 0.5, "yellow");
road1.roadEnd = road1;

const road2 = new Road([intersect1, new RoadNode(300, 600)], 1, "blue");
const road3 = new Road([intersect2, new RoadNode(800, 1100)], 1, "blue");
const road4 = new Road([intersect3, new RoadNode(1300, 600)], 1, "blue");
const road5 = new Road([intersect4, new RoadNode(800, 100)], 1, "blue");

intersect1.ruleset = ["yield", road1, -200];
intersect2.ruleset = ["yield", road1, -200];
intersect3.ruleset = ["yield", road1, -200];
intersect4.ruleset = ["yield", road1, -200];
// source1.ruleset = [road2.positionOfNode(source1)[0], road2, -1, 0, 0.01, 25, [intersect1, road1, 1, intersect2, road3, 1]];
// source2.ruleset = [road4.positionOfNode(source2)[0], road4, -1, 0, 0.01, 25, [intersect3, road1, 1, intersect2, road3, 1]];
// collector1.ruleset = [road3, 150, 275];

const car1 = new Car(150, road2, -1, 0, 0.01, 25, [intersect1, road1, 1, intersect2, road3, 1]);
const car2 = new Car(150, road4, -1, 0, 0.01, 25, [intersect3, road1, 1, intersect4, road5, 1]);

const roads = [road1, road2, road3, road4, road5];
const intersections = [intersect1, intersect2, intersect3, intersect4]
const cars = [];
const events = ["source", 300, road2, -1, 0, 0.01, 25, [intersect1, road1, 1, intersect2, road3, 1], "source", 300, road4, -1, 0, 0.01, 25, [intersect3, road1, 1, intersect2, road3, 1], "collect", road3, 150, 275];
const trafficMap = new TrafficMap(roads, intersections, cars, events);

// Set up the canvas and context
let canvas = document.getElementById('game-canvas');
let context = canvas.getContext('2d');
canvas.width = window.innerWidth * .9;
canvas.height = window.innerHeight * .9;
let counter = 0;
let carCounter1 = 0;

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
    //     if (trafficMap.checkPathForCars(source.ruleset[1], source.ruleset[0], -250) == undefined) {
    //         const newCar = new Car(source.ruleset[0], source.ruleset[1], source.ruleset[2], source.ruleset[3], source.ruleset[4], source.ruleset[5], source.ruleset[6]);
    //         trafficMap.cars.push(newCar);
    //     }
    // }

    // for (let collector of trafficMap.collectors) {
    //     let car = trafficMap.checkPathForCars(collector.ruleset[0], collector.ruleset[1], collector.ruleset[2]);
    //     if (car instanceof Car){
    //         trafficMap.cars.splice(trafficMap.cars.indexOf(car), 1);
    //         carCounter1++;
    //     }
    // }

    for (let i = 0; i < trafficMap.events.length; i += 0) {
        if (trafficMap.events[i] == "source") {
            const position = trafficMap.events[i + 1];
            const road = trafficMap.events[i + 2];
            const direction = trafficMap.events[i + 3];
            const speed = trafficMap.events[i + 4];
            const power = trafficMap.events[i + 5];
            const size = trafficMap.events[i + 6];
            const ruleset = trafficMap.events[i + 7];
            const newCar = new Car(position, road, direction, speed, power, size, ruleset);
            if (trafficMap.checkPathForCars(road, position, -250) == undefined){
            trafficMap.cars.push(newCar);
            }
            i += 8;
        } else if (trafficMap.events[i] == "collect") {
            const car = trafficMap.checkPathForCars(trafficMap.events[i + 1], trafficMap.events[i + 2], trafficMap.events[i + 3]);
            if (car instanceof Car) {
                trafficMap.cars.splice(trafficMap.cars.indexOf(car), 1);
                carCounter1++;
            }
            i += 4;
        }
    }


    // Draw cars
    for (let car of trafficMap.cars) {
        let brakingDistance = (car.calculateStoppingDistance() + 100);
        let obstacle = trafficMap.checkCarPath(car, brakingDistance * car.direction);
        context.fillStyle = "black";
        if (obstacle instanceof Car) {
            car.brake();
            context.fillStyle = "red";
        } else if (obstacle instanceof IntersectionRoadNode) {
            if (trafficMap.isObstacle(obstacle, car)) {
                car.brake();
                context.fillStyle = "red";
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

    context.fillStyle = "black";
    context.beginPath();
    context.font = "48px serif";
    context.fillText(carCounter1, 10, 50);

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