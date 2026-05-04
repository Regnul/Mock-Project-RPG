\# RPG Mock Web Service and Testing Suite



A mock backend for a 2D RPG, featuring a 2000x2000 navigable world, automated testing pipelines, and Docker containerization.



\## Prerequisites

\* Docker Desktop (Recommended)

\* Node.js v20+ (If running locally)



\## Dependencies

The following libraries are required for the application and testing suite:

\* express: Web framework for the mock API.

\* axios: HTTP client for integration testing.

\* path: Node.js module for directory handling.

\* http: Node.js module used for unit testing.



\## Launching the Application



\### 1. Build the Docker Image

From the root directory, run the following command to build the image:



docker build -t rpg-game .



\### 2. Run the Interactive Game

Launch the server and map it to port 3000. Once running, visit http://localhost:3000 in your browser.



docker run -it --rm --name rpg-game -p 3000:3000 rpg-game



\## Running the Automated Test Suite

The project includes a dual-tier testing strategy (15 tests total) that validates Auth, Profiles, and Movement logic.



Run the entire suite inside the containerized environment:



docker run --rm rpg-game npm test



Note: This command executes both tests/unit.test.js and tests/integration.test.js sequentially.



\## Project Structure

\* /public: Contains the client-side game.js and assets.

\* /tests: Contains unit and integration test scripts.

\* app.js: The core Express API logic.

\* Dockerfile: Instructions for containerized deployment.

\* .github/workflows: CI/CD pipeline configuration.

