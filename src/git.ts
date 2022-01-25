import fs from "fs";
import download from "download";
import AdmZip from "adm-zip";

const clone = async (url_: string, branch: string = "master", file: fs.PathLike): Promise<void> => {
    let url = url_;
    if(url.endsWith("/")) url = url.slice(0, -1);
    if(url.includes(".git")) url = url.replace(/(\.git?.*)/gm, `/archive/refs/heads/${branch}.zip`);
    if(!url.endsWith(".zip")) url += `/archive/refs/heads/${branch}.zip`;
    await download(url, file.toString().split("/").slice(0, -1).join("/"), { filename: file.toString().split("/")[file.toString().split("/").length - 1] + ".zip" });
    const zip = new AdmZip(file.toString() + ".zip");
    zip.extractAllTo(file.toString().split("/").slice(0, -1).join("/"));
    fs.renameSync(`${file.toString()}-${branch}`, file.toString());
    return fs.rmSync(file.toString() + ".zip");
};

export default {
    clone
};