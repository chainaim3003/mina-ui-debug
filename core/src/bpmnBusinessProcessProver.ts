import { bpmnCircuit } from './bpmnCircuit.js';
import { Field, Bytes, Mina, PrivateKey, AccountUpdate } from 'o1js';

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

// create an instance of Square - and deploy it to zkAppAddress
const zkAppInstance = new bpmnCircuit(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, async () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  await zkAppInstance.deploy();
});
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

// get the initial state of Square after deployment
const accepted = zkAppInstance.accepted.get();
console.log('state after init:', accepted.toBoolean());

// ----------------------------------------------------

const actualPath1="abcdefg"
const actualPath2="acbdfg"
const actualPath3="abfcdg"
const actualPath4="abcf"

let expectedPath="a(cb|bc)d(ef|f)g"

// ----------------------------------------------------

console.log("expected path ",expectedPath)

const txn1 = await Mina.transaction(senderAccount, async () => {
  await zkAppInstance.verifyTrace(Bytes50.fromString(`${actualPath1}`));
});
await txn1.prove();
await txn1.sign([senderKey]).send();

const t1 = zkAppInstance.accepted.get();
console.log('actual path1 trace',actualPath1)
console.log('state after actual path trace1:', t1.toBoolean());

// ----------------------------------------------------

const txn2 = await Mina.transaction(senderAccount, async () => {
  await zkAppInstance.verifyTrace(Bytes50.fromString(`${actualPath2}`));
});
await txn2.prove();
await txn2.sign([senderKey]).send();

const t2 = zkAppInstance.accepted.get();
console.log('actual path2 trace',actualPath2)

console.log('state after actual path trace2:', t2.toBoolean());

// ----------------------------------------------------

const txn3 = await Mina.transaction(senderAccount, async () => {
  await zkAppInstance.verifyTrace(Bytes50.fromString(`${actualPath3}`));
});
await txn3.prove();
await txn3.sign([senderKey]).send();

const t3 = zkAppInstance.accepted.get();
console.log('actual path3 trace',actualPath3)

console.log('state after actual path trace3:', t3.toBoolean());

// ----------------------------------------------------

const txn4 = await Mina.transaction(senderAccount, async () => {
  await zkAppInstance.verifyTrace(Bytes50.fromString(`${actualPath4}`));
});
await txn4.prove();
await txn4.sign([senderKey]).send();

const t4 = zkAppInstance.accepted.get();
console.log('actual path4 trace',actualPath4)

console.log('state after actual path trace4:', t4.toBoolean());


if (t4.toBoolean())
{
  console.log("hello t4");
}
if (t1.toBoolean())
{
  console.log("hello t1");
}



const timeStamp={
  'a': '23/Apr/2023 11:42:35',
  'b': '24/Apr/2023 11:42:35',
  'c': '25/Apr/2023 11:42:35',
  'd': '26/Apr/2023 11:42:35',
  'e': '27/Apr/2023 11:42:35',
  'f': '28/Apr/2023 11:42:35',
  'g': '29/Apr/2023 11:42:35'
}

console.log(`${timeStamp['a']}`

)
