import { count } from 'console';
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
    scenarioName_str: String,
    riskEvaluated: Field,
    cashInflows: Array(MAX_LENGTH).fill(Number),  // Fixed-size array
    cashOutflows: Array(MAX_LENGTH).fill(Number), // Fixed-size array
    newInvoiceAmount: Number,
    newInvoiceEvaluationMonth: Number,
    liquidityThreshold: Number,
    //liquidityThreshold: Field,
    inflowLength: Number,
    outflowLength: Number
}) {
    constructor(data: { scenarioID: CircuitString; scenarioName: CircuitString; scenarioName_str: string; riskEvaluated: Field; cashInflows: any[]; cashOutflows: any[]; newInvoiceAmount: number; newInvoiceEvaluationMonth: number; liquidityThreshold: number; inflowLength: number; outflowLength: number; }) {
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

/*const scenarioName_str = CircuitString.fromString(LiquidityRatioData.scenarioName_str);          
const cashInfl = LiquidityRatioData.cashInflows;
const cashOutfl = LiquidityRatioData.cashOutflows;
const monthsCount = LiquidityRatioData.inflowLength;
const newInvoiceAmount = LiquidityRatioData.newInvoiceAmount;
const newInvoiceEvaluationMonth = LiquidityRatioData.newInvoiceEvaluationMonth;
const liquidityThreshold = (LiquidityRatioData.liquidityThreshold);
console.log("********");
console.log(scenarioName_str);
let cumulativeCashFlow=Field(10000000);
let out = Bool(true);
// Iterate over each month in the dynamic range
for (let month = 1; month < monthsCount; month++) {
  //let inflow = cashInfl?.reduce((sum: any, val: any) => sum + val, 0) || 0;
  let inflow = Field(Math.round(cashInfl[month]));
  //let outflow = cashOutfl[month]?.reduce((sum: any, val: any) => sum + val, 0) || 0;
  let outflow = Field(Math.round(cashOutfl[month-1]));

  const totalOutflow = outflow.add(month === newInvoiceEvaluationMonth ? Field(Math.round(newInvoiceAmount)) : Field(0));
  const netCashFlow = inflow.sub(totalOutflow);
  cumulativeCashFlow=cumulativeCashFlow.add( netCashFlow);

  const totalOutflowYear = cashOutfl.flat().reduce((acc: any, value: any) => acc + value, 0) + newInvoiceAmount;
  const liqRatio = cumulativeCashFlow.div(totalOutflowYear);
  console.log("liqRatio",liqRatio.toBigInt());

  out = liqRatio.greaterThan(Field(liquidityThreshold)) ? Bool(true) : Bool(false);
  console.log(' inner   month ' , month ,'net cash flow ', netCashFlow,   'cumulative cash flow ', cumulativeCashFlow,' liq ratio', liqRatio , ' out ', out.toJSON());
  out.assertEquals(true);
}
console.log("Out ", out.toJSON())*/
/*
const scenarioName_str = CircuitString.fromString(LiquidityRatioData.scenarioName_str);

    // Apply Math.round before converting to Field
    const cashInfl = LiquidityRatioData.cashInflows.map(val => Field(Math.round(val)));
    const cashOutfl = LiquidityRatioData.cashOutflows.map(val => Field(Math.round(val)));

    const monthsCount = Field(LiquidityRatioData.inflowLength);
    const newInvoiceAmount = Field(Math.round(LiquidityRatioData.newInvoiceAmount));
    const newInvoiceEvaluationMonth = Field(LiquidityRatioData.newInvoiceEvaluationMonth);
    const liquidityThreshold = Field(Math.round(LiquidityRatioData.liquidityThreshold));

    console.log("******** Scenario Name:", scenarioName_str.toString());

    let cumulativeCashFlow = Field(0); // Initial cash flow
    let out = Bool(true);

    for (let month = Field(1); month.lessThan(monthsCount).toBoolean(); month = month.add(1)) {
        // Retrieve inflows and outflows using the rounded values
        let inflow = cashInfl[Number(month.toBigInt())];
        let outflow = cashOutfl[Number(month.sub(1).toBigInt())];
        // Add new invoice amount if it's the evaluation month
        const totalOutflow = outflow.add(
            month.equals(newInvoiceEvaluationMonth).toBoolean() ? newInvoiceAmount : Field(0)
        );

        // Compute net cash flow
        const netCashFlow = inflow.sub(totalOutflow);
        cumulativeCashFlow = cumulativeCashFlow.add(netCashFlow);

        // Compute total outflow over the year
        const totalOutflowYear = cashOutfl.reduce((acc, value) => acc.add(value), Field(0)).add(newInvoiceAmount);

        // Liquidity Ratio Calculation
        const liqRatio = cumulativeCashFlow.div(totalOutflowYear);

        console.log(`Month ${month.toBigInt()}:`);
        console.log("Net Cash Flow:", netCashFlow.toBigInt());
        console.log("Cumulative Cash Flow:", cumulativeCashFlow.toBigInt());
        console.log("Liquidity Ratio:", liqRatio.toBigInt());
        console.log("Liquidity Threshold:", liquidityThreshold.toBigInt());

        // Ensure liqRatio > liquidityThreshold
        out = liqRatio.greaterThan(liquidityThreshold);
        console.log("Out:", out.toJSON());

        out.assertEquals(Bool(true)); // Assert the condition holds
    }

    console.log("Final Out:", out.toJSON());
*/
const scenarioName_str = CircuitString.fromString(LiquidityRatioData.scenarioName_str);

// Apply Math.round before converting to Field
const cashInfl = LiquidityRatioData.cashInflows.map(val => Field(Math.round(val)));
const cashOutfl = LiquidityRatioData.cashOutflows.map(val => Field(Math.round(val)));

const monthsCount = Field(LiquidityRatioData.inflowLength);
const newInvoiceAmount = Field(Math.round(LiquidityRatioData.newInvoiceAmount));
const newInvoiceEvaluationMonth = Field(LiquidityRatioData.newInvoiceEvaluationMonth);
const liquidityThreshold = Field(Math.round(LiquidityRatioData.liquidityThreshold));

console.log("******** Scenario Name:", scenarioName_str.toString());
/*
let cumulativeCashFlow = Field(100000); // Initial cash flow
let out = Bool(true);

// Use a regular counter variable to avoid Field conversion issues when indexing arrays
let counter = 0;
for (let month = Field(1); month.lessThan(monthsCount).toBoolean(); month = month.add(1)) {
    // Use the counter for array indexing instead of converting Field to Number
    let inflow = cashInfl[counter + 1]; // month starts at 1, so use counter+1
    let outflow = cashOutfl[counter];   // outflow is 0-indexed in the loop
    
    // Add new invoice amount if it's the evaluation month
    const invoiceAddition = month.equals(newInvoiceEvaluationMonth).toBoolean() 
        ? newInvoiceAmount 
        : Field(0);
    const totalOutflow = outflow.add(invoiceAddition);

    // Compute net cash flow
    const netCashFlow = inflow.sub(totalOutflow);
    cumulativeCashFlow = cumulativeCashFlow.add(netCashFlow);
    
    // Compute total outflow over the year - compute once outside the loop
    let totalOutflowYear = Field(100000);
    for (let i = 0; i < cashOutfl.length; i++) {
        totalOutflowYear = totalOutflowYear.add(cashOutfl[i]);
    }
    totalOutflowYear = totalOutflowYear.add(newInvoiceAmount);

    //console.log(`Month ${month.toBigInt()}:`);
    //console.log("Net Cash Flow:", netCashFlow.toBigInt());
    //console.log("Cumulative Cash Flow:", cumulativeCashFlow.toBigInt());
    // For division and comparison, we need to work with the constraints properly
    // We want to check if: cumulativeCashFlow > liquidityThreshold * totalOutflowYear
    // Instead of: cumulativeCashFlow / totalOutflowYear > liquidityThreshold
    const thresholdMultiplied = liquidityThreshold.mul(totalOutflowYear);
    out = cumulativeCashFlow.greaterThan(thresholdMultiplied);
    //console.log("Cumulative Cash Flow:", cumulativeCashFlow.toBigInt());
    //console.log("Threshold × Total Outflow:", thresholdMultiplied.toBigInt());
    console.log("Out:", out.toBoolean());

    // Assert the condition holds
    out.assertEquals(Bool(true));
    
    counter++;
}

console.log("Final Out:", out.toBoolean()); final
*/
/*
const scenarioName_str = CircuitString.fromString(LiquidityRatioData.scenarioName_str);
const cashInfl = LiquidityRatioData.cashInflows.map((value: number) => Field(Math.round(value)));
          const cashOutfl = LiquidityRatioData.cashOutflows.map((value: number) => Field(Math.round(value)));
          const monthsCount = Field(LiquidityRatioData.inflowLength);
          const newInvoiceAmount = Field(Math.round(LiquidityRatioData.newInvoiceAmount));
          const newInvoiceEvaluationMonth = Field(LiquidityRatioData.newInvoiceEvaluationMonth);
          const liquidityThreshold = Field(Math.round(LiquidityRatioData.liquidityThreshold));

console.log("");
console.log(scenarioName_str);*/
let cumulativeCashFlow = Field(1000000);
let out = Bool(true);

// Precompute total outflow for the year (compute once for efficiency)
const totalOutflowYear = cashOutfl.reduce((acc, value) => acc.add(value), Field(0)).add(newInvoiceAmount);
let count =1;
// Iterate over each month
for (let month = Field(1); month.lessThan(monthsCount).toBoolean(); month = month.add(1)) {
    let inflow = cashInfl[count];
    let outflow = cashOutfl[count-1];

    const invoiceAddition = month.equals(newInvoiceEvaluationMonth).toBoolean() ? newInvoiceAmount : Field(0);
    const totalOutflow = outflow.add(invoiceAddition);
    const netCashFlow = inflow.sub(totalOutflow);
    cumulativeCashFlow = cumulativeCashFlow.add(netCashFlow);

    // Avoid division by rewriting the condition
    const thresholdMultiplied = liquidityThreshold.mul(totalOutflowYear);
    out = cumulativeCashFlow.greaterThan(thresholdMultiplied);

    out.assertEquals(Bool(true));  // Ensure liquidity condition holds
}

console.log("Out ", out.toBoolean());


console.log("Out ", out.toJSON());

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
