
import { verifyProcess } from './bpmnCircuit.js';

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
    Bytes,
  } from 'o1js';
  
  class Bytes200 extends Bytes(200){}

  export class BusinessStandardDataIntegrityComplianceData extends Struct({

    //standard schema swagger 
    
    // standardSwaggerYml: CircuitString,
    // standardExampleJson: CircuitString,
    // actualJson: CircuitString,
    // standardSwaggerYmlFile: CircuitString,
    // standardExampleJsonFile: CircuitString,
    // actualJsonFile: CircuitString,
    // standardSwaggerYmlString: String,
    // standardExampleJsonString: String,
    // actualJsonString: String,
    // standardSwaggerYmlFileString: String,
    // standardExampleJsonFileString: String,
    // actualContentId:Field,
    // actualJsonFileString: String,
    businessStandardDataIntegrityEvaluationId : Field,
    expectedContent: CircuitString,
    actualContent: CircuitString
    //result:bool    
  }) {}
  
  export class BusinessStandardDataIntegrityPublicOutput extends Struct({
    //result:bool
  }) {}
  
  export const BusinessStandardDataIntegrityZKProgram = ZkProgram({
    name: 'BusinessStandardDataIntegrityZKProgram',
    publicInput: Field,
    publicOutput: BusinessStandardDataIntegrityPublicOutput,
    methods: {
      proveCompliance: {
        privateInputs: [BusinessStandardDataIntegrityComplianceData],
        async method(
          BusinessStandardDataIntegrityToProve: Field,
          businessStandardDataIntegrityData: BusinessStandardDataIntegrityComplianceData
        ): Promise<BusinessStandardDataIntegrityPublicOutput> {
          
          //console.log('Data before compliance check - Company Name:', BusinessStandardDataIntegrityData.entityName.toString, 'IEC Status:', BusinessStandardDataIntegrityData.iecStatus.toString);
  
          // Compliance check: Verify that for a pregenerated circuit for that swagger /example json,actual json supplied goes through the circuit
          //and for all the checks that the circuit performs ouput bool 
          
          //BusinessStandardDataIntegrityData.iecStatus
          //  .equals(Field(0)) // NORMAL
          //  .or(BusinessStandardDataIntegrityData.iecStatus.equals(Field(4))) 
          //  .or(BusinessStandardDataIntegrityData.iecStatus.equals(Field(7))) // REVOKE SUSPENSION
          //  .or(BusinessStandardDataIntegrityData.iecStatus.equals(Field(8))) // REVOKE CANCELLATION
            //.or(EXIMData.iecStatus.equals(Field(9))) // AMENDMENT
          //  .assertTrue(); // Ensures the IEC status is compliant
  
          //  BusinessStandardDataIntegrityData.iecStatus
          //  .equals(Field(1)) 
          //  .or(BusinessStandardDataIntegrityData.iecStatus.equals(Field(2))) 
          //  .or(BusinessStandardDataIntegrityData.iecStatus.equals(Field(3))) 
            
          //  .assertFalse(); // Ensures the IEC status is compliant






            
            //replace this code call the DC prover logic passing in the actual json and which circuit to check for

            //set the mina datatype boolean to be false based on the dc prover object result do the assert 
  
          //console.log('Data after compliance check - Company Name:', BusinessStandardDataIntegrityData.entityName.toString, 'IEC Status:', BusinessStandardDataIntegrityData.iecStatus.toString);

          /*
                      const validSignature = oracleSignature.verify(
                        PublicKey.fromBase58('B62qmXFNvz2sfYZDuHaY5htPGkx1u2E2Hn3rWuDWkE11mxRmpijYzWN'),
                        CorporateRegistrationData.toFields(corporateRegistrationData)
                      );
                      validSignature.assertTrue();
              
                      const validSignature_ = creatorSignature.verify(
                        creatorPublicKey,
                        CorporateRegistrationData.toFields(corporateRegistrationData)
                      );
                      validSignature_.assertTrue();
                      */
                
                      /*
                      const companyRegistration = evalCorporateCompliance(corporateRegistrationData.currCompanyComplianceStatusCode);
                      corporateRegistrationData.currCompanyComplianceStatusCode.greaterThan(Field(0)).assertTrue();
                      */
            
                      /*
                      console.log(' data bef .. ',corporateRegistrationData.currCorporateComplianceStatusCode) 
                     
                      corporateRegistrationData.currCorporateComplianceStatusCode.assertEquals(Field(1));
            
                      console.log(' data  aft .. ',corporateRegistrationData.currCorporateComplianceStatusCode) 
            
                      */
          
          
          
          
          // ----------------------------------------------------
          
                      //console.log( "expected path ",businessProcessIntegrityData.expectedContent.values.toString);
                      
                      //console.log( "actual path ",businessProcessIntegrityData.actualContent.toString);
                      
                     // const intArr=businessProcessIntegrityData.actualContent.toUInt8Array();
                     //const intArr=businessProcessIntegrityData.actualContent;
          
          
          
                     //This works
                     const actualPath1=CircuitString.fromString("abcdfg");
                    //console.log("ActualPath1:",actualPath1.values.toString());
          
                    // console.log( "actual path ",businessProcessIntegrityData.actualContent.toString);
                   //  let input=Bytes50.fromString(`${businessProcessIntegrityData.actualContent}`);
                    //Provable.log(businessProcessIntegrityData.expectedContent);
                    
          
                     /* Provable.asProver(() => {
                        console.log( "actual path ",businessProcessIntegrityData.actualContent.toString);
                        input=Bytes50.fromString(`${businessProcessIntegrityData.actualContent}`);
                      
                      });
                      Provable.log(businessProcessIntegrityData.actualContent);*/
                      const actualPath2=businessStandardDataIntegrityData.actualContent;
                      //console.log("ActualPath2:",actualPath2.values.toString());
                      
                      //this works
                      const out=verifyProcess(Bytes200.fromString(`${actualPath1}`).bytes);
                      
                      //this doesn't work
                      //const out=verifyProcess(Bytes50.fromString(`${actualPath2}`).bytes);
                      //const out=verifyProcess().bytes);
                      console.log("FinalPath:",out.toJSON());
          
                      out.assertTrue();
          
          
          
          
                      //*******BusinessStandardIntegrityZKProgram */
                      //we have to call a circuit which is the circuit he called already I would rather call it DCProver
                      //DCProver has a out function that is similar to bpmn which is supposed to give true or false.
                      //
          
          
                      
                      // NOW change the logic to map to the real compliance data from MCA API.... 
                      
                      //console.log(' data bef ..  company name ',corporateRegistrationData.companyName.toString, ' active compliance ..', corporateRegistrationData.activeCompliance.toString) 
                     
                      //corporateRegistrationData.currCorporateComplianceStatusCode.assertEquals(Field(1));
            
                      //const expectedActiveComplianceHash = CircuitString.fromString("Active").hash();
                      //const activeComplianceHash = corporateRegistrationData.activeCompliance.hash();
                    
                      // Verification logic: check active compliance and company status
                      //activeComplianceHash.assertEquals(expectedActiveComplianceHash);
                      
                      //console.log(' data aft ..  company name ',corporateRegistrationData.companyName.toString, ' active compliance ..', corporateRegistrationData.activeCompliance.toString) 
                     
                      return new BusinessStandardDataIntegrityPublicOutput({
                        //corporateComplianceToProve: corporateComplianceToProve,
                        //currCompanyComplianceStatusCode: corporateRegistrationData.currCompanyComplianceStatusCode,
                        //outputExpectedHash: Field(corporateRegistationToProveHash),
                        //outputActualHash: Field(1),
                        //creatorPublicKey: creatorPublicKey,
                        //businessProcessID : businessStandardDataIntegrityData.businessProcessID,
                        //companyName: corporateRegistrationData.companyName,
                        //companyID: corporateRegistrationData.companyID,
                       // complianceProof: CorporateRegistration.proveCompliance(Field(0),complianceData)
                       businessStandardDataIntegrityEvaluationId : businessStandardDataIntegrityData.businessStandardDataIntegrityEvaluationId,
            
                      });
  
          return new BusinessStandardDataIntegrityPublicOutput({
            //entityName: BusinessStandardDataIntegrityData.entityName,
            //iec: BusinessStandardDataIntegrityData.iec,
          });
        },
      },
    },
  });
  
  export class BusinessStandardDataIntegrityProof extends ZkProgram.Proof(BusinessStandardDataIntegrityZKProgram) {}
  
  
  
  
  