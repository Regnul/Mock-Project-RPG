const request = require('supertest');
const app = require('../app.js'); // Reaches up to your app.js layout

let failureCount = 0;
let completedTests = 0;
const TOTAL_TESTS = 12;

// Centralized teardown routine to communicate honestly with the OS / CI pipeline
const checkTeardown = () => {
    completedTests++;
    if (completedTests === TOTAL_TESTS) {
        console.log("\nAll In-Memory Unit Tests Complete.");
        if (failureCount > 0) {
            console.error(`❌ CI Pipeline Failure: ${failureCount} assertions failed.`);
            process.exit(1); // Force CI runner to turn RED
        } else {
            console.log("✅ All systems stable. Passing build.");
            process.exit(0); // Safe to turn CI GREEN
        }
    }
};

const runTest = (name, method, path, data, expectedStatus) => {
    // Start an in-memory virtual request against the express application instance
    let req = request(app)[method.toLowerCase()](path);

    if (data) {
        req = req.send(data);
    }

    req.end((err, res) => {
        let passed = false;
        if (!err && res.statusCode === expectedStatus) {
            passed = true;
        } else {
            failureCount++; // Track structural errors dynamically
        }

        const statusDisplay = res ? res.statusCode : 'ERR';
        console.log(`${passed ? '✅' : '❌'} ${name} (Status: ${statusDisplay})`);
        checkTeardown();
    });
};

// --- EXECUTE RPG MOCK SUITE (12 TESTS) ---
console.log("--- Executing RPG Mock Suite via Supertest ---");

// IDENTITY
runTest('AUTH-01: Valid Login', 'POST', '/login', { email: "test@game.com", password: "password123" }, 200);
runTest('AUTH-02: Missing Identity', 'POST', '/login', { email: "nobody@game.com", password: "123" }, 401);
runTest('AUTH-03: Empty Email', 'POST', '/login', { email: "", password: "123" }, 401);

// PROFILE
runTest('PROF-01: Get Warrior Profile', 'GET', '/profile/1', null, 200);
runTest('PROF-02: Index Out of Bounds', 'GET', '/profile/99', null, 404);
runTest('PROF-03: Invalid ID Type', 'GET', '/profile/abc', null, 404);

// MOVEMENT & PHYSICS
runTest('MOVE-01: Max Boundary Violation', 'POST', '/move', { x: 150, y: 0, z: 0 }, 400);
runTest('MOVE-02: Gravity Airborne Check', 'POST', '/move', { x: 10, y: 10, z: 5 }, 200);
runTest('MOVE-05: Origin Coordinate Check', 'POST', '/move', { x: 0, y: 0, z: 0 }, 200);
runTest('MOVE-06: Grounded State Check', 'POST', '/move', { x: 10, y: 10, z: 0 }, 200);

// COLLISION TESTING
runTest('COLL-01: Direct Object Collision (Impact)', 'POST', '/move', { x: 50, y: 50, z: 0 }, 403);
runTest('COLL-02: Adjacent Clear Path (Proximity)', 'POST', '/move', { x: 49, y: 50, z: 0 }, 200);