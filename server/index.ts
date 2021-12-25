import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import proxy from 'express-http-proxy';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 4400;
const frontendPort = process.env.FRONTEND_PORT || 4401;
const apiPort = process.env.API_PORT || 4402;
const frontend = proxy(`http://localhost:${frontendPort}`, {});
const api = proxy(`http://localhost:${apiPort}`);

const servlet = http.createServer(app);
const io = new Server(servlet);

mongoose.connect("mongodb://localhost:27017/papyrus_v6_testing", {}, async (err) => {
    if(err) {
        console.log(err);
        app.get("*", (req, res) => {
            res.status(500);
            res.type("text/plain");
            res.send("500 | Could not connect to database. Please try again later.");
        });
    } else {
        console.log("Connected to database!");
        await import("./database/models/UserData");
        io.on("connection", (socket) => {
            console.log(`${socket.id} | Client connected!    | { id: ${socket.id}, ip: ${socket.handshake.address} }`);
            socket.on("request_data", () => {
                const id = "61ba64ed142ea93ba3343990";
                mongoose.model("PRS_UserData").findById(id, (err: string, doc: string) => {
                    if(err) return console.error(err);
                    socket.emit("initialUserData", doc);
                });
            });
            socket.on("disconnect", () => {
                console.log(`${socket.id} | Client disconnected! | { id: ${socket.id}, ip: ${socket.handshake.address} }`);
            });
        });
        // Routes
        app.get("/api", api);
        app.get("/api/*", api);

        app.get("/*", frontend);
    }
    servlet.listen(port, () => {
        console.log(`⚡️ [server] App listening on port ${port} (Frontend on port ${frontendPort}, API on port ${apiPort}).`);
    });
});