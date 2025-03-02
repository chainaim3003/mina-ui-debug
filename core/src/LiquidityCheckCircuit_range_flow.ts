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
