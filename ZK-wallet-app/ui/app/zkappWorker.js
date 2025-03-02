import { Mina, PublicKey, fetchAccount, CircuitString, Field } from 'o1js';
import * as Comlink from "comlink";
import { ComplianceData } from '../../contracts/src/MCAFirstLevel1';
import axios from 'axios';
const state = {
    AddInstance: null,
    zkappInstance: null,
    transaction: null,
};
export const api = {
    async setActiveInstanceToDevnet() {
        const Network = Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
        console.log('Devnet network instance configured');
        Mina.setActiveInstance(Network);
    },
    async loadContract() {
        const { MCALevel1FirstWayCircuit1 } = await import('../../contracts/build/src/MCAFirstLevel1.js');
        const { verificationKey } = await MCALevel1FirstWayCircuit1.compile();
        console.log("Verification key inside loadcontract: ", verificationKey);
        state.AddInstance = MCALevel1FirstWayCircuit1;
    },
    async compileContract() {
        const { verificationKey } = await state.AddInstance.compile();
        console.log("Verification Key: ", verificationKey);
    },
    async fetchAccount(publicKey58) {
        const publicKey = PublicKey.fromBase58(publicKey58);
        return fetchAccount({ publicKey });
    },
    async initZkappInstance(publicKey58) {
        const publicKey = PublicKey.fromBase58(publicKey58);
        state.zkappInstance = new state.AddInstance(publicKey);
    },
    async getNum() {
        const currentNum = await state.zkappInstance.num.get();
        return JSON.stringify(currentNum.toJSON());
    },
    async createUpdateTransaction(publicKey, zkappAddress) {
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
        const { MCALevel1FirstWayCircuit1 } = await import('../../contracts/build/src/MCAFirstLevel1.js');
        let zkaddress = PublicKey.fromBase58(zkappAddress);
        let zkApp = new MCALevel1FirstWayCircuit1(zkaddress);
        // 2 json files each with one key pair. 
        // 1 - contracts/keys - zkappAddress - private and public pair
        // 2 - ./cache - deployer account - private and public pair
        let userPublicKey = PublicKey.fromBase58(publicKey);
        let transactionfee = 0.1 * 1e9;
        state.transaction = await Mina.transaction({ sender: userPublicKey, fee: transactionfee }, async () => {
            await state.zkappInstance.verifyComplianceWithParams(complianceData);
        });
        /**let proof1 = await Mina.transaction(
          {sender: userPublicKey, fee : transactionfee},
          async () => {
          await zkApp.verifyComplianceWithParams(complianceData);
        });
        let proofss = await proof1.prove();
        console.log("printing the proof created using the logic of interact.ts: ",proofss.toJSON());*/
    },
    async proveUpdateTransaction() {
        let second_proof = await state.transaction.prove();
        console.log("second proof in proveUpdateTransaction", second_proof);
    },
    async getTransactionJSON() {
        return state.transaction.toJSON();
    },
};
// Expose the API to be used by the main thread
Comlink.expose(api);
//# sourceMappingURL=zkappWorker.js.map