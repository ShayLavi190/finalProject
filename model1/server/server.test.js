// server.test.js

// Mock all required modules beforehand
jest.mock(
  "express",
  () => {
    const mockApp = {
      use: jest.fn(),
      get: jest.fn(),
      listen: jest.fn((port, callback) => {
        if (callback) callback();
        return mockServer;
      }),
    };

    const mockServer = {
      close: jest.fn(),
    };

    const mockExpress = jest.fn(() => mockApp);
    mockExpress.json = jest.fn();
    mockExpress.Router = jest.fn(() => ({}));

    return mockExpress;
  },
  { virtual: true }
);

jest.mock(
  "body-parser",
  () => ({
    json: jest.fn(),
  }),
  { virtual: true }
);

jest.mock("./userRoutes", () => ({}), { virtual: true });

describe("Server", () => {
  let consoleSpy;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock console.log
    consoleSpy = jest.spyOn(console, "log").mockImplementation();

    // Reset module registry
    jest.resetModules();
  });

  afterEach(() => {
    // Restore console.log
    consoleSpy.mockRestore();
  });

  test("should use the correct port", () => {
    // Set PORT environment variable
    const originalEnv = process.env;
    process.env = { ...originalEnv, PORT: "3000" };

    // Require the server module
    require("./server");

    // Get mock
    const express = require("express");
    const mockApp = express();

    // Check if listen was called with the correct port (parseInt is used in your code)
    expect(mockApp.listen).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Function)
    );

    // Verify the port - account for string vs number by comparing string values
    expect(String(mockApp.listen.mock.calls[0][0])).toBe("3000");

    // Reset env
    process.env = originalEnv;
  });

  test("should use default port if PORT env is not set", () => {
    // Remove PORT from env
    const originalEnv = process.env;
    const { PORT, ...envWithoutPort } = process.env;
    process.env = envWithoutPort;

    // Require the server module
    require("./server");

    // Get mock
    const express = require("express");
    const mockApp = express();

    // Check if listen was called with the default port
    expect(mockApp.listen).toHaveBeenCalledWith(5020, expect.any(Function));

    // Reset env
    process.env = originalEnv;
  });

  test("should set up body-parser middleware", () => {
    // Require the server module
    require("./server");

    // Get mocks
    const express = require("express");
    const bodyParser = require("body-parser");
    const mockApp = express();

    // Check if body-parser.json was called
    expect(bodyParser.json).toHaveBeenCalled();

    // Check if app.use was called with the body-parser middleware
    expect(mockApp.use).toHaveBeenCalled();
  });

  test("should set up user routes", () => {
    // Require the server module
    require("./server");

    // Get mocks
    const express = require("express");
    const userRoutes = require("./userRoutes");
    const mockApp = express();

    // Check if app.use was called with the user routes
    expect(mockApp.use).toHaveBeenCalledWith("/api/users", userRoutes);
  });

  test("should set up health check endpoint", () => {
    // Require the server module
    require("./server");

    // Get mock
    const express = require("express");
    const mockApp = express();

    // Check if app.get was called for the root route
    expect(mockApp.get).toHaveBeenCalledWith("/", expect.any(Function));

    // Get the route handler
    const routeHandler = mockApp.get.mock.calls.find(
      (call) => call[0] === "/"
    )[1];

    // Create mock req and res
    const req = {};
    const res = { send: jest.fn() };

    // Call the route handler
    routeHandler(req, res);

    // Check if res.send was called with the correct message
    expect(res.send).toHaveBeenCalledWith("Server is running...");
  });

  test("should log when server starts", () => {
    // Remove PORT from env to use default port
    const originalEnv = process.env;
    const { PORT, ...envWithoutPort } = process.env;
    process.env = envWithoutPort;

    // Require the server module
    require("./server");

    // Check if console.log was called with the startup message
    expect(console.log).toHaveBeenCalledWith(
      "Server is running on http://localhost:5020"
    );

    // Reset env
    process.env = originalEnv;
  });
});
