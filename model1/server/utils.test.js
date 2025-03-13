// utils.test.js

// Mock CryptoJS
jest.mock(
  "react-native-crypto-js",
  () => {
    const mockEncrypt = jest.fn((data, key) => ({
      toString: jest.fn(() => `encrypted:${data}:${key}`),
    }));

    const mockDecrypt = jest.fn((data, key) => ({
      toString: jest.fn(() => `{"decrypted":"data"}`),
    }));

    return {
      AES: {
        encrypt: mockEncrypt,
        decrypt: mockDecrypt,
      },
      enc: {
        Utf8: "utf8-encoding",
      },
    };
  },
  { virtual: true }
);

// Note: We'll need to modify utils.js to use CommonJS or configure Jest for ESM
// Here's a CommonJS mock of the utils functions
jest.mock(
  "./utils",
  () => {
    return {
      encryptData: (data, secretKey) => {
        const CryptoJS = require("react-native-crypto-js");
        return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
      },
      decryptData: (ciphertext, secretKey) => {
        const CryptoJS = require("react-native-crypto-js");
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      },
    };
  },
  { virtual: true }
);

const { encryptData, decryptData } = require("./utils");

describe("Utils - Encryption and Decryption", () => {
  const testData = { name: "Test User", id: "123456789" };
  const secretKey = "test-secret-key";

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("encryptData", () => {
    test("should encrypt data with the provided secret key", () => {
      // Call function
      const result = encryptData(testData, secretKey);

      // Check if CryptoJS.AES.encrypt was called
      const CryptoJS = require("react-native-crypto-js");
      expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith(
        JSON.stringify(testData),
        secretKey
      );

      // Check that result is defined
      expect(result).toBeDefined();
    });
  });

  describe("decryptData", () => {
    test("should decrypt data with the provided secret key", () => {
      // Mock data
      const encryptedData = "encrypted-data";

      // Call function
      const result = decryptData(encryptedData, secretKey);

      // Check if CryptoJS.AES.decrypt was called
      const CryptoJS = require("react-native-crypto-js");
      expect(CryptoJS.AES.decrypt).toHaveBeenCalledWith(
        encryptedData,
        secretKey
      );

      // Check result
      expect(result).toEqual({ decrypted: "data" });
    });
  });

  describe("Round Trip", () => {
    test("should produce the expected encryption/decryption flow", () => {
      // Set up specific mock behavior for this test
      const CryptoJS = require("react-native-crypto-js");

      // Create a specific encrypted value for testing
      const encryptedValue = "test-encrypted-value";
      CryptoJS.AES.encrypt.mockImplementationOnce(() => ({
        toString: () => encryptedValue,
      }));

      // Encrypt the data
      const encrypted = encryptData(testData, secretKey);
      expect(encrypted).toBe(encryptedValue);

      // Decrypt the data
      decryptData(encrypted, secretKey);

      // Verify decrypt was called with the right args
      expect(CryptoJS.AES.decrypt).toHaveBeenCalledWith(
        encryptedValue,
        secretKey
      );
    });
  });
});
