
import {
  Field,
  SmartContract,
  method,
  DeployArgs,
  Permissions,
  PublicKey,
  Mina,
  PrivateKey,
  AccountUpdate,
  ZkProgram,
  CircuitString,
  Poseidon,
} from 'o1js';

export const SqrtProgram = ZkProgram({

  name: 'SqrtProgram',
  publicInput: Field,
  publicOutput: Field,  

  methods: {
    proveSquareRoot: {
      privateInputs: [Field],
     
    async method(publicInput: Field, privateInput: Field) {
        privateInput.square().assertEquals(publicInput);
        return Poseidon.hash([publicInput, privateInput]);
      },
    },
  },


});