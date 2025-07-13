import CryptoJS from "crypto-js";

const key = import.meta.env.VITE_CRYPTO_SECRET;

export const encrypt = (data: any) => {
  let stringifyData = data;
  if (typeof data !== "string" && !JSON.isJSON(data)) stringifyData = JSON.stringify(data);

  return CryptoJS.AES.encrypt(stringifyData, key).toString();
};

export const decrypt = (ciphertext?: string | null) => {
  if (!ciphertext) return "";
  return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
};
