import * as snarkjs from 'snarkjs';
import { type MerklePath } from './merkle.js';
import { type SwirlNote } from './notes.js';
export type ProvingAssets = {
    wasm: string | Uint8Array | ArrayBuffer;
    zkey: string | Uint8Array | ArrayBuffer;
};
export type SolidityProof = {
    a: [string, string];
    b: [[string, string], [string, string]];
    c: [string, string];
};
export type ProofInput = {
    note: SwirlNote & {
        leafIndex: number;
    };
    merklePath: MerklePath;
    ownerSecret: bigint;
};
export type SwirlProof = {
    proof: snarkjs.Groth16Proof;
    publicSignals: string[];
    solidity: SolidityProof;
    root: bigint;
    nullifiers: [bigint, bigint];
    outputCommitments: [bigint, bigint, bigint, bigint];
};
export declare function createTransferProof(input: {
    inputs: [ProofInput] | [ProofInput, ProofInput];
    outputs: SwirlNote[];
    ciphertextHash: bigint;
    chainId: bigint;
    publicAmount?: bigint;
    publicRecipient?: bigint;
    zeroInputPath?: MerklePath;
    assets: ProvingAssets;
}): Promise<SwirlProof>;
