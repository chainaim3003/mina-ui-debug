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
    Circuit} from 'o1js';
  
 // import axios from 'axios';
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
  companyStatus: CircuitString,      // Company Status
  authorizedCapital: Field,          // Authorized Capital
  paidUpCapital: Field,              // Paid-up Capital
  lastAGMDate: CircuitString,        // Last AGM Date
  balanceSheetDate: CircuitString,   // Balance Sheet Date
  activeCompliance: CircuitString,   // Active Compliance
  companyActivity: CircuitString,    // Company Activity
  jurisdiction: CircuitString,       // Jurisdiction
  regionalDirector: CircuitString,   // Regional Director
  mcaID: Field,                      // MCA ID
}) {}
  
  //import { compileProgram } from 'o1js/dist/node/lib/proof-system/zkprogram.js';
  
  
  // Define the Public Output Structure
  export class CorporateRegistrationPublicOutput extends Struct({
    companyName:CircuitString,
    companyID:CircuitString,
    //corporateComplianceToProveHash: Field,
    //currCorporateComplianceStatusCodeHash: Field,
    //outputExpectedHash: Field,
    //outputActualHash: Field,
    //creatorPublicKey: PublicKey,
  }) {} 
  
  
  class CorporateRegistrationData extends Struct({
    companyID: CircuitString,
    companyName: CircuitString,
    mcaID: CircuitString,
    businessPANID: CircuitString,
    currCorporateComplianceStatusCode: Field,
    //currentDate: Field,
  }) {
    // method for signature creation and verification
    // toFields(): Field[] {
    //   return [
    //     ...this.companyID.values.map((item) => item.toField()),
    //     ...this.companyName.values.map((item) => item.toField()),
    //     ...this.mcaID.values.map((item) => item.toField()),
    //     ...this.businessPANID.values.map((item) => item.toField()),
    //     //...this.currCompanyComplianceStatusCode.values.map((item) => item.toField()),
    //     //this.currentDate,
    //   ];
   // }
  }
  
  
  //export class ComplianceDataProof = CorporateRegistration.proveCompliance(complianceData);
    // zk-SNARK Program for Compliance.. which verifies corporate registration and international trade compliance.
  //export const proofOfInternationalTradeCompliance = ZkProgram({
  
  //CorporateRegistrationProof corpRegProof = CorporateRegistration.proveCompliance(Field(0),complianceData)
   
  //CorporateRegistationProof = CorporateRegistration.proveCompliance(complianceData);
  
  
    
   export const CorporateRegistration = ZkProgram({
      name: 'CorporateRegistration',
      publicInput: Field,
      publicOutput: CorporateRegistrationPublicOutput,
      methods: {
  
        proveCompliance: { // Generates the public output
          privateInputs: [
           ComplianceData,
            //Signature,
            //Signature,
            //PublicKey,
          ],
          async method(
  //
            corporateRegistationToProve: Field,
            //expectedActiveComplianceHash: CircuitString.fromString("Active").hash(),
            //corporateRegistrationData: CorporateRegistrationData,
            corporateRegistrationData: ComplianceData,
  
            //oracleSignature: Signature,
            //creatorSignature: Signature,
            //creatorPublicKey: PublicKey
          ): Promise<CorporateRegistrationPublicOutput> {
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
            
            // NOW change the logic to map to the real compliance data from MCA API.... 
            
            console.log(' data bef ..  company name ',corporateRegistrationData.companyName.toString, ' active compliance ..', corporateRegistrationData.activeCompliance.toString) 
           
            //corporateRegistrationData.currCorporateComplianceStatusCode.assertEquals(Field(1));
  
            const expectedActiveComplianceHash = CircuitString.fromString("Active").hash();
            const expectedCompanyStatusHash = CircuitString.fromString("ACTIVE Compliant").hash();
            const activeComplianceHash = corporateRegistrationData.activeCompliance.hash();
            const CompanyStatusHash = corporateRegistrationData.companyStatus.hash();
            // Verification logic: check active compliance and company status
            activeComplianceHash.assertEquals(expectedActiveComplianceHash);
            CompanyStatusHash.assertEquals(expectedCompanyStatusHash);
            
            console.log(' data aft ..  company name ',corporateRegistrationData.companyName.toString, ' active compliance ..', corporateRegistrationData.activeCompliance.toString) 
           
            return new CorporateRegistrationPublicOutput({
              //corporateComplianceToProve: corporateComplianceToProve,
              //currCompanyComplianceStatusCode: corporateRegistrationData.currCompanyComplianceStatusCode,
              //outputExpectedHash: Field(corporateRegistationToProveHash),
              //outputActualHash: Field(1),
              //creatorPublicKey: creatorPublicKey,
              companyName: corporateRegistrationData.companyName,
              companyID: corporateRegistrationData.companyID,
             // complianceProof: CorporateRegistration.proveCompliance(Field(0),complianceData)
  
            });
    
    
          },
        },
  
  
      },
    });
  
   
  export class CorporateRegistrationProof extends ZkProgram.Proof(CorporateRegistration) {}

  //export { CorporateRegistrationData, evalCorporateCompliance, zkOracleResponseMock };
  /*
    // Main function to check proofs, perform multiplication, and generate new proof
  const main = async () => {
  
    console.log('Compiling proofs...');
  
    let corporateRegistration = await CorporateRegistration.compile()
    let corporateRegistrationVerKey = corporateRegistration.verificationKey
  
  
    //let corporateRegistationInstance = await (new CorporateRegistration.proveCompliance() );
  
    /*
    const corpData = {
      companyID:'101',
      companyName:'India Exports 1',
      mcaID: '201',
      businessPANID: '1001',
      currCompanyComplianceStatusCode:'1',
    };
    
  
  
    console.log("Fetching compliance data...");
      const response = await axios.get('https://0f4aef00-9db0-4057-949e-df6937e3449b.mock.pstmn.io/vernon_mca');
      const parsedData = response.data;
  
      console.log(parsedData);
      console.log("HI");
  
      console.log(parsedData["CIN"]);
      console.log(parsedData["Active Compliance"]);
  
      const complianceData = new ComplianceData({
        companyID: CircuitString.fromString(parsedData["CIN"] || ''),
        companyName: CircuitString.fromString(parsedData["Company Name"] || ''),
        roc: CircuitString.fromString(parsedData["ROC"] || ''),
        registrationNumber: Field(parsedData["Registration Number"] ?? 0),
        incorporationDate: CircuitString.fromString(parsedData["Incorporation Date"] || ''),
        email: CircuitString.fromString(parsedData["Email"] || ''),
        corporateAddress: CircuitString.fromString(parsedData["Corporate Address"] || ''),
        listed: Field(parsedData["Listed"] ? 1 : 0),
        companyType: CircuitString.fromString(parsedData["Company Type"] || ''),
        companyCategory: CircuitString.fromString(parsedData["Company Category"] || ''),
        companySubcategory: CircuitString.fromString(parsedData["Company Subcategory"] || ''),
        //companyStatus: CircuitString.fromString(parsedData["Company Status"] || ''),
        companyStatus: CircuitString.fromString(parsedData["Company Status"]),
        authorizedCapital: Field(parsedData["Authorized Capital"] ?? 0),
        paidUpCapital: Field(parsedData["Paid-up Capital"] ?? 0),
        lastAGMDate: CircuitString.fromString(parsedData["Last AGM Date"] || ''),
        balanceSheetDate: CircuitString.fromString(parsedData["Balance Sheet Date"] || ''),
        //activeCompliance: CircuitString.fromString(parsedData["Active Compliance"] || ''),
        activeCompliance: CircuitString.fromString(parsedData["Active Compliance"]),
        companyActivity: CircuitString.fromString(parsedData["Company Activity"] || ''),
        jurisdiction: CircuitString.fromString(parsedData["Jurisdiction"] || ''),
        regionalDirector: CircuitString.fromString(parsedData["Regional Director"] || ''),
        mcaID: Field(parsedData["MCA ID"] ?? 0),
      });
  
  console.log(" complianceData ...  " , ComplianceData.toJSON);

  
    let corpRegProof = await CorporateRegistration.proveCompliance(Field(0),complianceData)
  
    console.log ( ' corpRegProof  ' , corpRegProof,' .. code .. ' , corpRegProof.publicOutput.companyName.toString())
  
    console.log ( ' ****************')
  
    const tradeDGFTData = {
      companyID:'101',
      companyName:'India Exports 1',
      dgftID: '301',
      businessPANID: '1001',
      currEXIMComplianceStatusCode:Field(1),
    };
  
    //let tradeProof = await InternationalTradeCompliance.proveCompliance(Field(0),internationalTradeComplianceData)
  
    let valCompProof = corpRegProof.publicOutput.companyName.toString();
    console.log ( ' corpRegProof  ' , corpRegProof,' .. code .. ', valCompProof) ;
   
    //let valTradeProof = tradeProof.publicOutput.currEXIMComplianceStatusCode.toJSON()
  
   // console.log ( ' tradeProof  ' , tradeProof,' .. code .. ' , valTradeProof);
  
    //let corpRegProofField =  Field(valCompProof.valueOf())
    //let tradeProofField =  Field(valTradeProof.valueOf())
  
    //let multipliedEXIMCompliance = corpRegProofField.mul((tradeProofField))
  
    //console.log ( ' corpRegProofField  '       , corpRegProofField );
    //console.log ( ' tradeProofField  '         , tradeProofField );
   // console.log ( ' multipliedEXIMCompliance ' , multipliedEXIMCompliance );
    
    // Print the result as the third proof
    //console.log('Multiplied EXIM Compliance Status Code:', multipliedEXIMCompliance.toString());
  
  };
  
  // Define a function to generate a new proof (customize as needed)
  //const generateNewProof = async () => {
    // Implement the logic to generate a new proof
    // This is a placeholder implementation
  //  return '';
  //};
      
  //main();
  */