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
import { regexCircuit } from './src/circuitGen.js';

const execPromise = promisify(exec); // Promisify exec for better async handling

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjusting the build directory path based on your folder structure
const buildDir = path.join(__dirname, '..', '..', 'build/src');
const parseBpmnPath = path.resolve(__dirname, 'parse_bpmn.js'); 

// Replace useState with a regular variable
let result = ''; // Manage state server-side without React hooks
let ExpectedRegex = '';
let ActualRegex = '';

const port = 4000;

// Initialize Express app
const app = express();
app.use(cors()); // Enable cross-origin requests

// Multer configuration for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

app.get('/', async (req, res) => {
    try {
        console.log("Backend started successfully");
        res.status(200).json({status: 'success'});
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ error: `${err.message}` });
    }
});

app.post('/api/upload/expected-and-actual', upload.array('bpmnFile', 2), async (req, res) => {
    try {
        const files = req.files;
        if (files.length === 2) {
            const expectedFileBuffer = files[0].buffer;
            const actualFileBuffer = files[1].buffer;

            // Log file information to verify upload
            console.log("Received files:");
            console.log(`Expected BPMN file size: ${expectedFileBuffer.length} bytes`);
            console.log(`Actual BPMN file size: ${actualFileBuffer.length} bytes`);

            // Log the first few lines of the file content to ensure it is received correctly
            console.log("First few lines of expected BPMN file:");
            console.log(expectedFileBuffer.toString('utf-8').slice(0, 500)); // Print the first 500 characters

            console.log("First few lines of actual BPMN file:");
            console.log(actualFileBuffer.toString('utf-8').slice(0, 500)); // Print the first 500 characters

            // Write the buffers to temporary files for processing
            fs.writeFileSync('/tmp/expected.bpmn', expectedFileBuffer);
            fs.writeFileSync('/tmp/actual.bpmn', actualFileBuffer);

            const expectedFilePath = '/tmp/expected.bpmn';
            const actualFilePath = '/tmp/actual.bpmn';

            // Ensure the correct files are being processed each time
            await expectedEndpoint(expectedFilePath);
            await actualEndpoint(actualFilePath);

            // Return updated result based on the latest files
            res.json({ ExpectedRegex, ActualRegex });
        } else {
            return res.status(400).send('Both expected and actual files are required');
        }
    } catch (err) {
        console.error("Error processing files:", err);
        return res.status(500).send(`Internal server error: ${err}`);
    }
});

app.get('/api/verify-bpmn', async (req, res) => {
    try {
        await verifyBpmn(); // Ensure verifyBpmn() is executed to update the `result`
        res.json({ isVerified: result }); // Send the boolean result as JSON
    } catch (err) {
        console.error('Error verifying BPMN:', err);
        res.status(500).json({ error: 'Failed to verify BPMN' });
    }
});

// Parsing functions
async function parseExpectedRegex(filePath) {
    return new Promise((resolve, reject) => {
        exec(`node ${parseBpmnPath} ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                return reject(new Error(stderr));
            }
            const ExpectedcombinedExpression = stdout.trim();
            console.log('Expected Combined Expression:', ExpectedcombinedExpression);
            ExpectedRegex = ExpectedcombinedExpression;
            resolve();
        });
    });
}

async function parseActualRegex(filePath) {
    return new Promise((resolve, reject) => {
        exec(`node ${parseBpmnPath} ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                return reject(new Error(stderr));
            }
            const ActualcombinedExpression = stdout.trim();
            console.log('Actual Combined Expression:', ActualcombinedExpression);
            ActualRegex = ActualcombinedExpression;
            resolve();
        });
    });
}

// Endpoint processing functions
async function expectedEndpoint(filePath) {
    try {
        await parseExpectedRegex(filePath);
        console.log("Expected BPMN parsed successfully");
        await regexCircuit(ExpectedRegex);
        console.log("Expected Regex circuit parsed successfully");
    } catch (error) {
        console.error("Error processing expected BPMN:", error);
    }
}

async function actualEndpoint(filePath) {
    try {
        await parseActualRegex(filePath);
        console.log("Actual BPMN parsed successfully");
    } catch (error) {
        console.error("Error processing actual BPMN:", error);
    }
}

async function verifyBpmn() {
    await buildFiles();
    await executeMain();
    console.log("verify bpmn function");
}

// TypeScript and Main.js execution
async function buildFiles() {
    try {
        console.log('Starting TypeScript compilation...');
        const { stdout: tscOutput } = await execPromise('npx tsc');
        console.log('TypeScript compilation output:', tscOutput);
    } catch (error) {
        console.error('Error during TSC or script execution:', error.message);
    }
}

async function executeMain() {
    try {
        console.log('Running BusinessProcessIntegrityVerificationTest.js...');
        const { stdout: mainJsOutput } = await execPromise(`node ${path.join(buildDir, 'BusinessProcessIntegrityVerificationTest.js')} "${ExpectedRegex}" "${ActualRegex}"`);
        console.log('Main JS output:', mainJsOutput);
        const match = mainJsOutput.match(/Final boolean result:\s*(true|false)/);
        result = match ? match[1] : '';
        console.log('Boolean result fetched from main.js:', result);
    } catch (error) {
        console.error('Error during TSC or script execution:', error.message);
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the Express server and WebSocket server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
