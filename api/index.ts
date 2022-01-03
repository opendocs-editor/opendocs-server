import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const version = {
    backend: "0.3.2.0-alpha-2021-12-14",
    frontend: "0.2.1.0-alpha-2021-12-14",
    api: "0.1.0.0-alpha-2021-12-14",
    database: "5.0.5",
    node: "16.13.1",
    npm: "8.1.2",
    yarn: "1.22.17",
    httpd: "apache-2.4.41",
    ts_node: "10.4.0",
    typescript: "4.5.2",
};

interface FlexableObject {
    [key: string]: any
}

export interface UserObject {
    name?: string,
    username?: string,
    email?: string,
    pwhash?: string,
    pwsalt?: string
}

const app = express();
const port = process.env.PORT || 4502;

const servlet = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/opendocs_api_testing", {}, async (err) => {
    if(err) {
        console.log(err);
        app.get("*", (req, res) => {
            res.status(500);
            res.type("text/plain");
            res.send("500 | Could not connect to database. Please try again later.");
        });
    } else {
        console.log("Connected to database!");
        const user = await import("./src/db/UserModel");
        // Routes
        app.get("/api/v1/version", (req, res) => {
            if(req.query.type == "text" || req.query.type == "plaintext") {
                if(req.query.module == "backend") {
                    res.status(200);
                    res.type("text/plain");
                    res.send(version.backend);
                } else if(req.query.module == "frontend") {
                    res.status(200);
                    res.type("text/plain");
                    res.send(version.frontend);
                } else if(req.query.module == "api") {
                    res.status(200);
                    res.type("text/plain");
                    res.send(version.api);
                } else {
                    res.status(400);
                    res.type("text/plain");
                    res.send("400 | Bad request.\nPossible fixes:\n    Include parameters: [ type, module ]\n        Parameter \"type\" possible values: [ text, plaintext, json ]\n            Required: true\n        Parameter \"module\" possible values: [ frontend, backend, api ]\n            Required: false");
                }
            } else if(req.query.type == "json") {
                if(req.query.module == "backend") {
                    res.status(200);
                    res.type("application/json");
                    res.send(JSON.stringify({ version: version.backend }, null, 4));
                } else if(req.query.module == "frontend") {
                    res.status(200);
                    res.type("application/json");
                    res.send(JSON.stringify({ version: version.frontend }, null, 4));
                } else if(req.query.module == "api") {
                    res.status(200);
                    res.type("application/json");
                    res.send(JSON.stringify({ version: version.api }, null, 4));
                } else {
                    res.status(200);
                    res.type("application/json");
                    res.send(JSON.stringify({ version: { opendocs: { backend: version.backend, frontend: version.frontend, api: version.api }, database: version.database, node: version.node, npm: version.npm, yarn: version.yarn, tsc: version.typescript, "ts-node": version.ts_node, apache: version.httpd } }, null, 4));
                }
            } else {
                res.status(400);
                res.type("text/plain");
                res.send("400 | Bad request.\nPossible fixes:\n    Include parameters: [ type, module ]\n        Parameter \"type\" possible values: [ text, plaintext, json ]\n            Required: true\n        Parameter \"module\" possible values: [ frontend, backend, api ]\n            Required: false");
            }
        });

        app.get("/api/auth", (req, res) => { res.status(400).type("text/plain").send("400 | Method not allowed."); });

        app.post("/api/auth", async (req, res) => {
            if(!req.body) return res.status(400).type("text/plain").send("400 | Bad request.");
            const action = req.body.action;
            if(!action) return res.status(400).type("text/plain").send("400 | Bad request.");
            if(action == "login") {
                const username = req.body.user;
                const password = req.body.pass;
                if(!username || !password) return res.status(400).type("text/plain").send("400 | Bad request.");
                user.default.findOne({ username: username }, (err: mongoose.Error, u: FlexableObject) => {
                    if(err) return res.status(500).type("text/plain").send("500 | An internal error occured.");
                    if(u == null) return res.status(400).type("text/plain").send("400 | User not found.");
                    if(u.validPassword(password, u.pwsalt, u.pwhash)) {
                        const u2: UserObject = u;
                        u2.pwhash = "[Hidden for security]";
                        u2.pwsalt = "[Hidden for security]";
                        return res.status(201).type("application/json").send(u2);
                    }
                    return res.status(400).type("text/plain").send("400 | Invalid password.");
                });
            } else if(action == "register") {
                const username = req.body.user;
                const password = req.body.pass;
                const name = req.body.name;
                const email = req.body.email;
                if(!username || !password || !name || !email) return res.status(400).type("text/plain").send("400 | Bad request.");
                user.default.findOne({ username: username }, (err: mongoose.Error, u: FlexableObject) => {
                    if(err) return res.status(500).type("text/plain").send("500 | An internal error occured.");
                    if(!u) {
                        const newUser = new user.default();
                        newUser.name = name;
                        newUser.username = username;
                        newUser.email = email;
                        newUser.save((err: mongoose.Error, uu: FlexableObject) => {
                            if(err) return res.status(500).type("text/plain").send("500 | An internal error occured.");
                            user.setPassword(uu._id, password, (err, u: FlexableObject) => {
                                if(err) return res.status(500).type("text/plain").send("500 | An internal error occured.");
                                const u2: UserObject = u;
                                u2.pwhash = "[Hidden for security]";
                                u2.pwsalt = "[Hidden for security]";
                                return res.status(201).type("application/json").send(u2);
                            });
                        });
                    } else {
                        return res.status(400).type("text/plain").send("400 | User already exists!");
                    }
                });
            }
        });

        app.get("/api", (req, res) => { res.status(404).type("text/plain").send("404 | Route not found."); });
        app.get("/api/*", (req, res) => { res.status(404).type("text/plain").send("404 | Route not found."); });
    }
    servlet.listen(port, () => {
        console.log(`⚡️ [api] App listening on port ${port}.`);
    });
});