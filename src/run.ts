import childProcess from "child_process";
import path from "path";

const proxyProcess = childProcess.exec("yarn dev", { cwd: path.join(__dirname, "proxy") });
proxyProcess.stdout?.on("data", (data_) => {
    const data = data_.split("\n");
    for(let i = 0; i < data.length; i++) {
        console.log(`[proxy] ${data[i]}`);
    }
});
if(proxyProcess.stdin) process.stdin.pipe(proxyProcess.stdin);

const clientProcess = childProcess.exec("yarn dev", { cwd: path.join(__dirname, "client") });
clientProcess.stdout?.on("data", (data_) => {
    const data = data_.split("\n");
    for(let i = 0; i < data.length; i++) {
        console.log(`[client] ${data[i]}`);
    }
});
if(clientProcess.stdin) process.stdin.pipe(clientProcess.stdin);

const apiProcess = childProcess.exec("yarn dev", { cwd: path.join(__dirname, "api") });
apiProcess.stdout?.on("data", (data_) => {
    const data = data_.split("\n");
    for(let i = 0; i < data.length; i++) {
        console.log(`[api] ${data[i]}`);
    }
});
if(apiProcess.stdin) process.stdin.pipe(apiProcess.stdin);