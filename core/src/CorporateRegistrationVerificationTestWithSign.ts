import { Field, Mina, PrivateKey, AccountUpdate, CircuitString, Poseidon, Signature } from 'o1js';
import { CorporateRegistration, ComplianceData } from './CorporateRegistrationZKProgramWithSign.js';
import { CorporateRegistrationVerifierSmartContract } from './CorporateRegistrationVerifierSmartContractWithSign.js';


import {Oracle_Private_key,deployerAccount,senderAccount,deployerKey,senderKey,Local} from './oracle_mca.js';


import axios from 'axios';

async function main() {
  
  console.log("Oracle Private Key:", Oracle_Private_key.toBase58());
  
  
    await CorporateRegistration.compile();
    const { verificationKey } = await CorporateRegistrationVerifierSmartContract.compile();

    const zkAppKey = PrivateKey.random();
    const zkAppAddress = zkAppKey.toPublicKey();
    const zkApp = new CorporateRegistrationVerifierSmartContract(zkAppAddress);

    const deployTxn = await Mina.transaction(
        //deployerAccount,
        Oracle_Private_key,
        async () => {
            AccountUpdate.fundNewAccount(Oracle_Private_key);
            await zkApp.deploy({ verificationKey });
        }
    );
   // await deployTxn.sign([deployerKey, zkAppKey]).send();
   await deployTxn.sign([Oracle_Private_key.key, zkAppKey]).send();
    console.log("deployTxn signed successfully");

    const response = await axios.get('https://0f4aef00-9db0-4057-949e-df6937e3449b.mock.pstmn.io/vernon_mca');
    const parsedData = response.data;

    const complianceData = new ComplianceData({
        companyID: CircuitString.fromString(parsedData["CIN"] || ''),
        companyName: CircuitString.fromString(parsedData["Company Name"] || ''),
        roc: CircuitString.fromString(parsedData["ROC"] || ''),
        registrationNumber: Field(parsedData["Registration Number"] ?? 0),
        incorporationDate: CircuitString.fromString(parsedData["Incorporation Date"] || ''),
        email: CircuitString.fromString(parsedData["Email"] || ''),
        corporateAddress: CircuitString.fromString(parsedData["Corporate Address"] || ''),
        listed: Field(parsedData["Listed"] ? 1 : 0),
        companyType: CircuitString.fromString(parsedData["Company Type"] || ''),
        companyCategory: CircuitString.fromString(parsedData["Company Category"] || ''),
        companySubcategory: CircuitString.fromString(parsedData["Company Subcategory"] || ''),
        companyStatus: CircuitString.fromString(parsedData["Company Status"]),
        authorizedCapital: Field(parsedData["Authorized Capital"] ?? 0),
        paidUpCapital: Field(parsedData["Paid-up Capital"] ?? 0),
        lastAGMDate: CircuitString.fromString(parsedData["Last AGM Date"] || ''),
        balanceSheetDate: CircuitString.fromString(parsedData["Balance Sheet Date"] || ''),
        activeCompliance: CircuitString.fromString(parsedData["Active Compliance"]),
        companyActivity: CircuitString.fromString(parsedData["Company Activity"] || ''),
        jurisdiction: CircuitString.fromString(parsedData["Jurisdiction"] || ''),
        regionalDirector: CircuitString.fromString(parsedData["Regional Director"] || ''),
        mcaID: Field(parsedData["MCA ID"] ?? 0),
    });

    // =================================== Oracle Signature Generation ===================================
    // Create message hash
    const complianceDataHash = Poseidon.hash(ComplianceData.toFields(complianceData));

    // Sign the message hash with the oracle's private key
   const oracleSignature = Signature.create(Oracle_Private_key.key, [complianceDataHash]);

   
    // =================================== Generate Proof ===================================
    const proof = await CorporateRegistration.proveCompliance(Field(0), complianceData, oracleSignature);

    // Verify proof
    console.log("Before verification, Initial value of num:", zkApp.num.get().toJSON());
    const txn = await Mina.transaction(
        senderAccount,
        async () => {
           await zkApp.verifyComplianceWithProof(proof);
        }
    );
    await txn.prove();
    await txn.sign([senderKey]).send();
    console.log("Final value of num:", zkApp.num.get().toJSON());
    console.log('✅ Proof verified successfully!');
}

main().catch(err => {
    console.error('Error:', err);
});
