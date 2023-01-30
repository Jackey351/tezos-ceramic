import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { fromString as uint8ArrayfromString } from 'uint8arrays/from-string';

/**
 * Encode an object to base64 string
 *
 * @param obj - the object to encode
 * @returns A base64 string
 *
 */
export function jsonToB64(obj: Record<string, any>): string {
  return uint8ArrayToString(uint8ArrayfromString(JSON.stringify(obj)), 'base64url');
}

/**
 * Decode a base64 string to JSON object
 *
 * @param s - a base64 string
 * @returns An object
 *
 */
export function b64ToJSON(s: string): Record<string, any> {
  return JSON.parse(uint8ArrayToString(uint8ArrayfromString(s, 'base64url'))) as Record<
    string,
    any
  >;
}

/**
 * Encode a Blob to base64 string
 *
 * @param blob - the Blob object to encode
 * @returns A promise that returns the encoded string
 *
 */
export function blobToB64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reader.result.replace('data:application/octet-stream;base64,', ''),
      );
    reader.readAsDataURL(blob);
  });
}

/**
 * Decode a base64 string to an Uint8Array
 *
 * @param b64String - the base64 string
 * @returns An Uint8Array
 *
 */
export function b64ToU8a(b64String: string): Uint8Array {
  return uint8ArrayfromString(b64String, 'base64');
}

/**
 * Encode a uint8array/bytes to a base64 string
 *
 * @param b - the uint8array
 * @returns A string
 *
 */
export function u8aToB64(b: Uint8Array): string {
  return uint8ArrayToString(b);
}
