import {
  Field,
  SmartContract,
  method,
  DeployArgs,
  Permissions,
  PublicKey,
  Mina,
  PrivateKey,
  AccountUpdate,
  ZkProgram,
  CircuitString,
  Proof,
  Poseidon,
} from 'o1js';

//import { SqrtProgram } from './build/src/SqrtProgram.js'; // Adjust the path as needed

import { SqrtProgram } from './SqrtProgram'; 

//import SqrtProgram 

/*
// Define the ZkProgram
export const SqrtProgram = ZkProgram({
  name: 'SqrtProgram',
  publicInput: Field,
  publicOutput: Field,

  methods: {
    proveSquareRoot: {
      privateInputs: [Field],

    async method(publicInput: Field, privateInput: Field) {
        privateInput.square().assertEquals(publicInput);
        return Poseidon.hash([publicInput, privateInput]);
      },
    },
  },
});
*/


// Compile the program
const { verificationKey } = await SqrtProgram.compile();


// Define the SmartContract
class SqrtContract extends SmartContract {

  /*
  deploy(args: DeployArgs) {
    super.deploy(args);
    this.account.permissions.set({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }
  */

  //@method async verifyProof(publicInput: Field, proof: SqrtProgram.Proof) {
    //proof.verify();
    //proof.publicInput.assertEquals(publicInput);
  //}



  //proof: typeof SqrtProgram.Proof

  //@method async verifyProof(publicInput: Field, proof:SqrtProgram) {

  //@method async verifyProof(publicInput: Field, proof: typeof SqrtProgram.Proof) {
  //@method async verifyProof(publicInput: Field, proof: Proof<SqrtProgram>) {
  //@method async verifyProof(publicInput: Field, proof: typeof SqrtProgram) {

  //@method async verifyProof(publicInput: Field, proof: ZkProgram.Proof<Field, Field>) {

  @method async verifyProof(publicInput: Field, proof: typeof ZkProgram.Proof) {
    
    //proof.verify();

    //proof.verify(publicInput,proof);
     //proof.publicInput.assertEquals(publicInput);
  }

}




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
const zkAppInstance = new SqrtContract (zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, async () => {
  // 1 Mina fee is required to create a new account for the zkApp
  // This line means the deployer account will pay the fee for any account created in this transaction
  AccountUpdate.fundNewAccount(deployerAccount);
  await zkAppInstance.deploy();
});
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

// get the initial state of Square after deployment
//const num0 = zkAppInstance.num.get();
//console.log('state after init:', num0.toString());


/*

// Main function to run the example
async function main() {
  //const Local = Mina.LocalBlockchain({ proofsEnabled: true });
  //Mina.setActiveInstance(Local);

  //const deployerAccount = Local.testAccounts[0].privateKey;
  //const deployerPublicKey = deployerAccount.toPublicKey();

  // Deploy the contract
  //const zkAppPrivateKey = PrivateKey.random();
  //const zkAppPublicKey = zkAppPrivateKey.toPublicKey();

  //console.log('Deploying SqrtContract...');
 // const zkApp = new SqrtContract(zkAppPublicKey);
 // const deployTxn = await Mina.transaction(deployerPublicKey, () => {
  //  AccountUpdate.fundNewAccount(deployerPublicKey);
  //  zkApp.deploy({});
  //});
 // await deployTxn.prove();
  //await deployTxn.sign([deployerAccount, zkAppPrivateKey]).send();
  //console.log('SqrtContract deployed');

  // Generate a proof
  const publicInput = Field(25);
  const privateInput = Field(5);
  console.log('Generating proof...');
  const proof = await SqrtProgram.proveSquareRoot(publicInput, privateInput);
  console.log('Proof generated');

  // Verify the proof in the smart contract
  console.log('Verifying proof in smart contract...');
  const verifyTxn = await Mina.transaction(deployerPublicKey, () => {
    zkApp.verifyProof(publicInput, proof);
  });
  await verifyTxn.prove();
  await verifyTxn.sign([deployerAccount]).send();
  console.log('Proof verified in smart contract');
}

// Run the main function
console.log('Starting the example...');
main().then(() => console.log('Example completed')).catch(console.error);

*/
