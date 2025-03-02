import { Bool, Field, SmartContract, state, State, method, CircuitString, Struct, FlexibleProvablePure, ZkProgram } from 'o1js';
import { GLEIFProof} from './GLEIFZKProgram.js';

export class GLEIFVerifierSmartContract extends SmartContract {
  @state(Field) num = State<Field>(); // State variable to hold a number
  // Initialize the contract state
  init() {
    super.init(); // Call the parent class initializer
    this.num.set(Field(100)); // Set initial value of `num` to 100
  }
  
    @method async verifyComplianceWithProof(proof: GLEIFProof) {
      // Ensure the state of `num` matches its current value
      this.num.requireEquals(this.num.get());
      const currentNum = this.num.get();

      proof.verify();

      // Update the state
      const updatedNum = currentNum.sub(10);
      this.num.set(updatedNum);
    }

}


