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
  MerkleMap,
  MerkleMapWitness,
  Permissions,
  Int64,
  UInt64,
  Circuit} from 'o1js';

//import { ProofOfInternationalTradeComplianceProof } from './ProofOfInternationalTradeCompliance';

// Define the Public Output Structure
export class RiskPublicOutput extends Struct({
  riskThresholdToProve: Field,
  riskEvaluated: Field,
  //creatorPublicKey: PublicKey,
}) {} 

class ACTUSData extends Struct({
  scenarioID: CircuitString,
  scenarioName: CircuitString,
  //mcaID: CircuitString,
  //businessPANID: CircuitString,
  riskEvaluated: Field,
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

class Point extends Struct({ x: Field, y: Field }) {
  static add(a: Point, b: Point) {
    return { x: a.x.add(b.x), y: a.y.add(b.y) };
  }
}


class Epoch extends Struct({index:Field, date:String, cashFlow:Field}) {

  static valueAtEpoch(a:Epoch) {
    return { index: a.index, date: a.date, cashFlow:a.cashFlow};
  }

}

class ACTUSTimeSeries extends Struct({
  epochs: [Epoch,Epoch,Epoch,Epoch,Epoch],

}) {}

class Points8 extends Struct({
  points: [Point, Point, Point, Point, Point, Point, Point, Point],
}) {}



// zk-SNARK Program for Compliance.. which verifies corporate registration and international trade compliance.
//export const proofOfInternationalTradeCompliance = ZkProgram({
  const RiskAnalysis = ZkProgram({
    
    name: 'RiskAnalysis',
    
    publicInput: Field,
    publicOutput: RiskPublicOutput,

    methods: {

      init: {
        privateInputs: [],

          async method(state: Field): Promise<RiskPublicOutput> {
          //console.log(' in recurrsion  Add  :  init',Date.now());
             state.assertEquals(Field(1));

             return new RiskPublicOutput({
              riskThresholdToProve: Field(1),
              riskEvaluated: Field(1),
              //creatorPublicKey: creatorPublicKey,
            });

        },
      },

        evaluate: { // Generates the public output
          privateInputs: [SelfProof, SelfProof],

          async method(
            //complianceToProve: Field,
            //complianceData: ComplianceData,
            newState: Field,
            earlierProof1: SelfProof<Field, RiskPublicOutput>,
            earlierProof2: SelfProof<Field, RiskPublicOutput>
            //oracleSignature: Signature,
            //creatorSignature: Signature,
            //creatorPublicKey: PublicKey
          ): Promise<RiskPublicOutput> {
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
    
            earlierProof1.verify();
            earlierProof2.verify();

            let retRiskPublicOutput = new RiskPublicOutput({
              riskThresholdToProve: Field(1),
              riskEvaluated: Field(1),
              //creatorPublicKey: creatorPublicKey,
            })

            newState.assertEquals(
              //Field(earlierProof1.publicOutput.complianceStatusCode.toJSON()).mul(Field(earlierProof2.publicOutput.complianceStatusCode.toJSON()))
                          Field(earlierProof1.publicOutput.riskEvaluated).mul(Field(earlierProof2.publicOutput.riskEvaluated))
             
            );

            retRiskPublicOutput.riskEvaluated = Field(1)
      
            return  retRiskPublicOutput;           
            ;      
          },
        }, 

      proveRiskAlignment: { // Generates the public output
        privateInputs: [
          ACTUSData,
          //Signature,
          //Signature,
          //PublicKey,
        ],
        async method(
          riskThresholdToProve: Field,
          riskData: ACTUSData,
          //oracleSignature: Signature,
          //creatorSignature: Signature,
          //creatorPublicKey: PublicKey
        ): Promise<RiskPublicOutput> {
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
             //console.log(' data bef .. ',complianceData.complianceStatusCode)
          riskData.riskEvaluated.assertEquals(Field(1))

          return new RiskPublicOutput({
            //corporateComplianceToProve: corporateComplianceToProve,
            //currCompanyComplianceStatusCode: corporateRegistrationData.currCompanyComplianceStatusCode,
            riskThresholdToProve: Field(1),
            //complianceStatusCode: Field(1),
            riskEvaluated: Field(1),
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

  /*
  let compliance = await RiskAnalysis.compile()
  let complianceVerKey = compliance.verificationKey

  const proof0 = await RiskAnalysis.init(Field(1)); 

  //let corporateRegistationInstance = await (new CorporateRegistration.proveCompliance() );

  const riskScenario1Data = {
    companyID:'101',
    companyName:'India Exports 1',
    mcaID: '201',
    businessPANID: '1001',
    riskEvaluated:Field(1),

    
   // Needs 1 contract with timeseries of 5 . 
     // For each of the epochs ( for now identified with an epoch id key) in the timeseries. need date  epochdate and a epoch amount as integer to be stored 
  // 

  // Needs 2 contracts . Each should have a timeseries of 5 . 
      // For each of the epochs ( for now identified with an epoch id key) in the timeseries. need date  epochdate and a epoch amount as integer to be stored 
  
  // 

  //---------------------

  };

  const risk1Data = new ACTUSData({
    scenarioID: CircuitString.fromString(riskScenario1Data .companyID),
    scenarioName: CircuitString.fromString(riskScenario1Data .companyName),
    //mcaID: CircuitString.fromString(corpData .mcaID),
    //businessPANID: CircuitString.fromString(corpData .businessPANID),
    riskEvaluated: Field(riskScenario1Data.riskEvaluated),
  });

  let riskScenario1Proof = await RiskAnalysis.proveRiskAlignment(Field(1),risk1Data)

  //console.log ( ' corpRegProof  ' , corpRegProof,' .. code .. ' , corpRegProof.publicOutput.complianceStatusCode.toJSON()) ;

  const riskScenario2Data = {
    companyID:'101',
    companyName:'India Exports 1',
    mcaID: '201',
    businessPANID: '1001',
    riskEvaluated:Field(1),
  };

  const risk2Data = new ACTUSData({
    scenarioID: CircuitString.fromString(riskScenario2Data .companyID),
    scenarioName: CircuitString.fromString(riskScenario2Data .companyName),
    //mcaID: CircuitString.fromString(corpData .mcaID),
    //businessPANID: CircuitString.fromString(corpData .businessPANID),
    riskEvaluated: Field(riskScenario2Data.riskEvaluated),
  });

  let riskScenario2Proof = await RiskAnalysis.proveRiskAlignment(Field(1),risk2Data)

  let valRisk1Proof = riskScenario1Proof.publicOutput.riskEvaluated.toJSON()
  console.log ( ' riskScenario1Proof  ' , riskScenario1Proof,' .. code .. ', valRisk1Proof) ;
 
  let valRisk2Proof = riskScenario2Proof.publicOutput.riskEvaluated.toJSON()
  console.log ( ' riskScenario2Proof  ' , riskScenario2Proof,' .. code .. ', valRisk2Proof) ;

/*
  let recurrsiveProof = await RiskAnalysis.compliance(Field(1), corpRegProof,tradeProof  )
  let valRecurrsiveProof = recurrsiveProof.publicOutput.complianceStatusCode.toJSON()

  const globalLEIData = {
    companyID:'101',
    companyName:'India Exports 1',
    globalLEIID: '1357890034578',
    //businessPANID: '1001',
    complianceStatusCode:Field(1),
  };

  const globalLEIComplianceData = new ACTUSData({
    companyID: CircuitString.fromString(globalLEIData.companyID),
    companyName: CircuitString.fromString(globalLEIData.companyName),
    //dgftID: CircuitString.fromString(tradeDGFTData.dgftID),
    //businessPANID: CircuitString.fromString(tradeDGFTData.businessPANID),
    complianceStatusCode: Field(globalLEIData.complianceStatusCode),
  });

  let leiProof = await RiskAnalysis.proveCompliance(Field(1),globalLEIComplianceData )
  console.log ( ' recurrsiveProof LEI ' , recurrsiveProof,' ..  LEI code .. ', valRecurrsiveProof );
*/

};

// Define a function to generate a new proof (customize as needed)
//const generateNewProof = async () => {
  // Implement the logic to generate a new proof
  // This is a placeholder implementation
//  return '';
//};

const point1 = { x: Field(10), y: Field(4) };
const point2 = { x: Field(1), y: Field(2) };

const pointSum = Point.add(point1, point2);

console.log(`pointSum Fields: ${Point.toFields(pointSum)}`);

const points = new Array(8)
  .fill(null)
  .map((_, i) => ({ x: Field(i), y: Field(i * 10) }));
const points8: Points8 = { points };

console.log(`points8 JSON: ${JSON.stringify(points8)}`);

//let refDate = Date.arguments(Date.parse('2024-10-15'))
// PLEASE remember month indexing starts from 0.

let refDate = Date.UTC(2024, 9, 15);

const refDateMs = Number(refDate);
const dateRef = new Date(refDateMs);

console.log ('date1 ref is ..', dateRef);

const date1= new Date(Number((Date.UTC(2024, 9, 15))));
const date2= new Date(Number((Date.UTC(2024, 10, 15))));
const date3= new Date(Number((Date.UTC(2024, 11, 15))));
const date4= new Date(Number((Date.UTC(2024, 12, 15))));
const date5= new Date(Number((Date.UTC(2025, 1, 15))));

let dateArr =[date1,date2,date3,date4,date5]

console.log(`dateArr JSON: ${JSON.stringify(dateArr)}`);

const epochs = new Array(5)
  .fill(null)
  .map((_, i) => ({ index: Field(i), date: dateArr[i].toString(),cashFlow: Field(20000) }));

const timeSeries1: ACTUSTimeSeries = { epochs };
console.log(`timeSeries1 JSON: ${JSON.stringify(timeSeries1)}`);

main();