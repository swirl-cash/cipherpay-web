export type MerklePath = {
    root: bigint;
    pathElements: bigint[];
    leafIndex: number;
};
export declare function verifyMerklePath(leaf: bigint, path: MerklePath): Promise<boolean>;
export declare class SwirlMerkleTree {
    readonly depth: number;
    private leaves;
    private zeroes;
    private poseidon;
    private constructor();
    static create(depth?: number, leaves?: bigint[]): Promise<SwirlMerkleTree>;
    private pair;
    insert(leaf: bigint): number;
    get root(): bigint;
    path(leafIndex: number): MerklePath;
}
