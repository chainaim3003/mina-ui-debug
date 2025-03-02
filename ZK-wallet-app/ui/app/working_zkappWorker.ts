import { Mina, PublicKey, fetchAccount, CircuitString, Field } from 'o1js';
import * as Comlink from "comlink";
import type { MCALevel1FirstWayCircuit1 } from '../../contracts/src/MCAFirstLevel1';
import { ComplianceData } from '../../contracts/src/MCAFirstLevel1';
import axios from 'axios';


type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

const state = {
  AddInstance: null as null | typeof MCALevel1FirstWayCircuit1,
  zkappInstance: null as null | MCALevel1FirstWayCircuit1,
  transaction: null as null | Transaction,
};

export const api = {
  async setActiveInstanceToDevnet() {
    const Network = Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
    console.log('Devnet network instance configured');
    Mina.setActiveInstance(Network);
  },
  async loadContract() {
    const { MCALevel1FirstWayCircuit1 } = await import('../../contracts/build/src/MCAFirstLevel1.js');
    state.AddInstance = MCALevel1FirstWayCircuit1;
  },
  async compileContract() {
    await state.AddInstance!.compile();
  },
  async fetchAccount(publicKey58: string) {
    const publicKey = PublicKey.fromBase58(publicKey58);
    return fetchAccount({ publicKey });
  },
  async initZkappInstance(publicKey58: string) {
    const publicKey = PublicKey.fromBase58(publicKey58);
    state.zkappInstance = new state.AddInstance!(publicKey);
  },
  async getNum() {
    const currentNum = await state.zkappInstance!.num.get();
    return JSON.stringify(currentNum.toJSON());
  },
  async createUpdateTransaction() {

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

    state.transaction = await Mina.transaction(async () => {
      await state.zkappInstance!.verifyComplianceWithParams(complianceData);
    });
  },
  async proveUpdateTransaction() {
    let second_proof = await state.transaction!.prove();
    //await second_proof.sign([]).send();
    console.log("second proof in proveUpdateTransaction",second_proof);
  },
  async getTransactionJSON() {
    return state.transaction!.toJSON();
  },
};

// Expose the API to be used by the main thread
Comlink.expose(api);