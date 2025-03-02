import { Mina, PrivateKey, PublicKey, Field, Poseidon } from 'o1js';



const useProof = false;
export const Local = await Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);

export const deployerAccount = Local.testAccounts[0];
export const deployerKey = deployerAccount.key;
export const senderAccount = Local.testAccounts[1];
export const senderKey = senderAccount.key;
export const Oracle_Private_key=Local.testAccounts[2];