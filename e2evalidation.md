
# RPG Mock Testing Suite: Automated Test Validation Report

This report documents the process and implemented debugging, and validation of the automated test suite for the 2D RPG web service. It evaluates system vulnerabilities related to test honesty, eliminates false-positive behaviors within the CI/CD pipeline, and establishes strict exit-signal compliance for GitHub Actions.

---

## 1. Executive Summary

A comprehensive audit of the legacy backend verification script (`unit.test.js`) revealed critical structural flaws that compromised pipeline integrity, these were raised by my partner in discussion. The primary vulnerability was an exit-code handling error that caused the automated test runner to report a successful "green" build to the CI/CD environment even when multiple asynchronous assertions failed. 

the testing architecture was refactored to account for how a time limit reached would trigger a good exit code despite test failure. The suite was migrated from standard network socket hooks to an in-memory execution loop via `supertest`, and deterministic lifecycle tracking hooks were introduced.

I also added playwright to perform the automated e2e tests as a version of a golden path as one which tests all implemented features and expectations in the real game and not just in theory.

---
Pipeline correction flag to utilize failed test results (no bad data is given in my current build to force test failures)

if (failureCount > 0) {
    console.error(`❌ CI Pipeline Failure: ${failureCount} assertions failed.`);
    process.exit(1); // Forces GitHub Actions runner to turn RED
} else {
    console.log("✅ All systems stable. Passing build.");
    process.exit(0); // Safely turns GitHub Actions runner GREEN
}
---

Playwright E2E Browser & Physics Validation

To secure the frontend user interface and Phaser canvas interactions, the end-to-end testing pipeline (e2e/game.spec.js) was validated for false negatives:

Timing Synchronization: Browser automation tests are highly susceptible to execution racing when checking real-time canvas elements. The suite was validated to ensure canvas loading delays do not trigger premature failures. I had to confront this very often to get the playwright to work.

Deterministic Input Sequences: Character movement loops (e.g., testing boundary collisions and rock obstacles) utilize precise, synchronized step intervals. This prevents overlapping input vectors from confusing the backend's POST /move verification logic.

I also had to address collision as no change in coordinates even while movement was triggered as other methods to recognize what was clearly visible on screen were difficult to validate. Luckily validation of test results was made simple since playwright lets me watch using the settings for the headless browser.

---

Other worthwhile comments on the automated e2e testing were around moving all the integration and unit tests over to a real game rather than keeping them as proof of concept. There are a few things to still change such as enter being acceptable for login