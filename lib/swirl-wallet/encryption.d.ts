import { type SwirlNote } from './notes.js';
export declare function encryptNote(note: SwirlNote, recipientAddress: string): Uint8Array;
export declare function decryptNote(ciphertext: Uint8Array, viewingSecretKey: Uint8Array, ownerSecret: bigint): Promise<SwirlNote | null>;
