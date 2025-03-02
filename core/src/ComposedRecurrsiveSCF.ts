import {
  Field,
  Signature,
  SmartContract,
  PublicKey,
  Struct,
  ZkProgram,
  Proof,
  CircuitString,
  method,
  Permissions,
  Circuit} from 'o1js';
import { ProofOfInternationalTradeComplianceProof } from './ProofOfInternationalTradeCompliance';


// Define the Public Output Structure
export class CorporateRegistrationPublicOutput extends Struct({
  corporateComplianceToProve: Field,
  currCorporateComplianceStatusCode: Field,
  //creatorPublicKey: PublicKey,
}) {} 

export class InternationalTradeCompliancePublicOutput extends Struct({
  internationalTradeComplianceToProve: Field,
  currEXIMComplianceStatusCode: Field,
  //creatorPublicKey: PublicKey,
}) {} 


class CorporateRegistrationData extends Struct({
  companyID: CircuitString,
  companyName: CircuitString,
  mcaID: CircuitString,
  businessPANID: CircuitString,
  currCorporateComplianceStatusCode: Field,
  //currentDate: Field,
}) {
  // method for signature creation and verification
  // toFields(): Field[] {
  //   return [
  //     ...this.companyID.values.map((item) => item.toField()),
  //     ...this.companyName.values.map((item) => item.toField()),
  //     ...this.mcaID.values.map((item) => item.toField()),
  //     ...this.businessPANID.values.map((item) => item.toField()),
  //     //...this.currCompanyComplianceStatusCode.values.map((item) => item.toField()),
  //     //this.currentDate,
  //   ];
 // }
}

class InternationalTradeComplianceData extends Struct({
  companyID: CircuitString,
  companyName: CircuitString,
  dgftID: CircuitString,
  businessPANID: CircuitString,
  currEXIMComplianceStatusCode: Field,
  //currentDate: Field,
}) {
  // method for signature creation and verification
  //toFields(): Field[] {
    //return [
     // ...this.companyID.values.map((item) => item.toField()),
     // ...this.companyName.values.map((item) => item.toField()),
     // ...this.dgftID.values.map((item) => item.toField()),
     // ...this.businessPANID.values.map((item) => item.toField()),
      //...this.currEXIMComplianceStatusCode.values.map((item) => item.toField()),
      //this.currentDate,
    //];
  //}
}


// zk-SNARK Program for Compliance.. which verifies corporate registration and international trade compliance.
//export const proofOfInternationalTradeCompliance = ZkProgram({
  const CorporateRegistration = ZkProgram({
    name: 'CorporateRegistration',
    publicInput: Field,
    publicOutput: CorporateRegistrationPublicOutput,
    methods: {
      proveCompliance: { // Generates the public output
        privateInputs: [
         CorporateRegistrationData,
          //Signature,
          //Signature,
          //PublicKey,
        ],
        async method(
          corporateRegistationToProve: Field,
          corporateRegistrationData: CorporateRegistrationData,
          //oracleSignature: Signature,
          //creatorSignature: Signature,
          //creatorPublicKey: PublicKey
        ): Promise<CorporateRegistrationPublicOutput> {
          /*
          const validSignature = oracleSignature.verify(
            PublicKey.fromBase58('B62qmXFNvz2sfYZDuHaY5htPGkx1u2E2Hn3rWuDWkE11mxRmpijYzWN'),
            CorporateRegistrationData.toFields(corporateRegistrationData)
          );
          validSignature.assertTrue();
  
          const validSignature_ = creatorSignature.verify(
            creatorPublicKey,
            CorporateRegistrationData.toFields(corporateRegistrationData)
          );
          validSignature_.assertTrue();
          */
  
  
          /*
          const companyRegistration = evalCorporateCompliance(corporateRegistrationData.currCompanyComplianceStatusCode);
          corporateRegistrationData.currCompanyComplianceStatusCode.greaterThan(Field(0)).assertTrue();
          */

          console.log(' data bef .. ',corporateRegistrationData.currCorporateComplianceStatusCode) 
          corporateRegistrationData.currCorporateComplianceStatusCode.assertEquals(Field(1));
          
          console.log(' data  aft .. ',corporateRegistrationData.currCorporateComplianceStatusCode) 
          return new CorporateRegistrationPublicOutput({
            //corporateComplianceToProve: corporateComplianceToProve,
            //currCompanyComplianceStatusCode: corporateRegistrationData.currCompanyComplianceStatusCode,
            corporateComplianceToProve: Field(1),
            currCorporateComplianceStatusCode: Field(1),
            //creatorPublicKey: creatorPublicKey,
          });
  
  
        },
      },
    },
  });


// zk-SNARK Program for Compliance.. which verifies corporate registration and international trade compliance.
//export const proofOfInternationalTradeCompliance = ZkProgram({
  const InternationalTradeCompliance = ZkProgram({
  name: 'InternationalTradeCompliance',
  publicInput: Field,
  publicOutput: InternationalTradeCompliancePublicOutput,
  methods: {
    proveCompliance: { // Generates the public output
      privateInputs: [
       InternationalTradeComplianceData,
        //Signature,
        //Signature,
        //PublicKey,
      ],
      async method(
        tradeComplianceToProve: Field,
        tradeComplianceData: InternationalTradeComplianceData,
        //oracleSignature: Signature,
        //creatorSignature: Signature,
        //creatorPublicKey: PublicKey
      ): Promise<InternationalTradeCompliancePublicOutput> {
        /*
        const validSignature = oracleSignature.verify(
          PublicKey.fromBase58('B62qmXFNvz2sfYZDuHaY5htPGkx1u2E2Hn3rWuDWkE11mxRmpijYzWN'),
          InternationalTradeComplianceData.toFields(tradeComplianceData)
        );
        validSignature.assertTrue();

        const validSignature_ = creatorSignature.verify(
          creatorPublicKey,
          InternationalTradeComplianceData.toFields(tradeComplianceData)
        );
        validSignature_.assertTrue();
        */


        /*
        const companyRegistration = evalCorporateCompliance(corporateRegistrationData.currCompanyComplianceStatusCode);
        corporateRegistrationData.currCompanyComplianceStatusCode.greaterThan(Field(0)).assertTrue();
        */
        tradeComplianceData.currEXIMComplianceStatusCode.assertEquals(Field(1));

        return new InternationalTradeCompliancePublicOutput({
          //corporateComplianceToProve: corporateComplianceToProve,
          //currCompanyComplianceStatusCode: corporateRegistrationData.currCompanyComplianceStatusCode,
          internationalTradeComplianceToProve: Field(1),
          currEXIMComplianceStatusCode: Field(1),
          //creatorPublicKey: creatorPublicKey,
        });

      },
    },
  },
});

/*
export const ProofOfCompliance_ = ZkProgram.Proof(proofOfCompliance);
export class ProofOfCompliance extends ProofOfCompliance_ {}
export class ProofOfCompanyRegistrationProof extends ZkProgram.Proof(proofOfCompliance) {}

// Define the ProofOfCompanyRegistration Smart Contract 
export class ProofOfCompanyRegistration extends SmartContract {
  events = {
    'provided-valid-proof': PublicOutput,
  };

  init() {
    super.init();
    this.account.permissions.set({
      ...Permissions.default(),
    });
  }

  @method async verifyProof(proof: ProofOfCompliance) {
    proof.verify();
    this.emitEvent('provided-valid-proof', proof.publicOutput);
  }
}
*/

// Main function to check proofs, perform multiplication, and generate new proof
const main = async () => {

  console.log('Compiling proofs...');

  let corporateRegistration = await CorporateRegistration.compile()
  let corporateRegistrationVerKey = corporateRegistration.verificationKey

  let tradeCompliance = await InternationalTradeCompliance.compile()
  let tradeComplianceVerKey = tradeCompliance.verificationKey

  //let corporateRegistationInstance = await (new CorporateRegistration.proveCompliance() );

  const corpData = {
    companyID:'101',
    companyName:'India Exports 1',
    mcaID: '201',
    businessPANID: '1001',
    currCompanyComplianceStatusCode:'1',
  };

  const corpRegData = new CorporateRegistrationData({
    companyID: CircuitString.fromString(corpData .companyID),
    companyName: CircuitString.fromString(corpData .companyName),
    mcaID: CircuitString.fromString(corpData .mcaID),
    businessPANID: CircuitString.fromString(corpData .businessPANID),
    currCorporateComplianceStatusCode: Field(corpData .currCompanyComplianceStatusCode),
  });

  let corpRegProof = await CorporateRegistration.proveCompliance(Field(0),corpRegData)

  console.log ( ' corpRegProof  ' , corpRegProof,' .. code .. ' , corpRegProof.publicOutput.currCorporateComplianceStatusCode.toJSON()) ;


  const tradeDGFTData = {
    companyID:'101',
    companyName:'India Exports 1',
    dgftID: '301',
    businessPANID: '1001',
    currEXIMComplianceStatusCode:Field(1),
  };

  const internationalTradeComplianceData = new InternationalTradeComplianceData({
    companyID: CircuitString.fromString(tradeDGFTData.companyID),
    companyName: CircuitString.fromString(tradeDGFTData.companyName),
    dgftID: CircuitString.fromString(tradeDGFTData.dgftID),
    businessPANID: CircuitString.fromString(tradeDGFTData.businessPANID),
    currEXIMComplianceStatusCode: Field(tradeDGFTData.currEXIMComplianceStatusCode),
  });

  let tradeProof = await InternationalTradeCompliance.proveCompliance(Field(0),internationalTradeComplianceData)

  let valCompProof = corpRegProof.publicOutput.currCorporateComplianceStatusCode.toJSON()
  console.log ( ' corpRegProof  ' , corpRegProof,' .. code .. ', valCompProof) ;
 
  let valTradeProof = tradeProof.publicOutput.currEXIMComplianceStatusCode.toJSON()

  console.log ( ' tradeProof  ' , tradeProof,' .. code .. ' , valTradeProof);

  let corpRegProofField =  Field(valCompProof.valueOf())
  let tradeProofField =  Field(valTradeProof.valueOf())

  let multipliedEXIMCompliance = corpRegProofField.mul((tradeProofField))

  console.log ( ' corpRegProofField  '       , corpRegProofField );
  console.log ( ' tradeProofField  '         , tradeProofField );
  console.log ( ' multipliedEXIMCompliance ' , multipliedEXIMCompliance );
  
  // Print the result as the third proof
  console.log('Multiplied EXIM Compliance Status Code:', multipliedEXIMCompliance.toString());

};

// Define a function to generate a new proof (customize as needed)
//const generateNewProof = async () => {
  // Implement the logic to generate a new proof
  // This is a placeholder implementation
//  return '';
//};

main();
