import { Mina, PublicKey, fetchAccount, CircuitString, Field, Cache} from 'o1js';
import { MCALevel1FirstWayCircuit1 } from '../../contracts/src/MCAFirstLevel1';
import { ComplianceData } from '../../contracts/src/MCAFirstLevel1';
import axios from 'axios';


type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

interface VerificationKeyData{
  data:string,
  hash:Field
}

const state = {
  AddInstance: null as null | typeof MCALevel1FirstWayCircuit1,
  zkappInstance: null as null | MCALevel1FirstWayCircuit1,
  transaction: null as null | Transaction,
  verificationKey: null as null | VerificationKeyData | any,
};
const zkAppCache: Cache = Cache.FileSystem("./zkAppCache");

export const api = {

  setActiveInstanceToDevnet: async () => { 
    const Network = Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
    console.log('Devnet network instance configured');
    Mina.setActiveInstance(Network);
  },

  loadContract: async(args: {}) => {
    console.log("Arrived here");
    const { MCALevel1FirstWayCircuit1 } = await import('../../contracts/build/src/MCAFirstLevel1.js');
    state.AddInstance = MCALevel1FirstWayCircuit1;
    console.log("Printing the smart contract structure from ui side:",await state.AddInstance.toString())
  },

  compileContract: async (args: {}) =>{
    console.log("Printing the content in zkappCache:", {cache:zkAppCache});
    const { verificationKey } = await state.AddInstance!.compile({cache:zkAppCache});
    console.log("Verification Key: ", verificationKey);
    state.verificationKey = verificationKey;
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return fetchAccount({ publicKey });
  },
   initZkappInstance: async (args: {publicKeyBase58: string}) =>{
    console.log("Arrived here");
    const publicKey = PublicKey.fromBase58(args.publicKeyBase58);
    
    state.zkappInstance = new state.AddInstance!(publicKey);
    console.log("Arrived end of the initzkappinstance");
  },
   getNum: async (args: {}) =>{
    const currentNum = state.zkappInstance!.num.get();
    return JSON.stringify(currentNum.toJSON());
  },
   createUpdateTransaction: async(args:{userPublicKey : string,  zkappAddress: string})=> {

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
    let zkaddress = PublicKey.fromBase58(args.zkappAddress);
    let zkApp = new MCALevel1FirstWayCircuit1(zkaddress);
    // 2 json files each with one key pair. 
    // 1 - contracts/keys - zkappAddress - private and public pair
    // 2 - ./cache - deployer account - private and public pair

    let userPublicKey = PublicKey.fromBase58(args.userPublicKey);
    let transactionfee = 0.1 * 1e9;
    
    state.transaction = await Mina.transaction(
      {sender: userPublicKey, fee : transactionfee},
      async () => {
      await state.zkappInstance!.verifyComplianceWithParams(complianceData);
    });
    /**let proof1 = await Mina.transaction(
      {sender: userPublicKey, fee : transactionfee},
      async () => {
      await zkApp.verifyComplianceWithParams(complianceData);
    });
    let proofss = await proof1.prove();
    console.log("printing the proof created using the logic of interact.ts: ",proofss.toJSON());*/
  },
  proveUpdateTransaction: async () => {
    let second_proof = await state.transaction!.prove();
    console.log("second proof in proveUpdateTransaction",second_proof);
  },
  getTransactionJSON: async () => {
   return state.transaction!.toJSON();
  },
};

// Expose the API to be used by the main thread

export type WorkerFunctions = keyof typeof api;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

addEventListener("message", async (event: MessageEvent<ZkappWorkerRequest>) => {
  const returnData = await api[event.data.fn](event.data.args);

  const message: ZkappWorkerReponse = {
    id: event.data.id,
    data: returnData,
  };
  postMessage(message);
});
