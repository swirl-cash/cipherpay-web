export declare const SWIRL_ADDRESS_PREFIX = "swirl";
export declare const SWIRL_ADDRESS_VERSION = 1;
export type SwirlAddressData = {
    version: number;
    chainId: number;
    spendingPublicKey: Uint8Array;
    viewingPublicKey: Uint8Array;
};
export declare function encodeSwirlAddress(data: Omit<SwirlAddressData, 'version'>): string;
export declare function decodeSwirlAddress(address: string): SwirlAddressData;
export declare function isSwirlAddress(address: string, chainId?: number): boolean;
