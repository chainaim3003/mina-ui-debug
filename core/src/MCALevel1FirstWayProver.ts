import { MCALevel1FirstWayCircuit, ComplianceData } from './MCALevel1FirstWayCircuit.js';//MCAcheckCircuit.js

import { Field, Bytes, Mina, PrivateKey, AccountUpdate,CircuitString } from 'o1js';
import fs from 'fs/promises'; // Import fs module for reading JSON files
import path from 'path';
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
//const zkAppInstance = new LiquidityCheckCircuit(zkAppAddress);//ZKappInstance is actually a smart contract
const zkAppInstance = new MCALevel1FirstWayCircuit(zkAppAddress)//MCALevel1CicuitCall
const deployTxn = await Mina.transaction(deployerAccount, async () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  await zkAppInstance.deploy();
});

await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

// get the initial state of Square after deployment
const accepted = zkAppInstance.accepted.get();
console.log('state after init:', accepted.toBoolean());
/*
const riskScenario1Data = {
  companyID:'Financier 10001',
  companyName:'Financier 1 - CashFlows RiskFree ',
  mcaID: '201',
  businessPANID: '1001',
  riskEvaluated:Field(1),
  cashInflows  : [5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000], // Monthly cash inflows
  cashOutflows : [2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500],         // Monthly cash outflows

	newInvoiceAmount : 5000,                 // Amount of the new invoice
	newInvoiceEvaluationMonth: 11,           // Include the invoice in the 12th month
	liquidityThreshold : 1.25,               // Required liquidity ratio

  // Currently mocked up ACTUS data.. 

// To be done .. The Risk Analysis program endpoint to be called for ACTUS Risk Service , with detailed Risk parameters.. 
  
 // Needs 1 contract with timeseries of 5 . 
   // For each of the epochs ( for now identified with an epoch id key) in the timeseries. need date  epochdate and a epoch amount as integer to be stored 
// 

// Needs 2 contracts . Each should have a timeseries of 5 . 
    // For each of the epochs ( for now identified with an epoch id key) in the timeseries. need date  epochdate and a epoch amount as integer to be stored 

// 

//---------------------

};
*/ 
const basePath = "D:/chainaimlabs/actus live serveer/ZK-PRET-RWA-SCF/scf-main/scf-rwa/zkapps/scf-rwa-recursion/build/";
    const relativePath = "src/data_false.json";
    const fullPath = path.join(basePath, relativePath);
    const jsonData = await fs.readFile(fullPath, 'utf-8'); // Replace with your file path
    const parsedData = JSON.parse(jsonData);
const complianceData = new ComplianceData({
  companyID: CircuitString.fromString(parsedData["CIN"]),
  companyName: CircuitString.fromString(parsedData["Company Name"]),
  roc: CircuitString.fromString(parsedData["ROC"]),
  registrationNumber: Field(parsedData["Registration Number"]),
  incorporationDate: CircuitString.fromString(parsedData["Incorporation Date"]),
  email: CircuitString.fromString(parsedData["Email"]),
  corporateAddress: CircuitString.fromString(parsedData["Corporate Address"]),
  listed: Field(parsedData["Listed"] ? 1 : 0), // Convert boolean to Field
  companyType: CircuitString.fromString(parsedData["Company Type"]),
  companyCategory: CircuitString.fromString(parsedData["Company Category"]),
  companySubcategory: CircuitString.fromString(parsedData["Company Subcategory"]),
  companyStatus: parsedData["Company Status"],
  authorizedCapital: Field(parsedData["Authorized Capital"]),
  paidUpCapital: Field(parsedData["Paid-up Capital"]),
  lastAGMDate: CircuitString.fromString(parsedData["Last AGM Date"]),
  balanceSheetDate: CircuitString.fromString(parsedData["Balance Sheet Date"]),
  activeCompliance: parsedData["Active Compliance"],
  companyActivity: CircuitString.fromString(parsedData["Company Activity"]),
  jurisdiction: CircuitString.fromString(parsedData["Jurisdiction"]),
  regionalDirector: CircuitString.fromString(parsedData["Regional Director"]),
  mcaID: Field(parsedData["MCA ID"]),
});

//console.log('scenario name ', complianceData.companyName);


const txn1 = await Mina.transaction(senderAccount, async () => {
  await zkAppInstance.verifyTrace(complianceData);
});


await txn1.prove();
await txn1.sign([senderKey]).send();
const t1 = zkAppInstance.accepted.get();
const proof1 = txn1.toPretty();
console.log('Proof generated successfully for risk scenario:', complianceData.companyName);
console.log('Generated Proof:', proof1);
console.log('COMPANY 1 trace',complianceData.companyName, ' evaluation ', t1.toBoolean()  );
export{proof1};
