// import { SmartContract, state, method, Bytes } from "o1js";
import { verifyProcess } from "./circuit-cli.js";
console.log("-----------------------------------------------------")
// import { State, Bool, Provable } from "o1js";  // Import Provable to use for debugging
// import { exec } from "child_process";
// import { promisify } from "util";
// import path from 'path';

// const execAsync = promisify(exec);

// // Create a custom Bytes50 class extending Bytes with a fixed length of 50
// class Bytes50 extends Bytes(50) {}

// export class bpmnCircuit extends SmartContract {
//   // Declare the state variable accepted of type State<Bool>
//   @state(Bool) accepted = State<Bool>();

//   // Initialization method
//   init() {
//     super.init();
//     this.accepted.set(Bool(false)); // Set the initial state of accepted
//   }

//   @method async verifyTrace(trace: Bytes50): Promise<void> {
//     console.log("Running verifyTrace...");

//     try {
//       // Log the input trace bytes for debugging
//       console.log("Input trace bytes:", trace.bytes);

//      // Run verifyProcess and await the result
//       const out = await verifyProcess(trace.bytes); // Ensure verifyProcess is async if needed
//       console.log("verifyProcess output:", JSON.stringify(out, null, 2)); // Log the full output for debugging

//       //Ensure out.value is treated correctly based on its type
//       if (typeof out.value === 'number') {
//         // If the value is a number, create a Bool state (true for 1, false for 0)
//         const boolValue = new Bool(out.value === 1);  // Convert result to Bool
//        this.accepted.set(boolValue);  // Update state with Bool(true) or Bool(false)

//         // Log the updated state, using isConstant() to check if it's constant
//         if (boolValue.isConstant()) {
//           console.log("State of accepted updated to:", boolValue.toJSON()); // Use toJSON() instead of toBoolean
//         } else {
//           console.error("Cannot call toJSON() on a non-constant Bool.");
//         }
//       } else if (typeof out.value === 'bigint') {
//         // If the value is BigInt, convert it to string for logging
//        // console.log("BigInt value:", out.value.toString());
//       } else {
//         // If the value is not expected type, log it
//         console.error("Expected a number or BigInt for out.value, but got:", typeof out.value);
//       }

//       // Run deleteCircuitcli.js (clean-up script)

//       //const deleteScriptPath = 'src/deleteCircuitcli.js';  // Resolve the absolute path
//       // console.log("Path to delete script:", deleteScriptPath);

//       // const { stdout, stderr } = await execAsync(`node ${deleteScriptPath}`);
//       // if (stderr) {
//       //   console.warn("deleteCircuitcli.js stderr:", stderr.trim());
//       // } else {
//       //   console.log("deleteCircuitcli.js executed successfully:", stdout.trim());
//       // }
//     } catch (error) {
//       // Detailed error handling for both verifyProcess and execAsync
//       if (error instanceof Error) {
//         console.error("Error in verifyTrace:", error.message);
//         console.error("Error stack:", error.stack); // Detailed error stack for better debugging
//       } else {
//         console.error("Unknown error in verifyTrace:", error);
//       }
//     }
//   }
// }





import {Bool,UInt8, Field, SmartContract, state, State, method, Bytes } from 'o1js';


class Bytes50 extends Bytes(50){}

export class bpmnCircuit extends SmartContract {

  @state(Bool) accepted = State<Bool>();
  
  init() {
    super.init();
    this.accepted.set(Bool(false));
  }
  
  @method async verifyTrace(trace : Bytes50) {
    let out = verifyProcess(trace.bytes);
    this.accepted.set(out)
  }
}