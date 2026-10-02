let socket = io();

let main = document.querySelector("#main");

let xSlider = document.querySelector("#xSlider");
let ySlider = document.querySelector("#ySlider");
let sizeSlider = document.querySelector("#sizeSlider");
let rotationSlider = document.querySelector("#rotationSlider");

let status = document.querySelector("#status");

let myID;

let shapes= {};

socket.on("yourShape", (data) => {
    myID = data.id;
    status.innerHTML = "Your shape is: " + data.shape;
});

socket.on("currentShapes", (data) => {
    console.log("Received shapes:", data);
    shapes = data;
    drawShapes ();
});

socket.on("shapeUpdate", (data) => {
    shapes[data.id] = data;
    drawShapes ();
});

 socket.on("shapeRemove", (id) => {
    delete shapes[id];
    let element = document.querySelector(`[data-id="${id}"]`);

    if (element) {
      element.remove();
    }
    
  });

xSlider.addEventListener("input", function () {
    sendShapeUpdate();
});

ySlider.addEventListener("input", function () {
    sendShapeUpdate();
});

sizeSlider.addEventListener("input", function () {
    sendShapeUpdate();
});

rotationSlider.addEventListener("input", function () {
    sendShapeUpdate();
});

function sendShapeUpdate() {
    if (!myID) {
        return;
    }

    let shapeData = {
        id: myID,
        x: Number (xSlider.value),
        y: Number (ySlider.value),
        size: Number (sizeSlider.value),
        rotation: Number (rotationSlider.value)
    };

    socket.emit("shapeUpdate", shapeData);
}

function drawShapes () {
    for (let id in shapes) {
        let shape = shapes[id];
        let element= document.querySelector(
            `[data-id="${id}"]`
        );
        
        if (!element) {
            element = document.createElement("div");
            element.dataset.id = id;
            main.appendChild(element);
        }
        element.className = "shape";
        element.classList.add(shape.shape);
        element.style.left = shape.x + "%";
        element.style.top = shape.y + "%";
        element.style.width = shape.size + "px";
        element.style.height = shape.size + "px";
        element.style.backgroundColor="red";
        element.style.transform = `translate(-50%, -50%) rotate(${shape.rotation}deg)`;
    }
}