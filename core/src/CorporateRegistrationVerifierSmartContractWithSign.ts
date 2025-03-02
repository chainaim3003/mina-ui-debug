import { Bool, Field, SmartContract, state, State, method, CircuitString, Struct, FlexibleProvablePure, ZkProgram } from 'o1js';
import { CorporateRegistrationProof} from './CorporateRegistrationZKProgramWithSign.js';



export class CorporateRegistrationVerifierSmartContract extends SmartContract {
  @state(Field) num = State<Field>(); // State variable to hold a number state
  // Initialize the contract state
  init() {
    super.init(); // Call the parent class initializer
    this.num.set(Field(100)); // Set initial value of 'num' to 100
  }

    
    @method async verifyComplianceWithProof(proof: CorporateRegistrationProof) {
      // Ensure the state of 'num' matches its current value
      this.num.requireEquals(this.num.get());
      const currentNum = this.num.get();
    
      
      // verification of the proof from the ZK
      proof.verify();

      // Update the state
      const updatedNum = currentNum.sub(10);
      this.num.set(updatedNum);
    }

}


