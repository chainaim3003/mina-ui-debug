import { SmartContract, Field, state, State, method, Circuit, Provable } from 'o1js';

export class CompanyCompliance extends SmartContract {
  @state(Field) activeCompliance = State<Field>();
  @state(Field) companyStatus = State<Field>();
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.activeCompliance.set(Field(0)); // Default initial state
    this.companyStatus.set(Field(0));
    this.num.set(Field(100)); // Default initial state
  }
  @method async validateCompliance(activeCompliance: Field, companyStatus: Field) {
    // Ensure the state variables are correctly linked to on-chain values
    this.activeCompliance.requireEquals(this.activeCompliance.get());
    this.companyStatus.requireEquals(this.companyStatus.get());
    this.num.requireEquals(this.num.get());
  
    const currentCompliance = this.activeCompliance.get();
    const currentStatus = this.companyStatus.get();
    const currentNum = this.num.get();
  
    // Ensure the state matches the input data
    currentCompliance.assertEquals(this.activeCompliance.get());
    currentStatus.assertEquals(this.companyStatus.get());
  
    // Update the compliance and status
    this.activeCompliance.set(activeCompliance);
    this.companyStatus.set(companyStatus);
  
    // Create a condition and update `num` based on it
    const condition = activeCompliance.equals(Field(1)).and(companyStatus.equals(Field(1)));
  
    // Compute the value to subtract if the condition is true
    const deduction = condition.toField().mul(Field(10)); // Subtract 10 if condition is true, otherwise 0
    const updatedNum = currentNum.sub(deduction);
  
    // Update the state with the new `num`
    this.num.set(updatedNum);
  
    // Debugging: Log the current state (optional)
    Provable.log(condition);
  }
}