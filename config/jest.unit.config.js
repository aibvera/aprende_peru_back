export default {
    rootDir: "../",
    testEnvironment: "node",
    verbose: true,
    transform: {}, // no usar babel, jest ya maneja ESM si activas experimental-vm-modules
    testMatch: ["<rootDir>/tests/unit/**/*.test.js"],
};
