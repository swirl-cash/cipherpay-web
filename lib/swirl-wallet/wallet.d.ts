export type SwirlWallet = {
    mnemonic: string;
    chainId: number;
    address: string;
    spendingSecretKey: Uint8Array;
    noteSecretKey: Uint8Array;
    viewingSecretKey: Uint8Array;
    spendingPublicKey: Uint8Array;
    viewingPublicKey: Uint8Array;
};
export declare function createSwirlWallet(chainId: number, mnemonic?: string): Promise<SwirlWallet>;
export declare function walletFingerprint(wallet: SwirlWallet): string;
