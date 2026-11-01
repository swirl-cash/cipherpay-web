import { type Provider, type Signer, type TransactionReceipt } from 'ethers';
import { SwirlMerkleTree } from './merkle.js';
import { type SwirlNote } from './notes.js';
import { type ProvingAssets } from './prover.js';
import type { SwirlWallet } from './wallet.js';
export type RecoveredNote = {
    note: SwirlNote & {
        leafIndex: number;
    };
    commitment: bigint;
    nullifier: bigint;
    spent: boolean;
};
export type RecoveryState = {
    chainId: number;
    vaultAddress: string;
    notes: RecoveredNote[];
    tree: SwirlMerkleTree;
    lastScannedBlock: number;
};
/** Rebuilds the note tree using only chain events and the user's recovery phrase. */
export declare function recoverWalletNotes(input: {
    provider: Provider;
    wallet: SwirlWallet;
    vaultAddress: string;
    startBlock?: number;
    batchSize?: number;
}): Promise<RecoveryState>;
/** Builds and submits a direct Unshield. No SWIRL website, indexer or Relayer is used. */
export declare function withdrawRecoveredNote(input: {
    signer: Signer;
    wallet: SwirlWallet;
    state: RecoveryState;
    recovered: RecoveredNote;
    recipient: string;
    gatewayAddress?: string;
    assets: ProvingAssets;
}): Promise<TransactionReceipt>;
