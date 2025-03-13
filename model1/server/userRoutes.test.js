// userRoutes.test.js

// Mock express
jest.mock(
  "express",
  () => {
    const mockRouter = {
      post: jest.fn(),
      get: jest.fn(),
    };
    return {
      Router: jest.fn(() => mockRouter),
    };
  },
  { virtual: true }
);

// Mock controller functions
jest.mock(
  "./userController.js",
  () => ({
    saveOrUpdateUser: "mocked-save-or-update-user",
    savePermissions: "mocked-save-permissions",
    resetPerformance: "mocked-reset-performance",
  }),
  { virtual: true }
);

describe("User Routes", () => {
  let express;
  let userController;
  let router;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Reset module registry
    jest.resetModules();

    // Get mocks
    express = require("express");
    userController = require("./userController.js");

    // Import router (this will execute the router setup code)
    router = require("./userRoutes");
  });

  test("should set up POST route for save-user", () => {
    // Get router mock
    const mockRouter = express.Router();

    // Check if post was called with the correct path and handler
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/save-user",
      userController.saveOrUpdateUser
    );
  });

  test("should set up POST route for save-permissions", () => {
    // Get router mock
    const mockRouter = express.Router();

    // Check if post was called with the correct path and handler
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/save-permissions",
      userController.savePermissions
    );
  });

  test("should set up POST route for reset", () => {
    // Get router mock
    const mockRouter = express.Router();

    // Check if post was called with the correct path and handler
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/reset",
      userController.resetPerformance
    );
  });

  test("should export the router", () => {
    // Check if router is exported
    expect(router).toBeDefined();
  });
});
