import path from "path";
import childProcess from "child_process";
import git from "./git";
import fs from "fs";

const main = async () => {
    if(!fs.existsSync(path.join(__dirname, "../app"))) fs.mkdirSync(path.join(__dirname, "../app"));
    console.log("Cloning proxy...");
    await git.clone("https://github.com/opendocs-editor/proxy", "main", path.join(__dirname, "../app/proxy"));
    console.log("Cloning client...");
    await git.clone("https://github.com/opendocs-editor/client", "main", path.join(__dirname, "../app/client"));
    console.log("Cloning api...");
    await git.clone("https://github.com/opendocs-editor/api", "main", path.join(__dirname, "../app/api"));
    console.log("Done!");
    console.log("Installing... [proxy]");
    childProcess.execSync("yarn install; exit 0", { cwd: path.join(__dirname, "../app/proxy") });
    console.log("Installing... [client]");
    childProcess.execSync("yarn install; exit 0", { cwd: path.join(__dirname, "../app/client") });
    console.log("Installing... [api]");
    childProcess.execSync("yarn install; exit 0", { cwd: path.join(__dirname, "../app/api") });
    console.log("Installed!");
    fs.writeFileSync(path.join(__dirname, "../app/opendocs"), `#!/usr/local/bin/node\n${fs.readFileSync(path.join(__dirname, "run.js"))}`);
    childProcess.execSync("chmod +x opendocs", { cwd: path.join(__dirname, "../app") });
    console.log(`Success! OpenDocs self-hosted server is now installed at ${path.join(__dirname, "../app").toString()}!`);
    console.log(`Start it by running the "opendocs" binary inside that folder.`);
}

main();
