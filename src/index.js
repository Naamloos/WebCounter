const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

var rooms = {};

app.use(express.static('public'));

io.on('connection', (socket) => 
{
    socket.on("+", (value) => 
    {
        rooms[socket.id]+=Number(value);
        io.to(socket.id).emit("update", rooms[socket.id]);
        console.log("Increased value for socket " + socket.id + " to " + rooms[socket.id]);
    });

    socket.on("-", (value) => 
    {
        rooms[socket.id]-=Number(value);
        io.to(socket.id).emit("update", rooms[socket.id]);
        console.log("Decreased value for socket " + socket.id + " to " + rooms[socket.id]);
    });

    socket.on("r", () => {
        rooms[socket.id] = 0;
        io.to(socket.id).emit("update", rooms[socket.id]);
        console.log("Reset value for socket " + socket.id + " to " + rooms[socket.id]);
    })

    socket.on("join", (id) => {
        socket.join(id);
    });

    socket.on("host", () => {
        socket.join(socket.id);
        socket.emit("id", socket.id);
        rooms[socket.id] = 0;
    });

    socket.on("disconnected", () => {
        delete rooms[socket.id];
    })

    socket.emit("ready");
});

server.listen(3000, () => 
{ 
    console.log('listening on *:3000');
});