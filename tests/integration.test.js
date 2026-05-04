const axios = require('axios');

async function runTests() {
  console.log("--- Starting AI-Generated Integration Tests ---");
  let passed = 0;
  let total = 3;

  try {
    // Test 1: Full User Journey (Login -> Profile -> Move)
    console.log("Test 1: Validating standard player flow...");
    const login = await axios.post('http://localhost:3000/login', { 
        email: "test@game.com", 
        password: "password123" 
    });
    const profile = await axios.get('http://localhost:3000/profile/1');
    const move = await axios.post('http://localhost:3000/move', { x: 10, y: 10, z: 0 });
    
    if (login.status === 200 && profile.data.name === "Warrior_Slot" && move.data.status === "Grounded (No Gravity)") {
      console.log("✅ Standard Flow Passed");
      passed++;
    }

    // Test 2: Precise Collision Check (The "Pillar" Test)
    console.log("Test 2: Validating precise collision at (50, 50)...");
    try {
      await axios.post('http://localhost:3000/move', { x: 50, y: 50, z: 0 });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log("✅ Collision Properly Blocked");
        passed++;
      }
    }

    // Test 3: Boundary Failure (Out of Bounds)
    console.log("Test 3: Validating map boundaries...");
    try {
      await axios.post('http://localhost:3000/move', { x: 150, y: 0, z: 0 });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("✅ Out of Bounds Properly Handled");
        passed++;
      }
    }

  } catch (err) {
    console.error("❌ Test Suite Crashed:", err.message);
    process.exit(1);
  }

  console.log(`--- Results: ${passed}/${total} Passed ---`);
  if (passed !== total) process.exit(1);
  
  console.log("Tests complete. Cleaning up...");
  process.exit(0);
}

// --- FIX APPLIED HERE ---
// 1. Load the app logic
const app = require('../app.js'); 

// 2. Manually trigger the listener so axios has a live port to hit
const server = app.listen(3000, () => {
    console.log("Temporary Test Server active on port 3000");
});

// 3. Run the tests after a short delay to ensure port binding is complete
setTimeout(runTests, 1000);