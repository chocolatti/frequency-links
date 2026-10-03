'use strict';

const socketIO = require('socket.io');
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public','/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(port, () => {
  console.log("Listening on port: " + port);
});

const io = socketIO(server);

let shapes = {};

const shapeTypes = ["circle", "square", "triangle", "diamond" ];

io.on('connection', (socket) => {
  console.log (
    "client connected:",
    socket.id
  );

  let shape=shapeTypes [
        Object.keys (shapes).length
        % shapeTypes.length
  ];

  shapes [socket.id] = {
    id:socket.id,
    shape: shape,
    x: 50,
    y: 50,
    size: 80,
    rotation: 0
  };

  console.log("ALL SHAPES:", shapes);

  socket.emit("yourShape", {
    id:socket.id,
    shape: shape
});


socket.emit("currentShapes", shapes);

io.emit("shapeUpdate", shapes[socket.id]);

socket.on("shapeUpdate", (data) => {

  shapes[socket.id].x = data.x;
  shapes[socket.id].y = data.y;
  shapes[socket.id].size = data.size;
  shapes[socket.id].rotation = data.rotation;

  io.emit ("shapeUpdate", shapes[socket.id]);

});

  socket.on('disconnect', () => { console.log('Client disconnected:', socket.id);

  delete shapes[socket.id];

  io.emit("shapeRemove", socket.id);
  });

});
 
