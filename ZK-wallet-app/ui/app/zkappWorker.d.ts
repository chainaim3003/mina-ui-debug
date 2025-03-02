export declare const api: {
    setActiveInstanceToDevnet(): Promise<void>;
    loadContract(): Promise<void>;
    compileContract(): Promise<void>;
    fetchAccount(publicKey58: string): Promise<{
        account: import("o1js/dist/node/bindings/mina-transaction/gen/transaction").Account;
        error: undefined;
    } | {
        account: undefined;
        error: {
            statusCode: number;
            statusText: string;
        };
    }>;
    initZkappInstance(publicKey58: string): Promise<void>;
    getNum(): Promise<string>;
    createUpdateTransaction(publicKey: string, zkappAddress: string): Promise<void>;
    proveUpdateTransaction(): Promise<void>;
    getTransactionJSON(): Promise<string>;
};
