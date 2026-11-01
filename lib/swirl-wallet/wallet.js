import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { secp256k1 } from '@noble/curves/secp256k1.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { encodeSwirlAddress } from './address.js';
import { bigintToBytes, BN254_FIELD, bytesToBigint } from './constants.js';
import { ownerFromSecret } from './notes.js';
function deriveKey(seed, purpose) {
    const key = hkdf(sha256, seed, new TextEncoder().encode('SWIRL_PROTOCOL_V1'), new TextEncoder().encode(purpose), 32);
    if (!secp256k1.utils.isValidSecretKey(key))
        throw new Error('Invalid derived key');
    return key;
}
function deriveNoteSecret(seed) {
    const key = hkdf(sha256, seed, new TextEncoder().encode('SWIRL_PROTOCOL_V1'), new TextEncoder().encode('note-owner'), 32);
    const value = bytesToBigint(key) % BN254_FIELD;
    if (value === 0n)
        throw new Error('Invalid derived note key');
    return bigintToBytes(value, 32);
}
export async function createSwirlWallet(chainId, mnemonic = generateMnemonic(wordlist, 256)) {
    if (!validateMnemonic(mnemonic, wordlist))
        throw new Error('Invalid recovery phrase');
    const seed = mnemonicToSeedSync(mnemonic);
    const spendingSecretKey = deriveKey(seed, 'spending');
    const viewingSecretKey = deriveKey(seed, 'viewing');
    const noteSecretKey = deriveNoteSecret(seed);
    const owner = await ownerFromSecret(bytesToBigint(noteSecretKey));
    const spendingPublicKey = bigintToBytes(owner, 32);
    const viewingPublicKey = secp256k1.getPublicKey(viewingSecretKey, true);
    return {
        mnemonic,
        chainId,
        spendingSecretKey,
        noteSecretKey,
        viewingSecretKey,
        spendingPublicKey,
        viewingPublicKey,
        address: encodeSwirlAddress({ chainId, spendingPublicKey, viewingPublicKey }),
    };
}
export function walletFingerprint(wallet) {
    return bytesToHex(sha256(wallet.spendingPublicKey));
}
