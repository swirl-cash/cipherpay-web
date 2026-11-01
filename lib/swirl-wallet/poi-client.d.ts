import type { Groth16Proof } from 'snarkjs';
import { type MerklePath } from './merkle.js';
export type POIStatus = 'Valid' | 'ShieldBlocked' | 'ShieldPending' | 'ProofSubmitted' | 'Missing';
export type POIEventType = 'Shield' | 'Transact' | 'Unshield';
export type SignedPOIEvent = {
    index: number;
    blindedCommitment: string;
    signature: string;
    type: POIEventType;
    merkleRoot: string;
};
export type POITransactionRecord = {
    transactionHash: string;
    txidIndex: number;
    txid: string;
    txidLeaf: string;
    txidMerkleRoot: string;
    nullifiers: [string, string];
    outputCommitments: [string, string, string, string];
    ciphertextHash: string;
    publicAmount: string;
    publicRecipient: string;
    token: string;
    chainId: string;
    firstLeafIndex: number;
};
export type POIProofSubmission = {
    proof: Groth16Proof;
    publicSignals: string[];
    blindedCommitmentsOut: string[];
    txid: string;
    txidIfHasUnshield: string;
    txidMerkleRoot: string;
    txidMerkleRootIndex: number;
    poiMerkleRoots: string[];
};
export declare class POINodeClient {
    private readonly options;
    private readonly baseUrl;
    constructor(options: {
        url: string;
        chainId: number;
        vault: string;
        listKey: string;
        timeoutMs?: number;
    });
    private request;
    health(): Promise<void>;
    getStatuses(blindedCommitments: string[]): Promise<Record<string, POIStatus>>;
    getPOIPaths(blindedCommitments: string[]): Promise<MerklePath[]>;
    validatePOIRoots(roots: string[]): Promise<boolean>;
    getTransaction(txid: string): Promise<{
        transaction: POITransactionRecord;
        path: MerklePath;
    }>;
    submitProof(submission: POIProofSubmission): Promise<void>;
}
