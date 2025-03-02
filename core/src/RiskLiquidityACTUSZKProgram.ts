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
    Circuit,
    Bool} from 'o1js';
  
 // import axios from 'axios';
 export class ACTUSData extends Struct({
  scenarioID: CircuitString,
  scenarioName: String,
  riskEvaluated: Field,
  cashInflows: Array(Array(Number)),  // Dynamic array of cash inflows
  cashOutflows: Array(Array(Number)), // Dynamic array of cash outflows
  newInvoiceAmount: Number,           // Amount of the new invoice
  newInvoiceEvaluationMonth: Number,  // Evaluation month for the new invoice
  liquidityThreshold: Number,        // Required liquidity ratio
}){}
  
  //import { compileProgram } from 'o1js/dist/node/lib/proof-system/zkprogram.js';
  
  
  // Define the Public Output Structure
  export class CorporateRegistrationPublicOutput extends Struct({
    out:Bool
    //corporateComplianceToProveHash: Field,
    //currCorporateComplianceStatusCodeHash: Field,
    //outputExpectedHash: Field,
    //outputActualHash: Field,
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
  }
  
  

   export const CorporateRegistration = ZkProgram({
      name: 'CorporateRegistration',
      publicInput: Field,
      publicOutput: CorporateRegistrationPublicOutput,
      methods: {
  
        proveCompliance: { // Generates the public output
          
          privateInputs: [
           ACTUSData,
            //Signature,
            //Signature,
            //PublicKey,
          ],
          
          async method(
            
            corporateRegistationToProve: Field,
            //expectedActiveComplianceHash: CircuitString.fromString("Active").hash(),
            //corporateRegistrationData: CorporateRegistrationData,
            corporateRegistrationData: ACTUSData,
  
            //oracleSignature: Signature,
            //creatorSignature: Signature,
            //creatorPublicKey: PublicKey
          ): Promise<CorporateRegistrationPublicOutput> {
            
  const cashInfl = corporateRegistrationData.cashInflows;
  const cashOutfl = corporateRegistrationData.cashOutflows;
  const monthsCount = cashInfl.length;
  const newInvoiceAmount = corporateRegistrationData.newInvoiceAmount;
  const newInvoiceEvaluationMonth = corporateRegistrationData.newInvoiceEvaluationMonth;
  const liquidityThreshold =corporateRegistrationData.liquidityThreshold;

  let cumulativeCashFlow = 0;
  let out = Bool(false);

  // Iterate over each month in the dynamic range
  for (let month = 0; month < monthsCount; month++) {
    let inflow = cashInfl[month]?.reduce((sum: any, val: any) => sum + val, 0) || 0;
    let outflow = cashOutfl[month]?.reduce((sum: any, val: any) => sum + val, 0) || 0;

    const totalOutflow = outflow + (month === newInvoiceEvaluationMonth ? newInvoiceAmount : 0);
    const netCashFlow = inflow - totalOutflow;
    cumulativeCashFlow += netCashFlow;

    const totalOutflowYear = cashOutfl.flat().reduce((acc: any, value: any) => acc + value, 0) + newInvoiceAmount;
    const liqRatio = cumulativeCashFlow / totalOutflowYear;

    out = liqRatio >= liquidityThreshold ? Bool(true) : Bool(false);
  }
            return new CorporateRegistrationPublicOutput({
              out
              //corporateComplianceToProve: corporateComplianceToProve,
              //currCompanyComplianceStatusCode: corporateRegistrationData.currCompanyComplianceStatusCode,
              //outputExpectedHash: Field(corporateRegistationToProveHash),
              //outputActualHash: Field(1),
              //creatorPublicKey: creatorPublicKey,
             // complianceProof: CorporateRegistration.proveCompliance(Field(0),complianceData)
  
            });
        },
  
  
      },
    }});
  
   
  export class CorporateRegistrationProof extends ZkProgram.Proof(CorporateRegistration) {}
