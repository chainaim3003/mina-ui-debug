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
const MAX_LENGTH = 120; // Define a maximum length for cash flows

export class ACTUSData extends Struct({
    scenarioID: CircuitString,
    scenarioName: CircuitString,
    riskEvaluated: Field,
    cashInflows: Array(MAX_LENGTH).fill(Number),  // Fixed-size array
    cashOutflows: Array(MAX_LENGTH).fill(Number), // Fixed-size array
    newInvoiceAmount: Number,
    newInvoiceEvaluationMonth: Number,
    liquidityThreshold: Number,
    inflowLength: Number,
    outflowLength: Number
}) {
    constructor(data: {
        scenarioID: CircuitString,
        scenarioName: CircuitString,
        riskEvaluated: Field,
        cashInflows: number[],
        cashOutflows: number[],
        newInvoiceAmount: number,
        newInvoiceEvaluationMonth: number,
        liquidityThreshold: number,
        inflowLength: number,
        outflowLength: number
    }) {
        super(data);
        this.cashInflows = this.padArray(data.cashInflows, MAX_LENGTH);
        this.cashOutflows = this.padArray(data.cashOutflows, MAX_LENGTH);
    }

    private padArray(arr: number[], length: number): number[] {
        const paddedArray = [...arr];
        while (paddedArray.length < length) {
            paddedArray.push(0); // Pad with zeros or any other default value
        }
        return paddedArray.slice(0, length); // Ensure it does not exceed MAX_LENGTH
    }
}


//import { compileProgram } from 'o1js/dist/node/lib/proof-system/zkprogram.js';


// Define the Public Output Structure
export class liquidityratioDataPublicOutput extends Struct({
  out:Bool
  //corporateComplianceToProveHash: Field,
  //currCorporateComplianceStatusCodeHash: Field,
  //outputExpectedHash: Field,
  //outputActualHash: Field,
  //creatorPublicKey: PublicKey,
}) {} 


class liquidityratioData extends Struct({
  companyID: CircuitString,
  companyName: CircuitString,
  mcaID: CircuitString,
  businessPANID: CircuitString,
  currCorporateComplianceStatusCode: Field,
  //currentDate: Field,
}) {
}



 export const LiquidityRatio = ZkProgram({
    name: 'LiquidityRatio',
    publicInput: Field,
    publicOutput: liquidityratioDataPublicOutput,
    methods: {
      proveCompliance: { // Generates the public output
        privateInputs: [
         ACTUSData,
          //Signature,
          //Signature,
          //PublicKey,
        ],
        async method(
          
          LiquidityRatioToProve: Field,
          //expectedActiveComplianceHash: CircuitString.fromString("Active").hash(),
          //corporateRegistrationData: CorporateRegistrationData,
          LiquidityRatioData: ACTUSData,

          //oracleSignature: Signature,
          //creatorSignature: Signature,
          //creatorPublicKey: PublicKey
        ): Promise<liquidityratioDataPublicOutput> {
          
const cashInfl = LiquidityRatioData.cashInflows;
const cashOutfl = LiquidityRatioData.cashOutflows;
const monthsCount = LiquidityRatioData.inflowLength;
const newInvoiceAmount = LiquidityRatioData.newInvoiceAmount;
const newInvoiceEvaluationMonth = LiquidityRatioData.newInvoiceEvaluationMonth;
const liquidityThreshold = LiquidityRatioData.liquidityThreshold;


let cumulativeCashFlow=1000000;
let out = Bool(true);
// Iterate over each month in the dynamic range
for (let month = 1; month < monthsCount; month++) {
  //let inflow = cashInfl?.reduce((sum: any, val: any) => sum + val, 0) || 0;
  let inflow = cashInfl[month];
  //let outflow = cashOutfl[month]?.reduce((sum: any, val: any) => sum + val, 0) || 0;
  let outflow = cashOutfl[month-1];

  const totalOutflow = outflow + (month === newInvoiceEvaluationMonth ? newInvoiceAmount : 0);
  const netCashFlow = inflow - totalOutflow;
  cumulativeCashFlow += netCashFlow;

  const totalOutflowYear = cashOutfl.flat().reduce((acc: any, value: any) => acc + value, 0) + newInvoiceAmount;
  const liqRatio = cumulativeCashFlow / totalOutflowYear;

  out = liqRatio >= liquidityThreshold ? Bool(true) : Bool(false);
  //console.log(' inner   month ' , month ,'net cash flow ', netCashFlow,   'cumulative cash flow ', cumulativeCashFlow,' liq ratio', liqRatio , ' out ', out.toJSON());
  out.assertEquals(true);
}
console.log("Out ", out.toJSON())

//assertion using mina datatype boolean assert
          return new liquidityratioDataPublicOutput({
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
export class LiquidityRatioProof extends ZkProgram.Proof(LiquidityRatio) {}
