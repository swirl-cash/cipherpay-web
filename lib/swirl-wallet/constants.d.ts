export declare const BN254_FIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
export declare const TREE_DEPTH = 16;
export declare const MAX_NOTE_AMOUNT: bigint;
export declare function assertField(value: bigint, name: string): void;
export declare function assertAmount(value: bigint, name?: string): void;
export declare function bigintToBytes(value: bigint, length: number): Uint8Array;
export declare function bytesToBigint(value: Uint8Array): bigint;
export declare function randomField(): bigint;
