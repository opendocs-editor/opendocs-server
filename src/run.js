"use strict";
var _a, _b, _c;
exports.__esModule = true;
var child_process_1 = require("child_process");
var path_1 = require("path");
var proxyProcess = child_process_1["default"].exec("yarn dev", { cwd: path_1["default"].join(__dirname, "proxy") });
(_a = proxyProcess.stdout) === null || _a === void 0 ? void 0 : _a.on("data", function (data_) {
    var data = data_.split("\n");
    for (var i = 0; i < data.length; i++) {
        console.log("[proxy] ".concat(data[i]));
    }
});
if (proxyProcess.stdin)
    process.stdin.pipe(proxyProcess.stdin);
var clientProcess = child_process_1["default"].exec("yarn dev", { cwd: path_1["default"].join(__dirname, "client") });
(_b = clientProcess.stdout) === null || _b === void 0 ? void 0 : _b.on("data", function (data_) {
    var data = data_.split("\n");
    for (var i = 0; i < data.length; i++) {
        console.log("[client] ".concat(data[i]));
    }
});
if (clientProcess.stdin)
    process.stdin.pipe(clientProcess.stdin);
var apiProcess = child_process_1["default"].exec("yarn dev", { cwd: path_1["default"].join(__dirname, "api") });
(_c = apiProcess.stdout) === null || _c === void 0 ? void 0 : _c.on("data", function (data_) {
    var data = data_.split("\n");
    for (var i = 0; i < data.length; i++) {
        console.log("[api] ".concat(data[i]));
    }
});
if (apiProcess.stdin)
    process.stdin.pipe(apiProcess.stdin);
