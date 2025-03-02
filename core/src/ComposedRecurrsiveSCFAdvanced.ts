import {
  Field,
  Signature,
  SmartContract,
  PublicKey,
  Struct,
  ZkProgram,
  Proof,
  SelfProof,
  CircuitString,
  method,
  Permissions,
  Circuit} from 'o1js';

//import { ProofOfInternationalTradeComplianceProof } from './ProofOfInternationalTradeCompliance';


// Define the Public Output Structure
export class CompliancePublicOutput extends Struct({
  complianceToProve: Field,
  complianceStatusCode: Field,
  //creatorPublicKey: PublicKey,
}) {} 

class ComplianceData extends Struct({
  companyID: CircuitString,
  companyName: CircuitString,
  //mcaID: CircuitString,
  //businessPANID: CircuitString,
  complianceStatusCode: Field,
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

// zk-SNARK Program for Compliance.. which verifies corporate registration and international trade compliance.
//export const proofOfInternationalTradeCompliance = ZkProgram({
  const Compliance = ZkProgram({
    
    name: 'Compliance',
    
    publicInput: Field,
    publicOutput: CompliancePublicOutput,

    methods: {


      init: {
        privateInputs: [],

          async method(state: Field): Promise<CompliancePublicOutput> {
          //console.log(' in recurrsion  Add  :  init',Date.now());
             state.assertEquals(Field(1));

             return new CompliancePublicOutput({
              //corporateComplianceToProve: corporateComplianceToProve,
              //currCompanyComplianceStatusCode: corporateRegistrationData.currCompanyComplianceStatusCode,
              complianceToProve: Field(1),
              complianceStatusCode: Field(1),
              //creatorPublicKey: creatorPublicKey,
            });

        },
      },

        compliance: { // Generates the public output
          privateInputs: [SelfProof, SelfProof],

          async method(
            //complianceToProve: Field,
            //complianceData: ComplianceData,
            newState: Field,
            earlierProof1: SelfProof<Field, CompliancePublicOutput>,
            earlierProof2: SelfProof<Field, CompliancePublicOutput>
            //oracleSignature: Signature,
            //creatorSignature: Signature,
            //creatorPublicKey: PublicKey
          ): Promise<CompliancePublicOutput> {
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
  
            //console.log(' data bef .. ',complianceData.complianceStatusCode)
            //complianceData.complianceStatusCode.assertEquals(Field(1))
            //console.log(' data sft .. ',complianceData.complianceStatusCode)

            earlierProof1.verify();
            earlierProof2.verify();

            newState.assertEquals(

              //Field(earlierProof1.publicOutput.complianceStatusCode.toJSON()).mul(Field(earlierProof2.publicOutput.complianceStatusCode.toJSON()))
            
              Field(earlierProof1.publicOutput.complianceStatusCode).mul(Field(earlierProof2.publicOutput.complianceStatusCode))

            );
      
            return new CompliancePublicOutput({
              //corporateComplianceToProve: corporateComplianceToProve,
              //currCompanyComplianceStatusCode: corporateRegistrationData.currCompanyComplianceStatusCode,
              complianceToProve: Field(1),
              complianceStatusCode: Field(1),
              //creatorPublicKey: creatorPublicKey,
            });
      
          },
        }, 


      proveCompliance: { // Generates the public output
        privateInputs: [
         ComplianceData,
          //Signature,
          //Signature,
          //PublicKey,
        ],
        async method(
          complianceToProve: Field,
          complianceData: ComplianceData,
          //oracleSignature: Signature,
          //creatorSignature: Signature,
          //creatorPublicKey: PublicKey
        ): Promise<CompliancePublicOutput> {
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

          //console.log(' data bef .. ',complianceData.complianceStatusCode)
          complianceData.complianceStatusCode.assertEquals(Field(1))
          //console.log(' data sft .. ',complianceData.complianceStatusCode)

          return new CompliancePublicOutput({
            //corporateComplianceToProve: corporateComplianceToProve,
            //currCompanyComplianceStatusCode: corporateRegistrationData.currCompanyComplianceStatusCode,
            complianceToProve: Field(1),
            //complianceStatusCode: Field(1),
            complianceStatusCode: Field(1),
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

  let compliance = await Compliance.compile()
  let complianceVerKey = compliance.verificationKey

  const proof0 = await Compliance.init(Field(1)); 

  //let corporateRegistationInstance = await (new CorporateRegistration.proveCompliance() );

  const corpData = {
    companyID:'101',
    companyName:'India Exports 1',
    mcaID: '201',
    businessPANID: '1001',
    currCompanyComplianceStatusCode:Field(1),
  };

  const corpRegData = new ComplianceData({
    companyID: CircuitString.fromString(corpData .companyID),
    companyName: CircuitString.fromString(corpData .companyName),
    //mcaID: CircuitString.fromString(corpData .mcaID),
    //businessPANID: CircuitString.fromString(corpData .businessPANID),
    complianceStatusCode: Field(corpData .currCompanyComplianceStatusCode),
  });

  let corpRegProof = await Compliance.proveCompliance(Field(1),corpRegData)

  //console.log ( ' corpRegProof  ' , corpRegProof,' .. code .. ' , corpRegProof.publicOutput.complianceStatusCode.toJSON()) ;

  const tradeDGFTData = {
    companyID:'101',
    companyName:'India Exports 1',
    dgftID: '301',
    businessPANID: '1001',
    complianceStatusCode:Field(1),
  };

  const internationalTradeComplianceData = new ComplianceData({
    companyID: CircuitString.fromString(tradeDGFTData.companyID),
    companyName: CircuitString.fromString(tradeDGFTData.companyName),
    //dgftID: CircuitString.fromString(tradeDGFTData.dgftID),
    //businessPANID: CircuitString.fromString(tradeDGFTData.businessPANID),
    complianceStatusCode: Field(tradeDGFTData.complianceStatusCode),
  });

  let tradeProof = await Compliance.proveCompliance(Field(1),internationalTradeComplianceData )

  let valCompProof = corpRegProof.publicOutput.complianceStatusCode.toJSON()
  console.log ( ' corpRegProof  ' , corpRegProof,' .. code .. ', valCompProof) ;
 
  let valTradeProof = tradeProof.publicOutput.complianceStatusCode.toJSON()

  console.log ( ' tradeProof  ' , tradeProof,' .. code .. ' , valTradeProof);

  let recurrsiveProof = await Compliance.compliance(Field(1), corpRegProof,tradeProof  )

  let valRecurrsiveProof = recurrsiveProof.publicOutput.complianceStatusCode.toJSON()


  const globalLEIData = {
    companyID:'101',
    companyName:'India Exports 1',
    globalLEIID: '1357890034578',
    //businessPANID: '1001',
    complianceStatusCode:Field(1),
  };

  const globalLEIComplianceData = new ComplianceData({
    companyID: CircuitString.fromString(globalLEIData.companyID),
    companyName: CircuitString.fromString(globalLEIData.companyName),
    //dgftID: CircuitString.fromString(tradeDGFTData.dgftID),
    //businessPANID: CircuitString.fromString(tradeDGFTData.businessPANID),
    complianceStatusCode: Field(globalLEIData.complianceStatusCode),
  });

  let leiProof = await Compliance.proveCompliance(Field(1),globalLEIComplianceData )

  console.log ( ' recurrsiveProof LEI ' , recurrsiveProof,' ..  LEI code .. ', valRecurrsiveProof );

};

// Define a function to generate a new proof (customize as needed)
//const generateNewProof = async () => {
  // Implement the logic to generate a new proof
  // This is a placeholder implementation
//  return '';
//};

main();
