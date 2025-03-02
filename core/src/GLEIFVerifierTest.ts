import { Field, Mina, PrivateKey, AccountUpdate, CircuitString } from 'o1js';
import { GLEIF, GLEIFComplianceData } from './GLEIFZKProgram.js';
import { GLEIFVerifierSmartContract } from './GLEIFVerifierSmartContract.js';
import axios from 'axios';

async function main() {
    const useProof = false;

    const Local = await Mina.LocalBlockchain({ proofsEnabled: useProof });
    Mina.setActiveInstance(Local);

    const deployerAccount = Local.testAccounts[0];
    const deployerKey = deployerAccount.key;
    const senderAccount = Local.testAccounts[1];
    const senderKey = senderAccount.key;

    console.log('Compiling...');
    await GLEIF.compile();
    const { verificationKey } = await GLEIFVerifierSmartContract.compile();
    console.log("Verification key is successful");

    const zkAppKey = PrivateKey.random();
    const zkAppAddress = zkAppKey.toPublicKey();
    console.log("ZKAppAddress is successful");

    const zkApp = new GLEIFVerifierSmartContract(zkAppAddress);
    console.log("zkApp is successful");
    
    console.log("Mina transaction is successful");

    const deployTxn = await Mina.transaction(deployerAccount, async () => {
        AccountUpdate.fundNewAccount(deployerAccount);
        await zkApp.deploy({ verificationKey });
    });

    console.log("Deploy transaction is successful");
    await deployTxn.sign([deployerKey, zkAppKey]).send();
    console.log("Deploy transaction signed successfully");

    console.log("Fetching compliance data...");
    const BASEURL = "https://9a4d8990-c981-42fa-ace4-675ddec17321.mock.pstmn.io";
    const companyname = "vernon_gleif";
    const response = await axios.get(`${BASEURL}/${companyname}`);
    const parsedData = response.data;

    console.log(parsedData);
    
    const GLEIFcomplianceData = new GLEIFComplianceData({
        type: CircuitString.fromString(parsedData.data[0].type || ''),
        id: CircuitString.fromString(parsedData.data[0].id || ''),
        lei: CircuitString.fromString(parsedData.data[0].attributes.lei || ''),
        name: CircuitString.fromString(parsedData.data[0].attributes.entity.legalName.name || ''),
        legalName_language: CircuitString.fromString(parsedData.data[0].attributes.entity.legalName.language || ''),

        otherNames: CircuitString.fromString(parsedData.data[0].attributes.entity.otherNames?.[0] || ''),
        transliteratedOtherNames: CircuitString.fromString(parsedData.data[0].attributes.entity.transliteratedOtherNames?.[0] || ''),

        legalAddress_language: CircuitString.fromString(parsedData.data[0].attributes.entity.legalAddress.language || ''),
        legalAddress_addressLines: CircuitString.fromString(parsedData.data[0].attributes.entity.legalAddress.addressLines[0] || ''),
        legalAddress_city: CircuitString.fromString(parsedData.data[0].attributes.entity.legalAddress.city || ''),
        legalAddress_region: CircuitString.fromString(parsedData.data[0].attributes.entity.legalAddress.region || ''),
        legalAddress_country: CircuitString.fromString(parsedData.data[0].attributes.entity.legalAddress.country || ''),
        legalAddress_postalCode: CircuitString.fromString(parsedData.data[0].attributes.entity.legalAddress.postalCode || ''),
        headquartersAddress_language: CircuitString.fromString(parsedData.data[0].attributes.entity.headquartersAddress.language || ''),
        headquartersAddress_addressLines: CircuitString.fromString(parsedData.data[0].attributes.entity.headquartersAddress.addressLines[0] || ''),
        headquartersAddress_city: CircuitString.fromString(parsedData.data[0].attributes.entity.headquartersAddress.city || ''),
        headquartersAddress_region: CircuitString.fromString(parsedData.data[0].attributes.entity.headquartersAddress.region || ''),
        headquartersAddress_country: CircuitString.fromString(parsedData.data[0].attributes.entity.headquartersAddress.country || ''),
        headquartersAddress_postalCode: CircuitString.fromString(parsedData.data[0].attributes.entity.headquartersAddress.postalCode || ''),
        registeredAt_id: CircuitString.fromString(parsedData.data[0].attributes.entity.registeredAt.id || ''),
        registeredAt_other: CircuitString.fromString(parsedData.data[0].attributes.entity.registeredAt.other || ''),
        registeredAs: CircuitString.fromString(parsedData.data[0].attributes.entity.registeredAs || ''),
        jurisdiction: CircuitString.fromString(parsedData.data[0].attributes.entity.jurisdiction || ''),
        legalForm_id: CircuitString.fromString(parsedData.data[0].attributes.entity.legalForm.id || ''),
        legalForm_other: CircuitString.fromString(parsedData.data[0].attributes.entity.legalForm.other || ''),
        status: CircuitString.fromString(parsedData.data[0].attributes.entity.status || ''),

        expiration: CircuitString.fromString(parsedData.data[0].attributes.entity?.expiration || ''),

        creationDate: CircuitString.fromString(parsedData.data[0].attributes.entity.creationDate || ''),
        subCategory: CircuitString.fromString(parsedData.data[0].attributes.entity.subCategory || ''),

        otherAddresses: CircuitString.fromString(parsedData.data[0].attributes.entity.otherAddresses?.[0] || ''), 
        eventGroups:CircuitString.fromString(parsedData.data[0].attributes.entity.eventGroups?.[0]||''), 

        initialRegistrationDate:CircuitString.fromString(parsedData.data[0].attributes.registration.initialRegistrationDate||''), 
        lastUpdateDate:CircuitString.fromString(parsedData.data[0].attributes.registration.lastUpdateDate||''), 
        registration_status:CircuitString.fromString(parsedData.data[0].attributes.registration.status||''), 
        nextRenewalDate:CircuitString.fromString(parsedData.data [0].attributes.registration.nextRenewalDate||''), 
        managingLou:CircuitString .fromString(parsedData.data [0].attributes.registration.managingLou||''), 
        corroborationLevel:CircuitString.fromString (parsedData.data[0].attributes.registration.corroborationLevel||''), 
        validatedAt_id:CircuitString.fromString(parsedData.data[0].attributes.registration.validatedAt.id||''), 
        validatedAt_other:CircuitString.fromString(parsedData.data[0].attributes.registration.validatedAt.other||''), 
        validatedAs  : CircuitString.fromString(parsedData.data[0].attributes.registration.validatedAs || ''), 

        otherValidationAuthorities:CircuitString.fromString(parsedData.data[0].attributes.registration.otherValidationAuthorities?.[0] || ''),
        
        bic : CircuitString.fromString(parsedData.data[0].attributes.bic[0] || ''),
        mic: CircuitString.fromString (parsedData.data[0].attributes.mic||''),
        ocid : CircuitString.fromString(parsedData.data[0].attributes.ocid||''),
        spglobal : CircuitString.fromString(parsedData.data[0].attributes.spglobal ?.[0]||''),
        conformityFlag:CircuitString.fromString(parsedData.data[0].attributes.conformityFlag||''),
        managingLou_related:CircuitString.fromString(parsedData.data[0].relationships["managing-lou"].links.related||''),
        lei_issuer_related:CircuitString.fromString(parsedData.data[0].relationships["lei-issuer"].links.related||''),
        field_modifications_related:CircuitString.fromString(parsedData.data[0].relationships["field-modifications"].links.related||''),
        direct_parent_relationship_record:CircuitString.fromString(parsedData.data[0].relationships["direct-parent"].links["relationship-record"]||''),
        direct_parent_lei_record:CircuitString.fromString(parsedData.data[0].relationships["direct-parent"].links["lei-record"]||''),
        ultimate_parent_relationship_record:CircuitString.fromString(parsedData.data[0].relationships["ultimate-parent"].links["relationship-record"]||''),
        ultimate_parent_lei_record:CircuitString.fromString(parsedData.data[0].relationships["ultimate-parent"].links["lei-record"]||''),
        isins_related:CircuitString.fromString(parsedData.data[0].relationships.isins.links.related||''),
        links_self:CircuitString.fromString(parsedData.data[0].links.self || '')
   });

   const proof = await GLEIF.proveCompliance(Field(0), GLEIFcomplianceData);

   console.log("Before verification, Initial value of num:", zkApp.num.get().toJSON());
   // Verify proof
   const txn = await Mina.transaction(senderAccount, async () => {
       await zkApp.verifyComplianceWithProof(proof);
   });

   const proof1 = await txn.prove();

   console.log("Proof generated successfully");
   console.log(senderAccount.toJSON());
   console.log(senderKey.toJSON(), senderKey.toPublicKey());
   console.log("Generated Proof:", proof1.toPretty());
   await txn.sign([senderKey]).send();
   console.log("Final value of num:", zkApp.num.get().toJSON());

   console.log('✅ Proof verified successfully!');
}

main().catch(err => {
   console.error('Error:', err);
});
