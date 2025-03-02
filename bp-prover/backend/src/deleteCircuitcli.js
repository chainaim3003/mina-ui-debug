import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log the directory and path for debugging


// File path to circuit-cli.js inside the build folder
const circuitCliPath = path.join(__dirname, "circuit-cli.js");

// Log the full path to ensure it's correct
console.log("Path to circuit-cli.js:", circuitCliPath);

// Check if the file exists before attempting to delete
if (fs.existsSync(circuitCliPath)) {
    try {
        // Try deleting the file
        fs.unlinkSync(circuitCliPath);
        console.log(`Deleted file: ${circuitCliPath}`);
    } catch (err) {
        console.error(`Error deleting file: ${circuitCliPath}`, err);
    }
} else {
    console.error(`File does not exist: ${circuitCliPath}`);
}
