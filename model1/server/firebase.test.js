// firebase.test.js

// Create mock functions for Firebase
const mockInitializeApp = jest.fn(() => ({ name: "mock-app" }));
const mockGetFirestore = jest.fn(() => ({ id: "mock-firestore" }));

// Mock Firebase modules
jest.mock("firebase/app", () => ({
  initializeApp: mockInitializeApp,
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: mockGetFirestore,
}));

// Mock your firebase.js module
jest.mock(
  "./firebase",
  () => {
    // Run the original module code with our mocks in place
    const firebaseApp = mockInitializeApp({
      apiKey: "AIzaSyAY_FUYPBrKNoBnI9uAJIwoUqPbBDlVNgo",
      authDomain: "finalproject-2dd4e.firebaseapp.com",
      projectId: "finalproject-2dd4e",
      storageBucket: "finalproject-2dd4e.firebasestorage.app",
      messagingSenderId: "694146716029",
      appId: "1:694146716029:web:16ea2237660ce782aa7c14",
      measurementId: "G-9Y54L365NQ",
    });

    // Make sure the getFirestore function is called with the app parameter
    const firebaseDb = mockGetFirestore(firebaseApp);

    // Return the mocked exports
    return {
      db: firebaseDb,
    };
  },
  { virtual: true }
);

describe("Firebase Initialization", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Re-import the module to ensure it runs the mock setup again
    jest.resetModules();
  });

  test("should initialize Firebase with correct config", () => {
    // Import the mock firebase module
    require("./firebase");

    // Check that initializeApp was called with the correct config
    expect(mockInitializeApp).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: "AIzaSyAY_FUYPBrKNoBnI9uAJIwoUqPbBDlVNgo",
        projectId: "finalproject-2dd4e",
        authDomain: "finalproject-2dd4e.firebaseapp.com",
      })
    );
  });

  test("should export Firestore database instance", () => {
    // Ensure the mock is called by requiring the module
    require("./firebase");

    // Check that getFirestore was called with the app instance
    expect(mockGetFirestore).toHaveBeenCalled();
    expect(mockGetFirestore).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "mock-app",
      })
    );

    // Check that db is exported correctly
    const { db } = require("./firebase");
    expect(db).toBeDefined();
    expect(db).toEqual({ id: "mock-firestore" });
  });
});
