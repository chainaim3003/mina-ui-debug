import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { CirCuitGenExp } from './src/circuitGen.js';

const execPromise = promisify(exec); // Promisify exec for better async handling

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// State variables without useState (for server-side)
let ExpectedRegex = '';
let ActualRegex = '';

const port = 4000;

// Initialize Express app
const app = express();
app.use(cors()); // Enable cross-origin requests

// Multer configuration for file upload
const upload = multer({ dest: 'uploads/' });

// Create HTTP server for Express
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket');
    ws.on('message', (message) => {
        console.log(`Received WebSocket message: ${message}`);
    });
});

// Route to upload the BPMN file and process it
app.post('/api/upload/expected', upload.single('bpmnFile'), (req, res) => {
    console.log("expected======================================")
    const filePath = req.file.path;  

    // Run the Python script to parse the BPMN file
    exec(`python parse_bpmn.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            return res.status(500).send('Internal server error');
        }
        if (stderr) {
            console.error(`Python stderr: ${stderr}`);
            return res.status(500).send('Python script error');
        }
        
        // Process the combined expression returned by the Python script
        const ExpectedcombinedExpression = stdout.trim();
        console.log('Expected Combined Expression:', ExpectedcombinedExpression);
        
        // Update the server-side regex state
        ExpectedRegex = ExpectedcombinedExpression;
        CirCuitGenExp(ExpectedRegex);
        
        // Execute the next script (Node.js) based on the output from Python
        exec(`node ./src/circuitGen.js`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing js script: ${error.message}`);
                return res.status(500).send('Internal server error');
            }
            if (stderr) {
                console.error(`js stderr: ${stderr}`);
            }
            console.log(`Node.js script output: ${stdout}`);
        });
        
        // Respond with the combined expression
        res.json({ ExpectedcombinedExpression });
    });
});

// Route to upload the actual BPMN file and process it
app.post('/api/upload/actual', upload.single('bpmnFile'), (req, res) => {
    console.log("actual======================================")
    const filePath = req.file.path;
    
    // Run the Python script to parse the BPMN file
    exec(`python parse_bpmn.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            return res.status(500).send('Internal server error');
        }
        if (stderr) {
            console.error(`Python stderr: ${stderr}`);
            return res.status(500).send('Python script error');
        }

        // Process the combined expression returned by the Python script
        const ActualcombinedExpression = stdout.trim();
        console.log('Actual Combined Expression:', ActualcombinedExpression);

        // Update the server-side regex state
        ActualRegex = ActualcombinedExpression;
        
        // Respond with the combined expression
        res.json({ ActualcombinedExpression });
    });
});

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Start the Express server and WebSocket server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    // runTSCAndDeleteCircuitVerifier();
});

// Function to run TypeScript compilation and the deleteCircuitVerifier script
async function runTSCAndDeleteCircuitVerifier() {
    try {
        console.log('Starting TypeScript compilation...');
        const { stdout: tscOutput } = await execPromise('npx tsc');
        console.log('TypeScript compilation output:', tscOutput);

        console.log('Running main.js...');
        const { stdout: mainJsOutput } = await execPromise(`node build/main.js "${ExpectedRegex}" "${ActualRegex}"`);
        console.log('main.js output:', mainJsOutput);
        // Ensure ExpectedRegex and ActualRegex are set before executing the script
// First ensure ExpectedRegex and ActualRegex are set
// if (ExpectedRegex && ActualRegex) {
//     try {
//         // Pass the arguments to the Node.js script
//         const { stdout: mainJsOutput } = await execPromise(`node build/main.js "${String(ExpectedRegex)}" "${String(ActualRegex)}"`);
//         console.log(mainJsOutput);
//     } catch (error) {
//         console.error('Error executing main.js:', error);
//     }
// } else {
//     console.log("Arguments are missing!+++++++++++++++");
// }



        console.log('Running deleteCircuitcli.js...');
        const { stdout: deleteCircuitOutput } = await execPromise('node build/deleteCircuitcli.js');
        console.log('deleteCircuitcli.js output:', deleteCircuitOutput);
    } catch (error) {
        console.error('Error during TSC or script execution:', error.message);
    }
}



async function parseExpectedRegex(filePath){
    exec(`python parse_bpmn.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            return res.status(500).send('Internal server error');
        }
        if (stderr) {
            console.error(`Python stderr: ${stderr}`);
            return res.status(500).send('Python script error');
        }
        const ExpectedcombinedExpression = stdout.trim();
        console.log('Expected Combined Expression:', ExpectedcombinedExpression);
        ExpectedRegex = ExpectedcombinedExpression;
        CirCuitGenExp(ExpectedRegex);
    })
}

async function buidFile(fileName){
    exec(`npx tsc ${fileName}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error building file ${fileName}: ${error.message}`);
            return res.status(500).send('Internal server error');
        }
        if (stderr) {
            console.error(`build stderr: ${stderr}`);
            return res.status(500).send('build error');
        }
    })
}

async function executeFile(fileName){
    exec(`node ./src/circuitGen.js`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing js script file ${fileName}: ${error.message}`);
            return res.status(500).send('Internal server error');
        }
        if (stderr) {
            console.error(`js stderr ${fileName}: ${stderr}`);
        }
        console.log(`Node.js script output: ${stdout}`);
    });
}

async function expectedEndpoint(){
    await parseExpectedRegex();
    await buidFile("./src/CircuitGen.ts");
    await executeFile("./src/circuitGen.js");
    console.log("expectedregex parsed successfully");
}