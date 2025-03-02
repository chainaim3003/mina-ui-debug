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
    Provable
  } from 'o1js';
  
  export class GLEIFComplianceData extends Struct({
    type: CircuitString,
    id: CircuitString,
    lei: CircuitString,
    name: CircuitString,
    legalName_language: CircuitString,
    otherNames: CircuitString,
    transliteratedOtherNames: CircuitString,
    legalAddress_language: CircuitString,
    legalAddress_addressLines: CircuitString,
    legalAddress_city: CircuitString,
    legalAddress_region: CircuitString,
    legalAddress_country: CircuitString,
    legalAddress_postalCode: CircuitString,
    headquartersAddress_language: CircuitString,
    headquartersAddress_addressLines: CircuitString,
    headquartersAddress_city: CircuitString,
    headquartersAddress_region: CircuitString,
    headquartersAddress_country: CircuitString,
    headquartersAddress_postalCode: CircuitString,
    registeredAt_id: CircuitString,
    registeredAt_other: CircuitString,
    registeredAs: CircuitString,
    jurisdiction: CircuitString,
    legalForm_id: CircuitString,
    legalForm_other: CircuitString,
    status: CircuitString,
    expiration: CircuitString ,
    creationDate :CircuitString ,
    subCategory :CircuitString ,
    otherAddresses :CircuitString ,
    eventGroups :CircuitString ,
    initialRegistrationDate :CircuitString ,
    lastUpdateDate :CircuitString ,
    registration_status :CircuitString ,
    nextRenewalDate :CircuitString ,
    managingLou :CircuitString ,
    corroborationLevel :CircuitString ,
    validatedAt_id :CircuitString ,
    validatedAt_other :CircuitString ,
    validatedAs :CircuitString ,
    otherValidationAuthorities :CircuitString ,
    bic :CircuitString ,
    mic :CircuitString ,
    ocid :CircuitString ,
    spglobal :CircuitString ,
    conformityFlag :CircuitString ,
    managingLou_related :CircuitString ,
    lei_issuer_related :CircuitString , // Note the change from '-' to '_'
    field_modifications_related :CircuitString , 
    direct_parent_relationship_record :CircuitString , 
    direct_parent_lei_record :CircuitString , 
    ultimate_parent_relationship_record :CircuitString , 
    ultimate_parent_lei_record :CircuitString , 
    isins_related :CircuitString , 
    links_self :CircuitString 
  }) {}
  
  export class GLEIFPublicOutput extends Struct({
    name:CircuitString, // Adjust if needed
    id:CircuitString, // Adjust if needed
  }) {}
  
  /*class GLEIFData extends Struct({
    type: CircuitString,
    id: CircuitString,
    lei: CircuitString,
    name: CircuitString,
    legalName_language: CircuitString,
    otherNames: CircuitString,
    transliteratedOtherNames: CircuitString,
    legalAddress_language: CircuitString,
    legalAddress_addressLines: CircuitString,
    legalAddress_city: CircuitString,
    legalAddress_region: CircuitString,
    legalAddress_country: CircuitString,
    legalAddress_postalCode: CircuitString,
    headquartersAddress_language: CircuitString,
    headquartersAddress_addressLines: CircuitString,
    headquartersAddress_city: CircuitString,
    headquartersAddress_region: CircuitString,
    headquartersAddress_country: CircuitString,
    headquartersAddress_postalCode: CircuitString,
    registeredAt_id: CircuitString,
    registeredAt_other: CircuitString,
    registeredAs: CircuitString,
    jurisdiction: CircuitString,
    legalForm_id: CircuitString,
    legalForm_other: CircuitString,
    status: CircuitString,
    expiration: CircuitString ,
    creationDate :CircuitString ,
    subCategory :CircuitString ,
    otherAddresses :CircuitString ,
    eventGroups :CircuitString ,
    initialRegistrationDate :CircuitString ,
    lastUpdateDate :CircuitString ,
    registration_status :CircuitString ,
    nextRenewalDate :CircuitString ,
    managingLou :CircuitString ,
    corroborationLevel :CircuitString ,
    validatedAt_id :CircuitString ,
    validatedAt_other :CircuitString ,
    validatedAs :CircuitString ,
    otherValidationAuthorities :CircuitString ,
    bic :CircuitString ,
    mic :CircuitString ,
    ocid :CircuitString ,
    spglobal :CircuitString ,
    conformityFlag :CircuitString ,
    managingLou_related :CircuitString ,
    lei_issuer_related :CircuitString , // Note the change from '-' to '_'
    field_modifications_related :CircuitString , 
    direct_parent_relationship_record :CircuitString , 
    direct_parent_lei_record :CircuitString , 
    ultimate_parent_relationship_record :CircuitString , 
    ultimate_parent_lei_record :CircuitString , 
    isins_related :CircuitString , 
    links_self :CircuitString
  }) {}*/
  
  export const GLEIF = ZkProgram({
    name:'GLEIF',
    
   publicInput : Field,
  
   publicOutput : GLEIFPublicOutput,
  
   methods:{
        proveCompliance:{ // Generates the public output
            privateInputs:[
              GLEIFComplianceData
            ],
            async method(
                GLEIFToProve : Field,
  
                GLEIFData : GLEIFComplianceData,
  
            ): Promise<GLEIFPublicOutput> {
                console.log('data bef .. company name ', GLEIFData.name.toString, ' status ..', GLEIFData.registration_status.toString);
  
                // Compliance check
                //const expectedActiveComplianceHash = CircuitString.fromString("Active").hash();
                //const activeComplianceHash = GLEIFData.registration_status.hash();
                //activeComplianceHash.assertEquals(expectedActiveComplianceHash);*/
                const activeComplianceHash = CircuitString.fromString("Active").hash();
                const inactiveComplianceHash = CircuitString.fromString("Inactive").hash();
                const currentStatusHash = GLEIFData.registration_status.hash();

                currentStatusHash.assertNotEquals(inactiveComplianceHash); 

                currentStatusHash.assertEquals(activeComplianceHash); 


  
                return new GLEIFPublicOutput({
                    name : GLEIFData.name,
                    id : GLEIFData.id, // Adjust if needed
                });
            },
        },
    },
  });
  
  export class GLEIFProof extends ZkProgram.Proof(GLEIF) {}
  