import {
  Field,
  Signature,
  SmartContract,
  PublicKey,
  Struct,
  ZkProgram,
  Proof,
  SelfProof,
  CircuitString,
  method,
  Permissions,
  Circuit
} from 'o1js';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';//keccak256 for generating cryptographic hashes.

// Define the Public Output Structure
export class CompliancePublicOutput extends Struct({
  complianceToProve: Field,
  complianceStatusCode: Field,
}) {}

class ComplianceData extends Struct({
  companyID: CircuitString,
  companyName: CircuitString,
  complianceStatusCode: Field,
}) {}

// zk-SNARK Program for Compliance
const Compliance = ZkProgram({
  name: 'Compliance',

  publicInput: Field,
  publicOutput: CompliancePublicOutput,

  methods: {
    init: {
      privateInputs: [],
      async method(state: Field): Promise<CompliancePublicOutput> {
        state.assertEquals(Field(1));

        return new CompliancePublicOutput({
          complianceToProve: Field(1),
          complianceStatusCode: Field(1),
        });
      },
    },

    compliance: {
      privateInputs: [SelfProof, SelfProof],

      async method(
        newState: Field,
        earlierProof1: SelfProof<Field, CompliancePublicOutput>,
        earlierProof2: SelfProof<Field, CompliancePublicOutput>
      ): Promise<CompliancePublicOutput> {
        earlierProof1.verify();
        earlierProof2.verify();

        newState.assertEquals(
          Field(earlierProof1.publicOutput.complianceStatusCode).mul(Field(earlierProof2.publicOutput.complianceStatusCode))
        );

        return new CompliancePublicOutput({
          complianceToProve: Field(1),
          complianceStatusCode: Field(1),
        });
      },
    },

    proveCompliance: {
      privateInputs: [ComplianceData],

      async method(
        complianceToProve: Field,
        complianceData: ComplianceData
      ): Promise<CompliancePublicOutput> {
        complianceData.complianceStatusCode.assertEquals(Field(1));

        return new CompliancePublicOutput({
          complianceToProve: Field(1),
          complianceStatusCode: Field(1),
        });
      },
    },
  },
});

// Create a Merkle Tree from an array of data
const createMerkleTree = (dataArray: string[]): MerkleTree => {
  const leaves = dataArray.map(x => keccak256(x));
  return new MerkleTree(leaves, keccak256, { sortPairs: true });
};

// Main function to check proofs, perform multiplication, and generate new proof
const main = async () => {
  console.log('Compiling proofs...');

  let compliance = await Compliance.compile();
  let complianceVerKey = compliance.verificationKey;

  const proof0 = await Compliance.init(Field(1));

  const corpData = {
    companyID: '101',
    companyName: 'India Exports 1',
    currCompanyComplianceStatusCode: Field(1),
  };

  const corpRegData = new ComplianceData({
    companyID: CircuitString.fromString(corpData.companyID),
    companyName: CircuitString.fromString(corpData.companyName),
    complianceStatusCode: Field(corpData.currCompanyComplianceStatusCode),
  });

  let corpRegProof = await Compliance.proveCompliance(Field(1), corpRegData);

  const tradeDGFTData = {
    companyID: '101',
    companyName: 'India Exports 1',
    complianceStatusCode: Field(1),
  };

  const internationalTradeComplianceData = new ComplianceData({
    companyID: CircuitString.fromString(tradeDGFTData.companyID),
    companyName: CircuitString.fromString(tradeDGFTData.companyName),
    complianceStatusCode: Field(tradeDGFTData.complianceStatusCode),
  });

  let tradeProof = await Compliance.proveCompliance(Field(1), internationalTradeComplianceData);

  let recurrsiveProof = await Compliance.compliance(Field(1), corpRegProof, tradeProof);
  let valRecurrsiveProof = recurrsiveProof.publicOutput.complianceStatusCode.toJSON();

  const globalLEIData = {
    companyID: '101',
    companyName: 'India Exports 1',
    globalLEIID: '1357890034578',
    complianceStatusCode: Field(1),
  };

  const globalLEIComplianceData = new ComplianceData({
    companyID: CircuitString.fromString(globalLEIData.companyID),
    companyName: CircuitString.fromString(globalLEIData.companyName),
    complianceStatusCode: Field(globalLEIData.complianceStatusCode),
  });

  let leiProof = await Compliance.proveCompliance(Field(1), globalLEIComplianceData);

  let recProof3 = await Compliance.compliance(Field(1), tradeProof, leiProof);
  let valrecProof3 = recProof3.publicOutput.complianceStatusCode.toJSON();

  const proof4Data = {
    companyID: '101',
    companyName: 'India Exports 1',
    StatusCode: Field(1),
  };

  const proof4ComplianceData = new ComplianceData({
    companyID: CircuitString.fromString(proof4Data.companyID),
    companyName: CircuitString.fromString(proof4Data.companyName),
    complianceStatusCode: Field(proof4Data.StatusCode),
  });

  let p4Proof = await Compliance.proveCompliance(Field(1), proof4ComplianceData);
  let recProof4 = await Compliance.compliance(Field(1), leiProof, p4Proof);
  let valrecProof4 = recProof4.publicOutput.complianceStatusCode.toJSON();

  const proof5Data = {
    companyID: '102',
    companyName: 'India Exports 1',
    StatusCode: Field(1),
  };

  const proof5ComplianceData = new ComplianceData({
    companyID: CircuitString.fromString(proof5Data.companyID),
    companyName: CircuitString.fromString(proof5Data.companyName),
    complianceStatusCode: Field(proof5Data.StatusCode),
  });

  let p5Proof = await Compliance.proveCompliance(Field(1), proof5ComplianceData);
  let recProof5 = await Compliance.compliance(Field(1), recProof4, p5Proof);
  let valrecProof5 = recProof5.publicOutput.complianceStatusCode.toJSON();

  const proof6Data = {
    companyID: '103',
    companyName: 'India Exports 1',
    StatusCode: Field(1),
  };

  const proof6ComplianceData = new ComplianceData({
    companyID: CircuitString.fromString(proof6Data.companyID),
    companyName: CircuitString.fromString(proof6Data.companyName),
    complianceStatusCode: Field(proof6Data.StatusCode),
  });

  let p6Proof = await Compliance.proveCompliance(Field(1), proof6ComplianceData);
  let recProof6 = await Compliance.compliance(Field(1), recProof5, p6Proof);
  let valrecProof6 = recProof6.publicOutput.complianceStatusCode.toJSON();

  console.log("Final Recursive Proof Value:", valrecProof6);

  //keccak256 is a cryptographic hash function used to hash data to generate Merkle leaves and proofs.
  // creating a Merkle Tree
  const dataToIncludeInMerkleTree = [
    JSON.stringify(corpData),
    JSON.stringify(tradeDGFTData),
    JSON.stringify(globalLEIData),
    JSON.stringify(proof4Data),
    JSON.stringify(proof5Data),
    JSON.stringify(proof6Data)
  ];

  const merkleTree = createMerkleTree(dataToIncludeInMerkleTree);


// Define the function with explicit types
//A function createAndVerifyProof is defined to generate a Merkle Proof for a specific data entry and verify its validity against the Merkle Tree.
const createAndVerifyProof = (data: Record<string, any>, merkleTree: any) => {
  // Generate the leaf from the data
  const leaf = keccak256(JSON.stringify(data));
  
  // Generate the proof for the specific leaf
  const proof = merkleTree.getProof(leaf);
  
  // Get the Merkle Root
  const root = merkleTree.getRoot().toString('hex');
  
  // Verify the proof
  const isValid = merkleTree.verify(proof, leaf, root);
  
  return {
      leaf,
      proof,
      root,
      isValid //proof of membership
  };
};

// Example usage
const corpDataResult = createAndVerifyProof(corpData, merkleTree);
console.log('Merkle Root for corpData:', corpDataResult.root);
//console.log('Proof for corpData:', corpDataResult.proof);
console.log('Is the proof for corpData present in the merkle tree?', corpDataResult.isValid);

//1.  What would it take to put another generic variable that kind of indicates ProofType ? If I were to have a struture 
// Where the MAIN ROOT..., has 5 sub-roots ( ID , compliance, dataintegrity, businessprocess, and riskAlignment)...
// the strcuture we might want to think about.., will be something like
// Is the ProofSubRoot of type dataIntegrity preent in this merkle tree ? ... Answer and Yes. 
// We will have to add, the type of the proof in the data itself.. 

// Can i pass in the proof type ( and get a answer similar to is this proof part of the merkle tree ).. 
// Are id proofs part of this merkle tree for this financial request..

// WHy and how this will be used ?
// A risk model.., can attach weightage..... 
//   if it has id .. 15 points,  if it has compliance 15, data integrity 20, businss - 20 , risk - 30 )
// graularly say... , if ID proof  is just LEI Proof ,  I will give  100% of the 15%..,
   //  LEI proof, and tradedataProof, MCAProof ...,   50, 30, 20 % of the 100 #



   //2.  How will you map the actual APIs for MCA, dgft and LEI , 
   //     ACTUS, and BPMN.... in to the objects that are now using for the sample ( sample proofs... )
   //     What will be the adapter integration from how we are proving in the circuits to these API responses. 

   // this means, the corp data, trade data, lei data etc.., will have to be  ( limit to 3 levels ), we will have to generate those objects ( as a mock)
   //  complinace : resolved, suspended, active, inactive..  the code coming in..., we will to map it to the cicuit logic.., and then say
   // if dgft api response is this , this and this ( cancelled , revoked, suspended ).... you should basicaly say the proof cannot be produced, 
   // or the proof compliance is false in the out put object. 

   // Purpose is to say... how will you feed this in to the BPMN and Risk models, for live useful examples.. 
   

//corpDataResult.leaf
const tradeDataResult = createAndVerifyProof(tradeDGFTData, merkleTree);
console.log('Merkle Root for tradeDGFTData:', tradeDataResult.root);
//console.log('Proof for tradeDGFTData:', tradeDataResult.proof);
console.log('Is the proof for trade compliance available in the Proof Tree ?', tradeDataResult.isValid);



//   1. Valid Proof
// The proof is valid when:

// The leaf node (data) being verified is part of the Merkle tree.
// The hashes in the proof correctly match the sibling nodes as expected when moving up from the leaf to the root.
// When recomputing the Merkle root using the provided leaf and proof, the computed root matches the actual root of the Merkle tree.

};

main().catch(err => console.error(err));
