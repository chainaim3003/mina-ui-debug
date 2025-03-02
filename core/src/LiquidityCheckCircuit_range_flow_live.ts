import { Bool, UInt8, Field, SmartContract, state, State, method, Bytes, Struct, CircuitString } from 'o1js';


export class ACTUSData extends Struct({
  scenarioID: CircuitString,
  scenarioName: String,
  riskEvaluated: Field,
  cashInflows: Array(Array(Number)),  // Dynamic array of cash inflows
  cashOutflows: Array(Array(Number)), // Dynamic array of cash outflows
  newInvoiceAmount: Number,           // Amount of the new invoice
  newInvoiceEvaluationMonth: Number,  // Evaluation month for the new invoice
  liquidityThreshold: Number,        // Required liquidity ratio
}) {}

export class LiquidityCheckCircuit extends SmartContract {
  @state(Bool) accepted = State<Bool>();

  init() {
    super.init();
    this.accepted.set(Bool(false));
  }

  @method async verifyTrace(trace: ACTUSData) {
    let out = verifyCashFlows(trace);
    this.accepted.set(out);
  }
}

export function verifyCashFlows(input: ACTUSData) {
  const cashInfl = input.cashInflows;
  const cashOutfl = input.cashOutflows;
  const monthsCount = cashInfl.length;
  const newInvoiceAmount = input.newInvoiceAmount;
  const newInvoiceEvaluationMonth = input.newInvoiceEvaluationMonth;
  const liquidityThreshold = input.liquidityThreshold;

  let cumulativeCashFlow = 0;
  let out = Bool(false);

  // Iterate over each month in the dynamic range
  for (let month = 0; month < monthsCount; month++) {
    let inflow = cashInfl[month]?.reduce((sum, val) => sum + val, 0) || 0;
    let outflow = cashOutfl[month]?.reduce((sum, val) => sum + val, 0) || 0;

    const totalOutflow = outflow + (month === newInvoiceEvaluationMonth ? newInvoiceAmount : 0);
    const netCashFlow = inflow - totalOutflow;
    cumulativeCashFlow += netCashFlow;

    const totalOutflowYear = cashOutfl.flat().reduce((acc, value) => acc + value, 0) + newInvoiceAmount;
    const liqRatio = cumulativeCashFlow / totalOutflowYear;

    out = liqRatio >= liquidityThreshold ? Bool(true) : Bool(false);
    
    
  }

  return out;
  
}
/*for (let month = 0; month < 12; month++) {
  // Manually sum the inflows for the current month
  let inflow = 0;
  if (cashInfl[month]) {
  for (let i = 0; i < cashInfl[month].length; i++) {
    inflow += cashInfl[month][i];
  }
  }

  // Manually sum the outflows for the current month
  let outflow = 0;
  if (cashOutfl[month]) {
  for (let i = 0; i < cashOutfl[month].length; i++) {
    outflow += cashOutfl[month][i];
  }
  }

  // Add the new invoice amount if the current month is the evaluation month
  const totalOutflow = outflow + (month === newInvoiceEvaluationMonth ? newInvoiceAmount : 0);

  const netCashFlow = inflow - totalOutflow;
  cumulativeCashFlow += netCashFlow;

  // Liquidity ratio calculation
  const totalOutflowYear = cashOutfl.flat().reduce((acc, value) => acc + value, 0) + newInvoiceAmount;
  const liqRatio = cumulativeCashFlow / totalOutflowYear;

  // Store the projection data for each month
  /*cashFlowProjections.push({
  month: month + 1,
  cashInflow: inflow,
  cashOutflow: totalOutflow,
  netCashFlow: netCashFlow,
  cumulativeCashFlow: cumulativeCashFlow,
  liquidityRatio: liqRatio,
  });*/
  // Check liquidity ratio and determine if financing is approved
  /*
  out = liqRatio >= liquidityThreshold ? Bool(true) : Bool(false);

  console.log('Month:', month + 1);
  console.log('  Inflow:', inflow);
  console.log('  Outflow:', totalOutflow);
  console.log('  Net Cash Flow:', netCashFlow);
  console.log('  Cumulative Cash Flow:', cumulativeCashFlow);
  console.log('  Liquidity Ratio:', liqRatio);
  console.log('  Financing Decision:', out.toJSON() ? 'Eligible' : 'Not Eligible');
}

// Return the final financing decision
return out;*/