import { Bool, Field, SmartContract, state, State, method, CircuitString, Provable,Struct } from 'o1js';

export class ComplianceData extends Struct({
    companyID: CircuitString,          // CIN
    companyName: CircuitString,        // Company Name
    roc: CircuitString,                // ROC
    registrationNumber: Field,         // Registration Number
    incorporationDate: CircuitString,  // Incorporation Date
    email: CircuitString,              // Email
    corporateAddress: CircuitString,   // Corporate Address
    listed: Field,                     // Listed (boolean as Field)
    companyType: CircuitString,        // Company Type
    companyCategory: CircuitString,    // Company Category
    companySubcategory: CircuitString, // Company Subcategory
    companyStatus: String,             // Company Status
    authorizedCapital: Field,          // Authorized Capital
    paidUpCapital: Field,              // Paid-up Capital
    lastAGMDate: CircuitString,        // Last AGM Date
    balanceSheetDate: CircuitString,   // Balance Sheet Date
    activeCompliance: String,          // Active Compliance
    companyActivity: CircuitString,    // Company Activity
    jurisdiction: CircuitString,       // Jurisdiction
    regionalDirector: CircuitString,   // Regional Director
    mcaID: Field,                      // MCA ID
}) {}

export class MCALevel1FirstWayCircuit extends SmartContract {
  @state(Bool) accepted = State<Bool>();
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.accepted.set(Bool(false));
    this.num.set(Field(100)); // Initial state of num
  }

  @method async verifyTrace(trace: ComplianceData) {
    let out = this.verifyCompliance(trace);
    this.accepted.set(out);

    // After the transaction is committed, log the updated value of num
    Provable.asProver(() => {
      console.log("Final State of num: " + this.num.get().toString()); // This should show the updated value of num
    });
  }

  verifyCompliance(input: ComplianceData): Bool {
    let out = Bool(false);
    /*console.log('Active Compliance:', input.activeCompliance);
    console.log('Company Status:', input.companyStatus);
*/
    this.num.requireEquals(this.num.get());
    // Access the current value of num state
    let currentNum = this.num.get();
    Provable.asProver(() => {
      console.log("Initial State: " + currentNum.toString()); // This is allowed inside asProver
    });

    // Verification logic
    if (input.activeCompliance === "ACTIVE" && input.companyStatus === "ACTIVE COMPLIANT") {
      out = Bool(true);

      // Update num by subtracting 10
      const updatedNum = currentNum.sub(10);
      this.num.set(updatedNum);

      // Log the updated value within the prover context
      Provable.asProver(() => {
        console.log("After Updation: " + updatedNum.toString()); // This should show the updated value of num
      });
    } else {
      out = Bool(false);
    }

    // Return the updated value for verification after the transaction
    return out;
  }
}
