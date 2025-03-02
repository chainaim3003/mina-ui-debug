import { Mina, PrivateKey, Field, Poseidon, AccountUpdate } from 'o1js';
import { HashVerifier } from './HashVerifier.js';
import { SecretHash, SecretHashProof } from './SecretHash.js';

async function main() {
  /*const Local = Mina.LocalBlockchain({ proofsEnabled: true });

 // Mina.setActiveInstance(Local);
 const localInstance = await Local; // Await the promise before using it
Mina.setActiveInstance(localInstance);
  const deployer = (await Local).testAccounts[0].key;
  const deployerPublicKey = deployer.toPublicKey();*/

  
const useProof = false;

const Local = await Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);

const deployerAccount = Local.testAccounts[0];
const deployerKey = deployerAccount.key;
const senderAccount = Local.testAccounts[1];
const senderKey = senderAccount.key;

  /*const deployerKeypair = PrivateKey.random();
  const deployer = deployerKeypair;*/

  //const deployer = localInstance.testAccounts[0].keypair.privateKey; // If keypair exists


  // Compile artifacts
  console.log('Compiling...');
  await SecretHash.compile();
  const { verificationKey } = await HashVerifier.compile();
  console.log("verification key is successful");
  // Deploy contract
  const zkAppKey = PrivateKey.random();
  const zkAppAddress = zkAppKey.toPublicKey();


  /*await Mina.transaction(deployerKeypair, async () => {
    await Mina.fundAccount({ address: zkAppAddress, initialBalance: 10 });
  }).send();*/
  console.log("ZKAppAddress is successful");
  const zkApp = new HashVerifier(zkAppAddress);
  console.log("zkApp is successful");

  /*await Mina.transaction(deployerPublicKey, async () => {
    AccountUpdate.fundNewAccount(deployerPublicKey); // Ensure deployer has funds
    AccountUpdate.fundNewAccount(zkAppAddress); // Fund the zkApp address

  }).send();*/
  
  console.log("Mina transaction is successful");

  const deployTxn = await Mina.transaction(
     deployerAccount,
    async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy({ verificationKey });
      zkApp.storedHash.set(Field(42));
    }
  );
  console.log("deployTxn is successful");
  await deployTxn.sign([deployerKey, zkAppKey]).send();
  console.log("deployTxn signed successfully");
  // Generate test proof
  const secret = Field(42);
  const correctHash = Poseidon.hash([secret]);
  const proof = await SecretHash.generate(correctHash, secret);

  // Verify proof
  const txn = await Mina.transaction(
    { sender: zkAppAddress, fee: 0.1e9 },
    async () => {
      await zkApp.verifyProof(proof);
    }
  );
  await txn.sign([zkAppKey]).send();

  console.log('✅ Proof verified successfully!');
}

main().catch(err => {
  console.error('Error:', err);
});
