const fs = require("fs");
const { execSync, exec } = require('child_process');

const gamePath = process.argv[2].replace(/[\\/]$/, "");

if (!fs.existsSync("./bin")) fs.mkdirSync("./bin");

console.log("Locating Game");
fs.copyFileSync(gamePath + "/Sensory Overload Playtest.pck", "./bin/game.pck");

function getEncryptionKey(exe) {
    try {
        const output = execSync(`cd bin && keydot.exe "${exe}"`).toString();

        const keyMatch = output.match(/[0-9A-Fa-f]{64}/);

        if (keyMatch) {
            const encryptionKey = keyMatch[0];
            console.log('Extracted Key:', encryptionKey);
            return encryptionKey;
        } else {
            console.error('Key not found in output.');
            return null;
        }
    } catch (error) {
        console.error('Error running keydot.exe:', error.message);
        return null;
    }
}

console.log("Finding Key")
const key = getEncryptionKey(gamePath + "/Sensory Overload Playtest.exe")

console.log("Extracting Game");
execSync(`cd ./bin && gdre_tools.exe --headless --recover=./game.pck --output=../project --key=${key}`, { shell: true });
fs.mkdirSync("./project/mod")

console.log("Restoring Progress");
try {execSync("robocopy ./mod ./project /E")} catch {}


console.log("Opening Editor");
execSync(`cd ./bin && godot_engine.exe --path "../project" -e`, { shell: true });

try {execSync("robocopy ./project/mod ./mod /E")} catch {}

console.log("Cleaning up work");
fs.rmSync("./project", { recursive: true, force: true });
fs.rmSync("./original", { recursive: true, force: true });