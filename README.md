RPG Mock Web Service and Testing Suite

A mock backend for this 2D RPG, featuring a 2000x2000 navigable world, automated testing pipelines, and Docker containerization.
Prerequisites

    Docker Desktop (Recommended)

    Node.js v20+ (If running locally)

Dependencies

The following libraries are required for the application and testing suite:

    express: Web framework for the mock API.

    axios: HTTP client for integration testing.

    supertest: High-level abstraction for testing in-memory HTTP servers.

    path: Node.js module for directory handling.

Launching the Application
1. Build the Docker Image

From the root directory, run the following command to build the image:
Bash

docker build -t rpg-game .

2. Run the Interactive Game

Launch the server and map it to port 3000. Once running, visit http://localhost:3000 in your browser.
Bash

docker run -it --rm --name rpg-game -p 3000:3000 rpg-game

Running the Automated Test Suite

The project includes a dual-tier testing strategy that validates Auth, Profiles, and Movement logic.

Run the entire suite inside the containerized environment:
Bash

docker run --rm rpg-game npm test

Note: This command executes both the in-memory backend unit tests and integration tests sequentially.
Local Testing Run

If evaluating scripts locally without a container:

Execute the in-memory API unit tests:
Bash

node e2e/unit.test.js

Execute the Playwright end-to-end physics simulation suite:
Bash

npx playwright test

Project Structure

    /public: Contains the client-side game.js and assets.

    /e2e: Contains unit, integration, and physics test specs.

    app.js: The core Express API logic.

    package-lock.json: Strict package version locking for predictable builds.

    Dockerfile: Instructions for containerized deployment with optimized caching layers.

    .github/workflows: CI/CD automated pipeline configurations with workflow hardening gates.