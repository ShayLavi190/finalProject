import CryptoJS from "react-native-crypto-js";

const encryptData = (data, secretKey) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (ciphertext, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export { encryptData, decryptData };
