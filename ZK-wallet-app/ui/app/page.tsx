'use client';
import { Field, VerificationKey } from 'o1js';
import { useEffect, useState } from 'react';
import GradientBG from '../components/GradientBG';
import styles from '../styles/Home.module.css';
import './reactCOIServiceWorker';
import ZkappWorkerClient from './zkappWorkerClient';
import { MCALevel1FirstWayCircuit1 } from '../../contracts/src/MCAFirstLevel1';

let transactionFee = 0.1;
//const ZKAPP_ADDRESS = 'B62qqtLmKatSvWwiPa9qXALUoiiZaZUjbp7LMaco1Ve1NerKo6T41cR'; //tr1 - withparams
//const ZKAPP_ADDRESS = 'B62qomRtP8rJwJdKvmbnm5Uxh38nSMkZxyZhdaPg9L2zprdtru4RtJH'; //try2 - permissions
const ZKAPP_ADDRESS = 'B62qiXKUCdDPbDws1D2mNByiia7ecdJD5qF6rrTanVANeeCUp2g1uHY'; //try3 - none permissions
//const ZKAPP_ADDRESS = 'B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP'; // tut 4 add()
export default function Home() {
  const [zkappWorkerClient, setZkappWorkerClient] = useState<null | ZkappWorkerClient>(null);
  const [hasWallet, setHasWallet] = useState<null | boolean>(null);
  const [hasBeenSetup, setHasBeenSetup] = useState(false);
  const [accountExists, setAccountExists] = useState(false);
  const [currentNum, setCurrentNum] = useState<null | Field>(null);
  const [publicKeyBase58, setPublicKeyBase58] = useState('');
  const [creatingTransaction, setCreatingTransaction] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [transactionlink, setTransactionLink] = useState('');
  
  const displayStep = (step: string) => {
    setDisplayText(step)
    console.log(step)
  }

  // -------------------------------------------------------
  // Do Setup

  useEffect(() => {
    const setup = async () => {
      try {
        if (!hasBeenSetup) {
          displayStep('Loading web worker...')
          const zkappWorkerClient = new ZkappWorkerClient();
          setZkappWorkerClient(zkappWorkerClient);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          displayStep('Done loading web worker')

          await zkappWorkerClient.setActiveInstanceToDevnet();

          const mina = (window as any).mina;
          if (mina == null) {
            setHasWallet(false);
            displayStep('Wallet not found.');
            return;
          }
          
          const publicKeyBase58: string = (await mina.requestAccounts())[0];
          setPublicKeyBase58(publicKeyBase58);
          displayStep(`Using key:${publicKeyBase58}`);

          displayStep('Checking if fee payer account exists...');
          const res = await zkappWorkerClient.fetchAccount(
            publicKeyBase58,
            );
          console.log("after fee payer account")
          const accountExists = res.error === null;
          setAccountExists(accountExists);
          console.log("after account exists");
          await zkappWorkerClient.loadContract();
          console.log("after loadcontract");
          displayStep('Compiling zkApp...');
          await zkappWorkerClient.compileContract();
          displayStep('zkApp compiled');

          await zkappWorkerClient.initZkappInstance(ZKAPP_ADDRESS);

          displayStep('Getting zkApp state...');
          await zkappWorkerClient.fetchAccount(ZKAPP_ADDRESS);
          const currentNum = await zkappWorkerClient.getNum();
          setCurrentNum(currentNum);
          console.log(`Current state in zkApp: ${currentNum}`);

          
          setHasBeenSetup(true);
          setHasWallet(true);
          setDisplayText('');
          
        }
      } catch (error: any) {
        displayStep(`Error during setup: ${error.message}`);
      }
    };

    setup();
  }, []);

  // -------------------------------------------------------
  // Wait for account to exist, if it didn't

  useEffect(() => {
    const checkAccountExists = async () => {
      if (hasBeenSetup && !accountExists) {
        try { 
          for (;;) {
            displayStep('Checking if fee payer account exists...');
            
            const res = await zkappWorkerClient!.fetchAccount(publicKeyBase58);
            const accountExists = res.error == null;
            if (accountExists) {
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
          } 
        } catch (error: any) {
          displayStep(`Error checking account: ${error.message}`);
        }

      }
      setAccountExists(true);
    };

    checkAccountExists();
  }, [zkappWorkerClient, hasBeenSetup, accountExists]);

  // -------------------------------------------------------
  // Send a transaction

  const onSendTransaction = async () => {
    setCreatingTransaction(true);
    displayStep('Creating a transaction...');
   
    console.log('publicKeyBase58 sending to worker', publicKeyBase58);
    await zkappWorkerClient!.fetchAccount(publicKeyBase58);

    await zkappWorkerClient!.createUpdateTransaction(publicKeyBase58,ZKAPP_ADDRESS);

    displayStep('Creating proof...');
    await zkappWorkerClient!.proveUpdateTransaction();

    displayStep('Requesting send transaction...');
    let transactionJSON = await zkappWorkerClient!.getTransactionJSON();
    
    console.log("Transaction JSON PROOF :",transactionJSON);
    const { verificationKey } = await MCALevel1FirstWayCircuit1.compile();

    displayStep('Getting transaction JSON...');
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      //important fix -  we had to command this line of code to make it work with zkapp cache.
     // VerificationKey:verificationKey,
      //feePayer: {
        //fee: transactionFee,
        //memo: '',
      //},
    });

    console.log("Hash: ",{hash});

    const transactionLink = `https://minascan.io/devnet/tx/${hash}`;
    setTransactionLink(transactionLink);
    setDisplayText(transactionLink);

    setCreatingTransaction(true);
  };

  // -------------------------------------------------------
  // Refresh the current state

  const onRefreshCurrentNum = async () => {
    try {
      displayStep('Getting zkApp state...');
      await zkappWorkerClient!.fetchAccount(ZKAPP_ADDRESS);
      const currentNum = await zkappWorkerClient!.getNum();
      setCurrentNum(currentNum);
      console.log(`Current state in zkApp: ${currentNum}`);
      setDisplayText('');
    } catch (error: any) {
      displayStep(`Error refreshing state: ${error.message}`);
    }
  };

  // -------------------------------------------------------
  // Create UI elements

  let auroLinkElem;
  if (hasWallet === false) {
    const auroLink = 'https://www.aurowallet.com/';
    auroLinkElem = (
      <div>
        Could not find a wallet.{' '}
        <a href="https://www.aurowallet.com/" target="_blank" rel="noreferrer">
          Install Auro wallet here
        </a>
      </div>
    );
  }

  const stepDisplay = transactionlink ? (
    <a
      href={transactionlink}
      target="_blank"
      rel="noreferrer"
      style={{ textDecoration: 'underline' }}
    >
      View transaction
    </a>
  ) : (
    displayText
  );

  let setup = (
    <div
      className={styles.start}
      style={{ fontWeight: 'bold', fontSize: '1.5rem', paddingBottom: '5rem' }}
    >
      {stepDisplay}
      {auroLinkElem}
    </div>
  );

  let accountDoesNotExist;
  if (hasBeenSetup && !accountExists) {
    const faucetLink =
      `https://faucet.minaprotocol.com/?address='${publicKeyBase58}`;
    accountDoesNotExist = (
      <div>
        <span style={{ paddingRight: '1rem' }}>Account does not exist.</span>
        <a href={faucetLink} target="_blank" rel="noreferrer">
          Visit the faucet to fund this fee payer account
        </a>
      </div>
    );
  }

  let mainContent;
  if (hasBeenSetup && accountExists) {
    mainContent = (
      <div style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className={styles.center} style={{ padding: 0 }}>
          Current state in zkApp: {currentNum?.toString()}{' '}
        </div>
        <button
          className={styles.card}
          onClick={onSendTransaction}
          disabled={creatingTransaction}
        >
          Send Transaction
        </button>
        <button className={styles.card} onClick={onRefreshCurrentNum}>
          Get Latest State
        </button>
      </div>
    );
  }

  return (
    <GradientBG>
      <div className={styles.main} style={{ padding: 0 }}>
        <div className={styles.center} style={{ padding: 0 }}>
          {setup}
          {accountDoesNotExist}
          {mainContent}
        </div>
      </div>
    </GradientBG>
  );
}