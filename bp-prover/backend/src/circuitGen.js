import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Replace useState with a regular JavaScript variable
// let Regex;

// // Function to update the Regex value
// export const CirCuitGenExp = ({ expected }) => {
//     Regex = expected;
// };

// // Define the regex pattern and circuit file
// let regex = 'a(cb|bc)d(ef|f)g';
// let cir_dir = 'src/circuit-cli.ts'; // Get absolute path of the file

// // Check if the file exists and delete it if it does


// console.log("regex from state=",Regex);
// Regex=process.argv[2];
// console.log("regex from argv=",Regex);


// Run the exec command for zk-regex
export async function regexCircuit(regex){
    let cir_dir = 'src/circuit-cli.ts';
    console.log("Regex in circuitgen:",regex);
    if (fs.existsSync(cir_dir)) {
        console.log(`File ${cir_dir} exists. Overwriting...`);
        fs.unlinkSync(cir_dir); // Delete the file
    }
    exec(
        `zk-regex "${regex}" --functionName verifyProcess --filePath ${cir_dir}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return;
            }
            console.log(`Output: ${stdout}`);
            console.log("successfully file updated")
    
            // try {
            //     console.log('Starting TypeScript compilation...');
            //     const tscOutput = await execPromise('npx tsc');
            //     console.log('TypeScript compilation output:', tscOutput);
    
            //     console.log('Running main.js...');
            //     const mainJsOutput = await execPromise('node build/main.js');
            //     console.log('main.js output:', mainJsOutput);
    
            //     //console.log('Running deleteCircuitcli.js...');
            //     //const deleteCircuitOutput = await execPromise('node build/deleteCircuitcli.js');
            //     //console.log('deleteCircuitcli.js output:', deleteCircuitOutput);
            // } catch (error) {
            //     console.error('Error during TSC or script execution:', error);
            // }
        }
    );
}




// Convert exec to a Promise-based function
// const execPromise = (command) => {
//     return new Promise((resolve, reject) => {
//         exec(command, (error, stdout, stderr) => {
//             if (error) {
//                 reject(`Error: ${error.message}`);
//             } else if (stderr) {
//                 reject(`Stderr: ${stderr}`);
//             } else {
//                 resolve(stdout);
//             }
//         });
//     });
// };
