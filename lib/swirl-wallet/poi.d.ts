import * as snarkjs from 'snarkjs';
import { type MerklePath } from './merkle.js';
import { type SwirlNote } from './notes.js';
import type { ProvingAssets } from './prover.js';
export type BlindedCommitmentType = 'Shield' | 'Transact' | 'Unshield';
export declare function poseidonHash(values: bigint[]): Promise<bigint>;
export declare function hex32(value: bigint): string;
export declare function blindedCommitment(commitment: bigint, owner: bigint, globalLeafPosition: number): Promise<bigint>;
export declare function swirlBoundParamsHash(input: {
    ciphertextHash: bigint;
    publicAmount: bigint;
    publicRecipient: bigint;
    token: bigint;
    chainId: bigint;
}): Promise<bigint>;
export declare function swirlTransactionID(input: {
    nullifiers: [bigint, bigint];
    outputCommitments: [bigint, bigint, bigint, bigint];
    boundParamsHash: bigint;
}): Promise<bigint>;
export declare function swirlTxidLeaf(txid: bigint, firstLeafIndex: number): Promise<bigint>;
export type POITransactionData = {
    nullifiers: [bigint, bigint];
    outputCommitments: [bigint, bigint, bigint, bigint];
    ciphertextHash: bigint;
    publicAmount: bigint;
    publicRecipient: bigint;
    token: bigint;
    chainId: bigint;
    firstLeafIndex: number;
    txidMerklePath: MerklePath;
};
export type POIProofInput = {
    note: SwirlNote & {
        leafIndex: number;
    };
    ownerSecret: bigint;
    poiMerklePath: MerklePath;
};
export type POIProofResult = {
    proof: snarkjs.Groth16Proof;
    publicSignals: string[];
    blindedCommitmentsOut: string[];
    txid: string;
    txidLeaf: string;
    txidIfHasUnshield: string;
    txidMerkleRoot: string;
    txidMerkleRootIndex: number;
    poiMerkleRoots: string[];
};
export declare function createPOIProof(input: {
    inputs: [POIProofInput] | [POIProofInput, POIProofInput];
    outputs: SwirlNote[];
    transaction: POITransactionData;
    assets: ProvingAssets;
}): Promise<POIProofResult>;
export declare const PRE_TRANSACTION_LEAF_INDEX = 199999;
export declare function createPreTransactionTxidPath(txidLeaf: bigint): Promise<MerklePath>;
export declare function createPreTransactionPOIProof(input: {
    inputs: [POIProofInput] | [POIProofInput, POIProofInput];
    outputs: SwirlNote[];
    transaction: Omit<POITransactionData, 'firstLeafIndex' | 'txidMerklePath'>;
    assets: ProvingAssets;
}): Promise<POIProofResult>;
