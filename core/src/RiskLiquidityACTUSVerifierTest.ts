import { Field, Mina, PrivateKey, AccountUpdate, CircuitString } from 'o1js';
//import { CorporateRegistrationProof, CorporateRegistration } from './CorporateRegistrationZKProgram.js';
import { mapJsonToRiskData,loadAndProcessJsonData} from './map_with_zk.js';
import { CorporateRegistration, ACTUSData } from './RiskLiquidityACTUSZKProgram.js';
import { CorporateRegistrationVerifierSmartContract } from './RiskLiquidityVerifierACTUSSmartContract.js';



import axios from 'axios';
import path from 'path';
import { loadAndProcessJson } from './map_dynamic_range_flow.js';
//import {  } from './CorporateRegistrationVerifierSmartContract.js';
//import {  }  from './CorporateRegistrationZKProgram.js';
//import { SecretHash, SecretHashProof } from './SecretHash.js';

async function main() {
  /*const Local = Mina.LocalBlockchain({ proofsEnabled: true });

 // Mina.setActiveInstance(Local);
 const localInstance = await Local; // Await the promise before using it
Mina.setActiveInstance(localInstance);
  const deployer = (await Local).testAccounts[0].key;
  const deployerPublicKey = deployer.toPublicKey();*/
  
const useProof = false;

const Local = await Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);

const deployerAccount = Local.testAccounts[0];
const deployerKey = deployerAccount.key;
const senderAccount = Local.testAccounts[1];
const senderKey = senderAccount.key;

  /*const deployerKeypair = PrivateKey.random();
  const deployer = deployerKeypair;*/

  //const deployer = localInstance.testAccounts[0].keypair.privateKey; // If keypair exists

  // Compile artifacts
  console.log('Compiling...');
  //await SecretHash.compile();
 // await CorporateRegistration.compile();

 await CorporateRegistration.compile();
 
  //const { verificationKey } = await HashVerifier.compile();

  const { verificationKey } = await CorporateRegistrationVerifierSmartContract.compile();
 
  console.log("verification key is successful");
  // Deploy contract
  const zkAppKey = PrivateKey.random();
  const zkAppAddress = zkAppKey.toPublicKey();


  /*await Mina.transaction(deployerKeypair, async () => {
    await Mina.fundAccount({ address: zkAppAddress, initialBalance: 10 });
  }).send();*/
  console.log("ZKAppAddress is successful");
  //const zkApp = new HashVerifier(zkAppAddress);

  const zkApp = new CorporateRegistrationVerifierSmartContract(zkAppAddress);
  

  console.log("zkApp is successful");

  /*await Mina.transaction(deployerPublicKey, async () => {
    AccountUpdate.fundNewAccount(deployerPublicKey); // Ensure deployer has funds
    AccountUpdate.fundNewAccount(zkAppAddress); // Fund the zkApp address

  }).send();*/
  
  console.log("Mina transaction is successful");

  const deployTxn = await Mina.transaction(
     deployerAccount,
    async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy({ verificationKey });

      //zkApp.storedHash.set(Field(42));


    }
  );
  console.log("deployTxn is successful");
  await deployTxn.sign([deployerKey, zkAppKey]).send();
  console.log("deployTxn signed successfully");
  
  // Generate test proof
  
  //const secret = Field(42);
  //const correctHash = Poseidon.hash([secret]);
  //const proof = await SecretHash.generate(correctHash, secret);

 // const proof = await CorporateRegistration.proveCompliance();


 console.log("Fetching compliance data...");
 //const basePath = "C:/chainaims/ZK-PRET-DEV-V1/zkapps/TEAM-REF/RiskProver_Prabakaran_4thfeb/scf-main/scf-rwa/zkapps/scf-rwa-recursion";// mention basepath
 //const relativePath = "src/response.json";
const basePath = "./src";
const relativePath = "response.json";
 const fullPath = path.join(basePath, relativePath);
 const { inflow: cashInfl, outflow: cashOutfl } = loadAndProcessJson(fullPath);
 


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
};//
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


  const proof = await CorporateRegistration.proveCompliance(Field(0),risk1Data)

 console.log("Before verification, Initial value of num:",zkApp.num.get.toString());
  // Verify proof
  const txn = await Mina.transaction(
    senderAccount,
    async () => {
      await zkApp.verifyComplianceWithProof(proof);
    }
  );
 // await txn.sign([zkAppKey]).send();
 
  const proof1 = await txn.prove();
  //await txn.prove();


  console.log("Proof generated successfully");
  console.log(senderAccount.toJSON());
  console.log(senderKey.toJSON(),senderKey.toPublicKey());
  console.log("Generated Proof:",proof1.toPretty());
  await txn.sign([senderKey]).send();
  console.log("Final value of num:",zkApp.num.get.toString());

  console.log('✅ Proof verified successfully!');
}

main().catch(err => {
  console.error('Error:', err);
});

//export { ComplianceData };
