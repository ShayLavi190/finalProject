// userController.test.js

// Mock Firebase db
jest.mock(
  "./firebase",
  () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        update: jest.fn(() => Promise.resolve()),
        set: jest.fn(() => Promise.resolve()),
      })),
    })),
  }),
  { virtual: true }
);

// Mock utils
jest.mock(
  "./utils",
  () => ({
    encryptData: jest.fn((data) => `encrypted-${JSON.stringify(data)}`),
  }),
  { virtual: true }
);

const {
  saveOrUpdateUser,
  savePermissions,
  resetPerformance,
} = require("./userController");
const db = require("./firebase");
const { encryptData } = require("./utils");

describe("User Controller", () => {
  let req, res, consoleSpy;

  beforeEach(() => {
    // Mock request and response
    req = { body: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    };

    // Mock console.error
    consoleSpy = jest.spyOn(console, "error").mockImplementation();

    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore console.error
    consoleSpy.mockRestore();
  });

  describe("saveOrUpdateUser", () => {
    const validUserData = {
      id: "123456789",
      name: "John Doe",
      address: "123 Main St",
      phone: "555-1234",
      emergencyPhone: "555-5678",
      bankAccountNumber: "123456789",
      bankBranchNumber: "001",
      selectedBank: "Test Bank",
      selectedhealthFund: "Test Fund",
      healthFundAccountNumber: "987654321",
    };

    test("should return 400 if ID is invalid", async () => {
      // Set invalid ID
      req.body = { ...validUserData, id: "12345" };

      // Call function
      await saveOrUpdateUser(req, res);

      // Check response
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid ID provided",
      });
    });

    test("should update existing user", async () => {
      // Set valid user data
      req.body = validUserData;

      // Mock document exists
      const mockGet = jest.fn(() => ({
        exists: true,
      }));
      const mockUpdate = jest.fn(() => Promise.resolve());

      // Set up db mock
      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGet,
          update: mockUpdate,
        })),
      });

      // Call function
      await saveOrUpdateUser(req, res);

      // Check encryption was called
      expect(encryptData).toHaveBeenCalledWith(
        validUserData,
        expect.any(String)
      );

      // Check Firestore operations
      expect(db.collection).toHaveBeenCalledWith("users");
      expect(mockGet).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalled();

      // Check response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User data updated successfully",
      });
    });

    test("should create new user", async () => {
      // Set valid user data
      req.body = validUserData;

      // Mock document doesn't exist
      const mockGet = jest.fn(() => ({
        exists: false,
      }));
      const mockSet = jest.fn(() => Promise.resolve());

      // Set up db mock
      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGet,
          set: mockSet,
        })),
      });

      // Call function
      await saveOrUpdateUser(req, res);

      // Check encryption was called
      expect(encryptData).toHaveBeenCalledWith(
        validUserData,
        expect.any(String)
      );

      // Check Firestore operations
      expect(db.collection).toHaveBeenCalledWith("users");
      expect(mockGet).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalled();

      // Check response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User data saved successfully",
      });
    });

    test("should handle errors", async () => {
      // Set valid user data
      req.body = validUserData;

      // Mock error
      const errorMessage = "Database error";
      db.collection.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Call function
      await saveOrUpdateUser(req, res);

      // Check error handling
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to save user data",
      });
    });
  });

  describe("savePermissions", () => {
    const validPermissionsData = {
      id: "123456789",
      permissions: ["read", "write"],
    };

    test("should return 400 if ID or permissions are missing", async () => {
      // Set invalid data (missing permissions)
      req.body = { id: "123456789" };

      // Call function
      await savePermissions(req, res);

      // Check response
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "ID and permissions are required",
      });
    });

    test("should update permissions for existing user", async () => {
      // Set valid permissions data
      req.body = validPermissionsData;

      // Mock document exists
      const mockGet = jest.fn(() => ({
        exists: true,
      }));
      const mockUpdate = jest.fn(() => Promise.resolve());

      // Set up db mock
      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGet,
          update: mockUpdate,
        })),
      });

      // Call function
      await savePermissions(req, res);

      // Check Firestore operations
      expect(db.collection).toHaveBeenCalledWith("users");
      expect(mockGet).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalled();

      // Check response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Permissions updated successfully",
      });
    });

    test("should return 404 if user does not exist", async () => {
      // Set valid permissions data
      req.body = validPermissionsData;

      // Mock document doesn't exist
      const mockGet = jest.fn(() => ({
        exists: false,
      }));

      // Set up db mock
      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGet,
        })),
      });

      // Call function
      await savePermissions(req, res);

      // Check response
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });

    test("should handle errors", async () => {
      // Set valid permissions data
      req.body = validPermissionsData;

      // Mock error
      const errorMessage = "Database error";
      db.collection.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Call function
      await savePermissions(req, res);

      // Check error handling
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to save permissions",
      });
    });
  });

  describe("resetPerformance", () => {
    const validPerformanceData = {
      userId: "123456789",
      tasks: [{ id: 1, name: "Task 1" }],
    };

    test("should return 400 if userId or tasks are missing", async () => {
      // Set invalid data (missing tasks)
      req.body = { userId: "123456789" };

      // Call function
      await resetPerformance(req, res);

      // Check response
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Missing userId or tasks.",
      });
    });

    test("should save performance data successfully", async () => {
      // Set valid performance data
      req.body = validPerformanceData;

      // Mock Firestore set
      const mockSet = jest.fn(() => Promise.resolve());

      // Set up db mock
      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          set: mockSet,
        })),
      });

      // Mock Date
      const originalDate = global.Date;
      const mockDate = new Date("2023-01-01T12:00:00Z");
      global.Date = jest.fn(() => mockDate);
      global.Date.toISOString = originalDate.toISOString;

      // Call function
      await resetPerformance(req, res);

      // Check Firestore operations
      expect(db.collection).toHaveBeenCalledWith("performance");
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          tasks: validPerformanceData.tasks,
          timestamp: expect.any(String),
        })
      );

      // Check response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Performance data saved successfully.",
      });

      // Restore Date
      global.Date = originalDate;
    });

    test("should handle errors", async () => {
      // Set valid performance data
      req.body = validPerformanceData;

      // Mock error
      const errorMessage = "Database error";
      db.collection.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Call function
      await resetPerformance(req, res);

      // Check error handling
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error.",
      });
    });
  });
});
