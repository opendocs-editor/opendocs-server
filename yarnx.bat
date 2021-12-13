@echo off
setlocal

if not exist yarnx-scripts (
    mkdir yarnx-scripts
)

if not exist yarnx (
    curl -sSL https://ci.nosadnile.net/job/YarnExt/lastSuccessfulBuild/artifact/yarnx --output yarnx
)

if not exist yarnx.sha1 (
    curl -sSL https://ci.nosadnile.net/job/YarnExt/lastSuccessfulBuild/artifact/yarnx.sha1 --output yarnx.sha1
)

if not exist yarnx-scripts\script (
    rm -rf yarnx-scripts
    curl -sSL https://ci.nosadnile.net/job/YarnExt/lastSuccessfulBuild/artifact/scripts.zip --output scripts.zip
    tar -xf scripts.zip
)

if not exist yarnx-scripts\PortableGit\bin\bash.exe (
    cd yarnx-scripts
    if not exist PortableGit.exe (
        curl -sSL https://github.com/git-for-windows/git/releases/download/v2.34.1.windows.1/PortableGit-2.34.1-32-bit.7z.exe --output PortableGit.exe
    )
    PortableGit.exe -y
    cd ..
)

yarnx-scripts\PortableGit\bin\bash.exe .\yarnx %*

endlocal