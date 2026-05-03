const fs = require("fs");

const path = process.argv[2];

fs.copyFileSync(path + "/Sensory Overload Playtest.pck", "./bin/game.pck");

const { execSync } = require('child_process');

execSync("cd ./bin && gdre_tools.exe --headless --recover=./game.pck --output=../project");

//do the modding

try {execSync("robocopy ./mod ./project /E")} catch {}

//execute

execSync(`cd ./bin && godot_engine.exe --path "../project" "res://scenes/main.tscn"`);