export type SwirlNote = {
    owner: bigint;
    token: bigint;
    amount: bigint;
    randomness: bigint;
    leafIndex?: number;
};
export declare function ownerFromSecret(ownerSecret: bigint): Promise<bigint>;
export declare function noteCommitment(note: SwirlNote): Promise<bigint>;
export declare function noteNullifier(ownerSecret: bigint, leafIndex: number): Promise<bigint>;
export declare function createNoteForAddress(input: {
    address: string;
    token: bigint;
    amount: bigint;
    chainId: number;
    randomness?: bigint;
}): Promise<SwirlNote>;
export declare function zeroNote(token: bigint): SwirlNote;
