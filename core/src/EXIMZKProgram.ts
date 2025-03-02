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
  Circuit
} from 'o1js';

export class EXIMComplianceData extends Struct({
  iec: CircuitString,
  entityName: CircuitString,
  addressLine1: CircuitString,
  addressLine2: CircuitString,
  city: CircuitString,
  state: CircuitString,
  pin: Field,
  contactNo: Field,
  email: CircuitString,
  iecIssueDate: CircuitString,
  exporterType: Field,
  pan: CircuitString,
  iecStatus: Field,
  starStatus: Field,
  iecModificationDate: CircuitString,
  dataAsOn: CircuitString,
  natureOfConcern: Field,
  branchCode: Field,
  badd1: CircuitString,
  badd2: CircuitString,
  branchCity: CircuitString,
  branchState: CircuitString,
  branchPin: Field,
  director1Name: CircuitString,
  director2Name: CircuitString,
}) {}

export class EXIMPublicOutput extends Struct({
  entityName: CircuitString,
  iec: CircuitString,
}) {}

export const EXIM = ZkProgram({
  name: 'EXIM',
  publicInput: Field,
  publicOutput: EXIMPublicOutput,
  methods: {
    proveCompliance: {
      privateInputs: [EXIMComplianceData],
      async method(
        EXIMToProve: Field,
        EXIMData: EXIMComplianceData
      ): Promise<EXIMPublicOutput> {
        
        console.log('Data before compliance check - Company Name:', EXIMData.entityName.toString, 'IEC Status:', EXIMData.iecStatus.toString);

        // Compliance check: Verify that IEC status is active
        /*0- NORMAL: IEC can be used

        1- BLACK LISTED: Contact DGFT
        2- SUSPENDED: Contact DGFT.
        3- CANCELLED: Contact DGFT.
        4- CLEAR FROM BLACK LIST: Transmit IEC from DGFT with 00 error code.
        7- REVOKE SUSPENSION: IEC is revoked from suspended status.
        8- REVOKE CANCELLATION: IEC can be used.
        9- AMENDMENT: Changes to IEC have been made.*/

        EXIMData.iecStatus
          .equals(Field(0)) // NORMAL
          .or(EXIMData.iecStatus.equals(Field(4))) 
          .or(EXIMData.iecStatus.equals(Field(7))) // REVOKE SUSPENSION
          .or(EXIMData.iecStatus.equals(Field(8))) // REVOKE CANCELLATION
          //.or(EXIMData.iecStatus.equals(Field(9))) // AMENDMENT
          .assertTrue(); // Ensures the IEC status is compliant

        EXIMData.iecStatus
          .equals(Field(1)) 
          .or(EXIMData.iecStatus.equals(Field(2))) 
          .or(EXIMData.iecStatus.equals(Field(3))) 
          
          .assertFalse(); // Ensures the IEC status is compliant

        console.log('Data after compliance check - Company Name:', EXIMData.entityName.toString, 'IEC Status:', EXIMData.iecStatus.toString);

        return new EXIMPublicOutput({
          entityName: EXIMData.entityName,
          iec: EXIMData.iec,
        });
      },
    },
  },
});

export class EXIMProof extends ZkProgram.Proof(EXIM) {}

