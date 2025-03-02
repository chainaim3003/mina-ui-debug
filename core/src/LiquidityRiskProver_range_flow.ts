import { LiquidityCheckCircuit, ACTUSData } from './LiquidityCheckCircuit_range_flow.js';
import { mapJsonToRiskData, loadAndProcessJson } from './map_dynamic_range_flow.js';
import { Field, Bytes, Mina, PrivateKey, AccountUpdate, CircuitString } from 'o1js';
import path from 'path';
import fs from 'fs';

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
const zkAppInstance = new LiquidityCheckCircuit(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, async () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  await zkAppInstance.deploy();
});

await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

// get the initial state of Square after deployment
const accepted = zkAppInstance.accepted.get();
console.log('state after init:', accepted.toBoolean()); 

const relativePath = path.join('src', 'response.json');

// Get the current working directory
const currentWorkingDirectory = process.cwd();

// Construct the full path by joining the current working directory and the relative path
const fullPath = path.join(currentWorkingDirectory, relativePath);
const { inflow: cashInfl, outflow: cashOutfl } = loadAndProcessJson(fullPath);
console.log("Cash inflows: ", cashInfl);
console.log("Cash outflows: ", cashOutfl);

const riskScenario1Data = {
  companyID: 'Financier 10001',
  companyName: 'Financier 1 - CashFlows RiskFree',
  mcaID: '201',
  businessPANID: '1001',
  riskEvaluated: Field(1),
  cashInflow: cashInfl,
  cashOutflow: cashOutfl,
  newInvoiceAmount: 5000, 
  newInvoiceEvaluationMonth: 11, 
  liquidityThreshold: 1.25,
};

const risk1Data = new ACTUSData({
  scenarioID: CircuitString.fromString(riskScenario1Data.companyID),
  scenarioName: riskScenario1Data.companyName,
  riskEvaluated: Field(riskScenario1Data.riskEvaluated),
  cashInflows: riskScenario1Data.cashInflow,
  cashOutflows: riskScenario1Data.cashOutflow,
  newInvoiceAmount: riskScenario1Data.newInvoiceAmount,
  newInvoiceEvaluationMonth: riskScenario1Data.newInvoiceEvaluationMonth,
  liquidityThreshold: riskScenario1Data.liquidityThreshold,
});

console.log('Scenario name: ', risk1Data.scenarioName);

const txn1 = await Mina.transaction(senderAccount, async () => {
  await zkAppInstance.verifyTrace(risk1Data);
});

await txn1.prove();
console.log(txn1);
await txn1.sign([senderKey]).send();

const t1 = zkAppInstance.accepted.get();
const proof1 = txn1.toPretty();
console.log('Proof generated successfully for risk scenario:', risk1Data.scenarioName);
console.log('Generated Proof:', proof1);

if (t1.toBoolean()) {
  console.log('Risk scenario 1 trace', risk1Data.scenarioName, 'evaluation', t1.toBoolean(), 'Good to finance.');
} else {
  console.log('Risk scenario 1 trace', risk1Data.scenarioName, 'evaluation', t1.toBoolean(), 'Not so good to finance.');
}

const riskScenario2Data = {
  companyID: 'Financier 10001',
  companyName: 'Financier 1 - CashFlows at risk',
  mcaID: '201',
  businessPANID: '1001',
  riskEvaluated: Field(1),
  cashInflows: cashInfl,
  cashOutflows: cashOutfl,
  newInvoiceAmount: 5000,
  newInvoiceEvaluationMonth: 11,
  liquidityThreshold: 1.25,
};

const risk2Data = new ACTUSData({
  scenarioID: CircuitString.fromString(riskScenario2Data.companyID),
  scenarioName: riskScenario2Data.companyName,
  riskEvaluated: Field(riskScenario2Data.riskEvaluated),
  cashInflows: riskScenario2Data.cashInflows,
  cashOutflows: riskScenario2Data.cashOutflows,
  newInvoiceAmount: riskScenario2Data.newInvoiceAmount,
  newInvoiceEvaluationMonth: riskScenario2Data.newInvoiceEvaluationMonth,
  liquidityThreshold: riskScenario2Data.liquidityThreshold,
});

console.log('Scenario name: ', risk2Data.scenarioName);

const txn2 = await Mina.transaction(senderAccount, async () => {
  await zkAppInstance.verifyTrace(risk2Data);
});

await txn2.prove();
await txn2.sign([senderKey]).send();
const proof2 = txn2.toPretty();
console.log('Proof generated successfully for risk scenario:', risk2Data.scenarioName);
console.log('Generated Proof:', proof2);

const t2 = zkAppInstance.accepted.get();

if (t2.toBoolean()) {
  console.log('Risk scenario 2 trace', risk2Data.scenarioName, 'evaluation', t2.toBoolean(), 'Good to finance.');
} else {
  console.log('Risk scenario 2 trace', risk2Data.scenarioName, 'evaluation', t2.toBoolean(), 'Not so good to finance.');
}
