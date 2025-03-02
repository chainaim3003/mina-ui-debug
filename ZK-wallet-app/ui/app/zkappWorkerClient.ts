import { Field , fetchAccount} from 'o1js';
import { WorkerFunctions, ZkappWorkerReponse, ZkappWorkerRequest } from './zkappWorker';

export default class ZkappWorkerClient {


  async setActiveInstanceToDevnet() {
    return this._call('setActiveInstanceToDevnet',{});
  }

  async loadContract() {
    return this._call('loadContract',{});
  }

  async compileContract(){
    return await this._call('compileContract',{});
  } 

  async fetchAccount(publicKey:string): ReturnType<typeof fetchAccount> {
    const result = this._call('fetchAccount', {
      publicKey58: publicKey
    });
    return result as ReturnType<typeof fetchAccount>;
  }

  async initZkappInstance(publicKeyBase58: string) {
    return this._call('initZkappInstance', {publicKeyBase58});
  }

  async getNum(): Promise<Field> {
    const result = await this._call('getNum',{});
    
    return Field.fromJSON(JSON.parse(result as string));
  }

  async createUpdateTransaction(userPublicKey: string, zkappAddress: string) {
    return await this._call('createUpdateTransaction',{userPublicKey, zkappAddress});
  }

  async proveUpdateTransaction() {
    return this._call('proveUpdateTransaction',{});
  }

  async getTransactionJSON() {
    return this._call('getTransactionJSON',{});
  }


  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL('./zkappWorker.ts', import.meta.url), { type: 'module' });
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    try {
      return new Promise((resolve, reject) => {
        this.promises[this.nextId] = { resolve, reject };
  
        const message: ZkappWorkerRequest = {
          id: this.nextId,
          fn,
          args,
        };
  
        this.worker.postMessage(message);
  
        this.nextId++;
      });
  
    }catch(err){
      console.log(err)
    }
  }

}