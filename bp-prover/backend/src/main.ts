import { bpmnCircuit } from './bpmnCircuitVerifier.js';
import { Field, Bytes, Mina, PrivateKey, AccountUpdate } from 'o1js';

// const [ExpectedRegex , setExpectedRegex] = useState();



// const [ActualRegex , setActualRegex] = useState();
//console.log("11111111111111111111111111111111111111111111111111111",process.argv);  // Log all the command-line arguments

const ExpectedRegex =  process.argv[2];
const ActualRegex = process.argv[3];

if (!ExpectedRegex || !ActualRegex) {
  console.log("Arguments are missing!");
}

console.log("Expected Regex",ExpectedRegex)
console.log("Actual Regex",ActualRegex)

// export const setRegex = ({actual , expected}) => {
//   setExpectedRegex(expected);
//   setActualRegex(actual);
// }


class Bytes50 extends Bytes(50){}

const useProof = false;

const Local = await Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);

const deployerAccount = Local.testAccounts[0];
const deployerKey = deployerAccount.key;
const senderAccount = Local.testAccounts[1];
const senderKey = senderAccount.key;
// ----------------------------------------------------

// Create a public/private key pair. The public key is your address and where you deploy the zkApp to
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

// create an instance of bpmnCircuit and pass the zkAppAddress
const zkAppInstance = new bpmnCircuit(zkAppAddress);  // Pass the zkAppAddress here
const deployTxn = await Mina.transaction(deployerAccount, async () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  await zkAppInstance.deploy();
});
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

// get the initial state of the zkApp after deployment
const accepted = zkAppInstance.accepted.get();
//console.log('state after init:', accepted.toBoolean());

// ----------------------------------------------------

// const actualPath1 = "abcdefg";
// let expectedPath = "a(cb|bc)d(ef|f)g";
 const actualPath1 = ActualRegex;
let expectedPath = ExpectedRegex;

console.log("expected path ", expectedPath);

const txn1 = await Mina.transaction(senderAccount, async () => {
  await zkAppInstance.verifyTrace(Bytes50.fromString(`${actualPath1}`));
});
await txn1.prove();
await txn1.sign([senderKey]).send();

const t1 = zkAppInstance.accepted.get();
console.log('actual path1 trace', actualPath1);
//console.log('state after actual path trace1:', t1.toBoolean());
console.log('Debug: t1.toBoolean() value:', t1.toBoolean());
console.log('Final boolean result:', t1.toBoolean());
process.exit(0); 
// process.stdout.write(JSON.stringify({ result: t1.toBoolean() }));