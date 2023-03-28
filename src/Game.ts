import { RoadNode } from "./RoadNode.js"
import { IntersectionRoadNode } from "./IntersectionRoadNode.js"
import { Car } from "./Car.js"
import { Road } from "./Road.js"
import { TrafficMap } from "./TrafficMap.js"

//THIS IS WHERE WE INITIALIZE STUFF!!!
//drawing road

const map = 0;
const minDistance = 100;

if (map == 0){

const intersect1 = new IntersectionRoadNode(400, 600, []);
const intersect2 = new IntersectionRoadNode(600, 800, []);
const intersect3 = new IntersectionRoadNode(800, 600, []);
const intersect4 = new IntersectionRoadNode(600, 400, []);
const road1 = new Road([intersect1, intersect4, intersect3, intersect2, intersect1], 0.75, "yellow");
road1.roadEnd = road1;

const road2 = new Road([intersect1, new RoadNode(100, 600)], 0.75, "blue");
const road3 = new Road([intersect2, new RoadNode(600, 1100)], 0.75, "blue");
const road4 = new Road([intersect3, new RoadNode(1100, 600)], 0.75, "blue");
const road5 = new Road([intersect4, new RoadNode(600, 100)], 0.75, "blue");

intersect1.ruleset = ["yield", road1, -220];
intersect2.ruleset = ["yield", road1, -220];
intersect3.ruleset = ["yield", road1, -220];
intersect4.ruleset = ["yield", road1, -220];

//
//i dont like the manually setting yield distance vibe 
//

//const car1 = new Car(150, road2, -1, 0, 0.01, 25, [intersect1, road1, 1, intersect2, road3, 1]);
//const car2 = new Car(150, road4, -1, 0, 0.01, 25, [intersect3, road1, 1, intersect4, road5, 1]);

const roads = [road1, road2, road3, road4, road5];
const intersections = [intersect1, intersect2, intersect3, intersect4];
const cars = [];
const events = ["source", 500, 300, road2, -1, 0, 0.01, 25, [intersect1, road1, 1, intersect2, road3, 1], "source", 500, 300, road4, -1, 0, 0.01, 25, [intersect3, road1, 1, intersect2, road3, 1], "source", 500, 300, road5, -1, 0, 0.01, 25, [intersect4, road1, 1, intersect2, road3, 1], "collect", road3, 150, 275];
const trafficMap1 = new TrafficMap(roads, intersections, cars, events);

const intersect5 = new IntersectionRoadNode(1700, 600, ["stop"]);
const road6 = new Road([intersect5, new RoadNode(1400, 600)], 0.75, "blue");
const road7 = new Road([intersect5, new RoadNode(1700, 900)], 0.75, "blue");
const road8 = new Road([intersect5, new RoadNode(2000, 600)], 0.75, "blue");
const road9 = new Road([intersect5, new RoadNode(1700, 300)], 0.75, "blue");

const roads2 = [road6, road7, road8, road9];
const intersections2 = [intersect5];
const cars2 = [];
const events2 = ["source", 500, 300, road6, -1, 0, 0.01, 25, [intersect5, road7, 1], "source", 500, 300, road8, -1, 0, 0.01, 25, [intersect5, road7, 1], "source", 500, 300, road9, -1, 0, 0.01, 25, [intersect5, road7, 1], "collect", road7, 150, 275];
const trafficMap2 = new TrafficMap(roads2, intersections2, cars2, events2);

const trafficMaps = [trafficMap1, trafficMap2];

}
if (map == 1){

    const intersect1 = new IntersectionRoadNode(500, 300, []);
    const intersect2 = new IntersectionRoadNode(500, 1000, []);
    const road1 = new Road([intersect1, new RoadNode(700, 300), new RoadNode(1100, 700), new RoadNode(1300, 900), new RoadNode(1300, 1000), intersect2, intersect1], 2, "blue")
    road1.roadEnd = road1;
    
    const road2 = new Road([intersect2, new RoadNode(200, 1000), new RoadNode(200, 300), intersect1], 1, "red");
    
    intersect1.ruleset = ["stop"];
    intersect2.ruleset = ["yield", road1, -600];
    
    const car1 = new Car(1005, road1, 1, 0.5, 0.01, 25, [intersect1, road2, -1, intersect2, road1, 1]);
    const car2 = new Car(1100, road1, 1, 0.5, 0.01, 25, [intersect1, road1, 1]);
    const car3 = new Car(1250, road1, 1, 0.5, 0.01, 25, [intersect1, road1, 1]);
    const car4 = new Car(1300, road1, 1, 0.5, 0.01, 25, [intersect1, road1, 1]);
    const car5 = new Car(1400, road1, 1, 0.5, 0.01, 25, [intersect1, road2, -1, intersect2, road1, 1]);
    const car6 = new Car(1500, road1, 1, 0.5, 0.01, 25, [intersect1, road2, -1, intersect2, road1, 1]);
    const car7 = new Car(1600, road1, 1, 0.5, 0.01, 25, [intersect1, road1, 1]);
    const cars = [car1, car2, car3, car4, car5, car6, car7];
    const roads = [road1, road2];
    const intersections = [intersect1, intersect2];
    const events = [];
    const trafficMap = new TrafficMap(roads, intersections, cars, events);
    const trafficMaps = [trafficMap];

}

// Set up the canvas and context
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;
canvas.width = window.innerWidth * .9;
canvas.height = window.innerHeight * .9;
let counter = 0;

const image = new Image();
image.src = './carImage.png';

let shittyCounter = 0;
//this will be removed

// let carCounter1 = 0;
// let carCounter2 = 0;

// Set up the game loop
function gameLoop() {

    // Clear the canvas
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, canvas.width, canvas.height);


    for(let trafficMap of trafficMaps){
        shittyCounter++;

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

    for (let i = 0; i < trafficMap.events.length; i += 0) {
        if (trafficMap.events[i] == "source") {
            const timer = trafficMap.events[i + 1];
            const position = trafficMap.events[i + 2];
            const road = trafficMap.events[i + 3];
            const direction = trafficMap.events[i + 4];
            const speed = trafficMap.events[i + 5];
            const power = trafficMap.events[i + 6];
            const size = trafficMap.events[i + 7];
            const ruleset = trafficMap.events[i + 8];
            if (trafficMap.checkPathForCars(road, position, -100) == undefined && counter % timer == 0){
                //
                //ARBITRARY NUMBER ALERT!!!
                //
            const newCar = new Car(position, road, direction, speed, power, size, ruleset);
            trafficMap.cars.push(newCar);
            }
            i += 9;
        } else if (trafficMap.events[i] == "collect") {
            const car = trafficMap.checkPathForCars(trafficMap.events[i + 1], trafficMap.events[i + 2], trafficMap.events[i + 3]);
            if (car instanceof Car) {
                car.road.cars.splice(car.road.cars.indexOf(car), 1);
                trafficMap.cars.splice(trafficMap.cars.indexOf(car), 1);
                trafficMap.counter++;
            }
            i += 4;
        }
    }

    // Draw cars
    for (let car of trafficMap.cars) {
        let brakingDistance = (car.calculateStoppingDistance() + minDistance);
        let obstacle = trafficMap.checkCarPath(car, brakingDistance * car.direction);
        context.fillStyle = "black";
        if(trafficMap.isObstacle(obstacle, car)){
            car.brake();
            context.fillStyle = "red";
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
        let carXYDir = car.getXYDir();
        context.beginPath();
        context.translate(carXYDir[0].x, carXYDir[0].y);
       context.rotate(carXYDir[1]);
       context.fillRect((car.size / 2)*-1, (car.size / 2)*-1, car.size, car.size);
       context.drawImage(image, ((car.size / 2)*-1) - 10, (car.size / 2)*-1, car.size + 10, car.size);
       context.setTransform(1, 0, 0, 1, 0, 0);
    }

    context.fillStyle = "black";
    context.beginPath();
    context.font = "48px serif";

    // context.fillText(carCounter1, 10, 50);
    // context.fillText(carCounter2, 1200, 50);

    if(shittyCounter % 2 == 0){
    context.fillText(trafficMap.counter, 1200, 50);
    }else{
    context.fillText(trafficMap.counter, 10, 50);
    }

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