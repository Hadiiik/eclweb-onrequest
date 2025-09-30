import SHA1 from 'crypto-js/sha1';
import encHex from 'crypto-js/enc-hex';

export function ipToShortUniqueId(ip: string, length: number = 8): string {
  const hash = SHA1(ip).toString(encHex);
  const base36 = BigInt('0x' + hash).toString(36);
  return base36.slice(0, length);
}
