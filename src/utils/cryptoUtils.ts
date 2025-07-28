import CryptoJS from "crypto-js";
import { sanitizeDatesInObject } from "./callApi";

const key = import.meta.env.VITE_CRYPTO_SECRET;

export const encrypt = (data: any) => {
  let stringifyData = data;
  if (typeof data !== "string" && !JSON.isJSON(data)) stringifyData = JSON.stringify(data);

  return CryptoJS.AES.encrypt(stringifyData, key).toString();
};

export const decrypt = (ciphertext?: string | null, options?: { parse?: boolean }) => {
  if (!ciphertext) return "";
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
  if (options?.parse) {
    try {
      return sanitizeDatesInObject(JSON.parse(decrypted));
    } catch {
      return null;
    }
  }
  return decrypted;
};
