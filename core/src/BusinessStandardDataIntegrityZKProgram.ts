import { exec } from 'child_process';
import * as fs from 'fs'; 
import { Field, Mina, PrivateKey, AccountUpdate, CircuitString } from 'o1js';
import { BusinessStandardDataIntegrityZKProgram, BusinessStandardDataIntegrityComplianceData, BusinessStandardDataIntegrityProof } from './BusinessStandardDataIntegrityZKProgram.js';
import { BusinessStandardDataIntegrityVerificationSmartContract } from './BusinessStandardDataIntegrityVerificationSmartContract.js';

import axios from 'axios';

async function main() {

    const expectedContent = "a(cb|bc)d(ef|f)g";
  //const actualPath = process.argv[3];
    const actualContent = "abcdfg";
    const evalBLJsonFileName = 'actualBL1.json';

    const evalBLJson = JSON.parse(await fs.promises.readFile('actualBL1.json', 'utf8'));

    console.log ( "eval BL JSON  in verification test ... ...", evalBLJson)

    const useProof = false;

    const Local = await Mina.LocalBlockchain({ proofsEnabled: useProof });
    Mina.setActiveInstance(Local);

    const deployerAccount = Local.testAccounts[0];
    const deployerKey = deployerAccount.key;
    const senderAccount = Local.testAccounts[1];
    const senderKey = senderAccount.key;

    console.log('Compiling...');

    await BusinessStandardDataIntegrityZKProgram.compile();

    const { verificationKey } = await BusinessStandardDataIntegrityVerificationSmartContract.compile();

    console.log("verification key is successful");
    const zkAppKey = PrivateKey.random();
    const zkAppAddress = zkAppKey.toPublicKey();

    console.log("ZKAppAddress is successful");

    const zkApp = new BusinessStandardDataIntegrityVerificationSmartContract(zkAppAddress);
    console.log("zkApp is successful");

    console.log("Mina transaction is successful");

    const deployTxn = await Mina.transaction(
        deployerAccount,
        async () => {
            AccountUpdate.fundNewAccount(deployerAccount);
            await zkApp.deploy({ verificationKey });

        }
    );
    console.log("deployTxn is successful");
    await deployTxn.sign([deployerKey, zkAppKey]).send();
    console.log("deployTxn signed successfully");
    console.log("Fetching compliance data...");
    const BASEURL = "https://0f4aef00-9db0-4057-949e-df6937e3449b.mock.pstmn.io";
    const companyname = "vernon_dgft"
    const response = await axios.get(`${BASEURL}/${companyname}`); // Replace with your mock API endpoint
    const parsedData = response.data;

    console.log(parsedData);
    //console.log("HI");

    //console.log(parsedData["iec"]);
    //console.log(parsedData["iecStatus"]);

    const BusinessStandardDataIntegritycomplianceData = new BusinessStandardDataIntegrityComplianceData({
        // iec: CircuitString.fromString(parsedData["iec"] || ''),
        // entityName: CircuitString.fromString(parsedData["entityName"] || ''),
        // addressLine1: CircuitString.fromString(parsedData["addressLine1"] || ''),
        // addressLine2: CircuitString.fromString(parsedData["addressLine2"] || ''),
        // city: CircuitString.fromString(parsedData["city"] || ''),
        // state: CircuitString.fromString(parsedData["state"] || ''),
        // pin: Field(parsedData["pin"] ?? 0),
        // contactNo: Field(parsedData["contactNo"] ?? 0),
        // email: CircuitString.fromString(parsedData["email"] || ''),
        // iecIssueDate: CircuitString.fromString(parsedData["iecIssueDate"] || ''),
        // exporterType: Field(parsedData["exporterType"] ?? 0),
        // pan: CircuitString.fromString(parsedData["pan"] || ''),
        // iecStatus: Field(parsedData["iecStatus"] ?? 0),
        // starStatus: Field(parsedData["starStatus"] ?? 0),
        // iecModificationDate: CircuitString.fromString(parsedData["iecModificationDate"] || ''),
        // dataAsOn: CircuitString.fromString(parsedData["dataAsOn"] || ''),
        // natureOfConcern: Field(parsedData["natureOfConcern"] ?? 0),

        // // Branch Data (from branches[0])
        // branchCode: Field(parsedData.branches?.[0]?.branchCode ?? 0),
        // badd1: CircuitString.fromString(parsedData.branches?.[0]?.badd1 || ''),
        // badd2: CircuitString.fromString(parsedData.branches?.[0]?.badd2 || ''),
        // branchCity: CircuitString.fromString(parsedData.branches?.[0]?.city || ''),
        // branchState: CircuitString.fromString(parsedData.branches?.[0]?.state || ''),
        // branchPin: Field(parsedData.branches?.[0]?.pin ?? 0),

        // // Director Data (from directors)
        // director1Name: CircuitString.fromString(parsedData.directors?.[0]?.name || ''),
        // director2Name: CircuitString.fromString(parsedData.directors?.[1]?.name || ''),
        businessStandardDataIntegrityEvaluationId : Field(parsedData["BusinessStandardDataIntegrityEvaluation ID"] ?? 0),
        expectedContent: CircuitString.fromString(expectedContent),
        //actualContent: CircuitString.fromString(actualContent),
        actualContent: evalBLJson,
        actualContentFilename:'actualBL1.json',

    });


    const proof = await BusinessStandardDataIntegrityZKProgram.proveCompliance(Field(1),BusinessStandardDataIntegritycomplianceData)

    console.log("Before verification, Initial value of num:",zkApp.num.get().toJSON());
    // Verify proof
    const txn = await Mina.transaction(
        senderAccount,
        async () => {
            await zkApp.verifyComplianceWithProof(proof);
        }
    );
    // await txn.sign([zkAppKey]).send();

    const proof1 = await txn.prove();

    
    console.log("Proof generated successfully");
    console.log(senderAccount.toJSON());
    console.log(senderKey.toJSON(),senderKey.toPublicKey());
    console.log("Generated Proof:",proof1.toPretty());
    await txn.sign([senderKey]).send();
    console.log("Final value of num:",zkApp.num.get().toJSON());

    console.log('✅ Proof verified successfully!');
}

main().catch(err => {
    console.error('Error:', err);
});

//export { ComplianceData };

  
  
  
  
