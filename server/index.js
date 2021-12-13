const express = require("express");
const http = require("http");
const httpProxy = require("express-http-proxy");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 9580;
const frontendPort = process.env.FRONTEND_PORT || 9581;

const app = express();
const servlet = http.createServer(app);
const io = new Server(servlet);

const frontend = httpProxy("http://localhost:" + frontendPort);

var online = 0;

io.on("connection", (socket) => {
    var clientIp = socket.handshake.address;
    var clientId = socket.id;
    online++;
    console.log(`${clientId} | Client connected!    | Info: { id: ${clientId}, ip: ${clientIp}, online: ${online} }`);
    io.emit("online", { online: online });
    socket.on("disconnect", () => {
        online--;
        console.log(`${clientId} | Client disconnected! | Info: { id: ${clientId}, ip: ${clientIp}, online: ${online} }`);
        io.emit("online", { online: online });
    });
});

app.get("/*", frontend);

servlet.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});