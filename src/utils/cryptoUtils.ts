import CryptoJS from "crypto-js";

const key = import.meta.env.VITE_CRYPTO_SECRET;

export const encrypt = (data: string) => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

export const decrypt = (ciphertext?: string | null) => {
  if (!ciphertext) return "";
  return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
};
