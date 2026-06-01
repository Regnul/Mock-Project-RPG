# RPG Mock Service: Manual Testing Strategy & Automation Limitations

This document establishes the technical boundaries of the automated specialized testing suite and details the manual verification protocols required to address vulnerabilities that cannot be simulated via server-side code execution.

The additional purpose of this document is to explain why stress testing was introduced to the application while the other sections of the production issues and test configuration documents were not addressed (mainly browser compatibility testing and input testing with respect to a database)

These rely on additional real-implementation features which would suprass the node.js and express framework handing things so far. I mentioned them as per the assignment's boundaries but for a mock project they seem outside the scope. 

---

## 1. Architectural Limitations of Automated Specialized Suite

While the `tests/stress.test.js` script successfully asserts that the Express backend handles 50 high-frequency concurrent requests under simulated network latency, it operates entirely over stateless network streams. 
A strict architectural review reveals why the other major production vulnerabilities must be verified manually:

### 1.1 Database I/O Write Bottlenecks (Why Automation Fails Here)
* **The Constraint:** The current product iteration functions entirely as a Mock API layer. Player coordinate verification and profile tracking vectors are processed strictly in-memory or validated via static logic inside `app.js`. 
* **The Limitation:** Because there is no active physical database engine (such as PostgreSQL or MongoDB) attached to the application yet, there are no physical transactional disk locks or connection pools to stress. Automating a database I/O bottleneck test is impossible until a persistent storage database layer is integrated into the codebase.

### 1.2 WebGL Context Loss & GPU Texture Leaks (Why Automation Fails Here)
* **The Constraint:** WebGL allocations and canvas texture updates happen exclusively within the client browser’s graphical rendering memory space on the user's local GPU. 
* **The Limitation:** Our automated testing suite runs inside an isolated, headless Node.js environment on the command line. Because there is no graphical display server or physical GPU thread attached to a headless script, automated code cannot inspect client-side texture leaks. Tracking a WebGL context loss requires manual observation via specialized web profiling timelines.

### 1.3 Multi-Browser Engine Parity (Why Automation Fails Here)
* **The Constraint:** Simulating rendering across distinct layout engines (WebKit for Safari vs. Gecko for Firefox) requires introducing a heavy browser-orchestration framework (such as automated Playwright or Selenium driver packages).
* **The Limitation:** This specialized test was intentionally designed to be a lightweight, zero-dependency performance script to keep your application runtime fast and maintain a small container footprint. Forcing browser engine downloads would bloat the Docker container size and stall the rapid execution loop of the automated CI/CD pipeline.

---

## 2. Mandatory Manual Specialized Testing Protocols

To bridge the gaps left by our automated testing constraints, a human operator must manually execute the following performance and rendering verification checklists prior to production release:

### Protocol 1: Frame-Rate Stability Under Asynchronous API Thrashing
* **The Target Framework:** Captures client-side rendering degradation caused by server-side network latency processing.
* **Manual Verification Checklist:**
  1. Boot the Phaser canvas application locally in your web browser.
  2. While the automated `stress.test.js` script is running in the background to flood the backend, hold down a movement key to continuously update the player sprite coordinate state.
  3. Visually inspect the rendering loop. The game must maintain a stable frame rate without frame drops, visual object skipping, or asset hitching while the backend handles the concurrent background traffic load.

### Protocol 2: WebGL Scene Disconnection Memory Reclamation
* **The Target Framework:** Validates that Phaser does not lock texture graphics in local memory after a player session ends.
* **Manual Verification Checklist:**
  1. Open the browser's Developer Tools and navigate to the **Performance/Memory** tab.
  2. Log into the game client, move the character across the screen to initialize asset textures, and then abruptly close the game tab or trigger a mock logout.
  3. Force garbage collection using the DevTools panel and verify that the local system's active heap size returns to baseline parameters, proving that no dangling canvas instances or texture caches are leaking in the browser memory space.

### Protocol 3: Cross-Engine Sizing and Input Fluidity
* **The Target Framework:** Ensures alternative input hardware scales predictably across unaligned browser rendering layers.
* **Manual Verification Checklist:**
  1. Open the game client sequentially across Google Chrome (Chromium), Mozilla Firefox (Gecko), and Apple Safari (WebKit).
  2. On each browser, use a specialized multi-button device or handheld peripheral mapped to direction keys to move the player along map boundaries.
  3. Confirm that resizing the browser window dynamically scales the canvas element uniformly across all three engines, and verify that rapid hardware clicks execute input movements reliably without triggering native browser context menus or misaligning the underlying server collision grid.