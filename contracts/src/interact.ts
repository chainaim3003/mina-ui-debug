/**
 * This script can be used to interact with the Add contract, after deploying it.
 *
 * We call the update() method on the contract, create a proof and send it to the chain.
 * The endpoint that we interact with is read from your config.json.
 *
 * This simulates a user interacting with the zkApp from a browser, except that here, sending the transaction happens
 * from the script and we're using your pre-funded zkApp account to pay the transaction fee. In a real web app, the user's wallet
 * would send the transaction and pay the fee.
 *
 * To run locally:
 * Build the project: `$ npm run build`
 * Run with node:     `$ node build/src/interact.js <deployAlias>`.
 */
import fs from 'fs/promises';
import { Mina, NetworkId, PrivateKey,CircuitString, Field, PublicKey, Cache } from 'o1js';
import { MCALevel1FirstWayCircuit1 } from './MCAFirstLevel1.js';
import axios from 'axios';
import { ComplianceData } from './MCAFirstLevel1.js';

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


// check command line arg
let deployAlias = process.argv[2];
if (!deployAlias)
  throw Error(`Missing <deployAlias> argument.

Usage:
node build/src/interact.js <deployAlias>
`);
Error.stackTraceLimit = 1000;
const DEFAULT_NETWORK_ID = 'testnet';

// parse config and private key from file
type Config = {
  deployAliases: Record<
    string,
    {
      networkId?: string;
      url: string;
      keyPath: string;
      fee: string;
      feepayerKeyPath: string;
      feepayerAlias: string;
    }
  >;
};
let configJson: Config = JSON.parse(await fs.readFile('config.json', 'utf8'));
let config = configJson.deployAliases[deployAlias];
let feepayerKeysBase58: { privateKey: string; publicKey: string } = JSON.parse(
  await fs.readFile(config.feepayerKeyPath, 'utf8')
);

let zkAppKeysBase58: { privateKey: string; publicKey: string } = JSON.parse(
  await fs.readFile(config.keyPath, 'utf8')
);

let feepayerKey = PrivateKey.fromBase58(feepayerKeysBase58.privateKey);
let zkAppKey = PrivateKey.fromBase58(zkAppKeysBase58.privateKey);

// set up Mina instance and contract we interact with
const Network = Mina.Network({
  // We need to default to the testnet networkId if none is specified for this deploy alias in config.json
  // This is to ensure the backward compatibility.
  networkId: (config.networkId ?? DEFAULT_NETWORK_ID) as NetworkId,
  mina: config.url,
});
// const Network = Mina.Network(config.url);
const fee = Number(config.fee) * 1e9; // in nanomina (1 billion = 1.0 mina)
Mina.setActiveInstance(Network);
let feepayerAddress = feepayerKey.toPublicKey();
let zkAppAddress = zkAppKey.toPublicKey();
let zkApp = new MCALevel1FirstWayCircuit1(zkAppAddress);

feepayerKey = PrivateKey.fromBase58('EKEjrTb8QYFrdkBhpHL8m15xVYgQHerVN9nzfqzot13ABdB12Vyr');
feepayerAddress = feepayerKey.toPublicKey();

console.log("Fee payer Address:", feepayerAddress.toJSON());

// compile the contract to create prover keys
console.log('compile the contract...');
const zkAppCache: Cache = Cache.FileSystem("./zkAppCache");
// const zkProgramCache: Cache = Cache.FileSystem("./zkProgramCache");
const {verificationKey} = await MCALevel1FirstWayCircuit1.compile({cache:zkAppCache});
console.log("Verfication Key:", verificationKey);

// try {
//   // call update() and send transaction
//   console.log('build transaction and create proof...');
  
//   let tx = await Mina.transaction(
//     { sender: feepayerAddress, fee },
//     async () => {
//       console.log("This is being executed inside interact.ts - Mina.transaction");
//       await zkApp.verifyComplianceWithParams(complianceData);
//     }
//   );
//   let proof = await tx.prove();

//   console.log("Proof:", proof);
//   console.log("Proof json:", proof.toJSON())

//   console.log('send transaction...');
//   const sentTx = await tx.sign([feepayerKey]).send();

//   console.log("sentTx:", sentTx);
//   console.log("sentTxjson:", sentTx.toJSON());
//   if (sentTx.status === 'pending') {
//     console.log(
//       '\nSuccess! Update transaction sent.\n' +
//         '\nYour smart contract state will be updated' +
//         '\nas soon as the transaction is included in a block:' +
//         `\n${getTxnUrl(config.url, sentTx.hash)}`
//     );
//   }
// } catch (err) {
//   console.log(err);
// }

// function getTxnUrl(graphQlUrl: string, txnHash: string | undefined) {
//   const hostName = new URL(graphQlUrl).hostname;
//   const txnBroadcastServiceName = hostName
//     .split('.')
//     .filter((item) => item === 'minascan')?.[0];
//   const networkName = graphQlUrl
//     .split('/')
//     .filter((item) => item === 'mainnet' || item === 'devnet')?.[0];
//   if (txnBroadcastServiceName && networkName) {
//     return `https://minascan.io/${networkName}/tx/${txnHash}?type=zk-tx`;
//   }
//   return `Transaction hash: ${txnHash}`;
// }
