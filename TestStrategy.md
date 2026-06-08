### TEST STRATEGY: RPG MOCK API



#### 1\. INTRODUCTION



The goal of this strategy is to implement "just enough" of a framework to describe how a web-based process can be tested when that process is a video game.



The tests focus on the basic minimum needs: identifying a user, accessing a session via a profile, and performing movement in an active state.



This is accomplished using hard-coded responses and validations.

&#x09;

&#x09;-- All pass/fail conditions are mocked via hard-coded if/else statements and standard server responses (e.g., 200 Success, 400/401/403/404 Failure).



#### 2\. TESTING SCOPE



Authentication: Validating email/password submission and successful identity confirmation.



Profile Management: Validating the 1-to-many relationship where one account holds multiple independent game session files (as profiles are dummy accounts this is not explored at this time).



Movement Mechanics: Testing (x,y,z) coordinate updates, collision detection (true/false), and gravity/velocity logic.



Environment Logic: Validating world boundaries (e.g., x=150) and vertical physics where gravity is applied if a character is airborne.



Data Integrity: Ensuring profiles associated with a shared user remain independent and do not experience interactions.





#### 3\. TEST METHODOLOGY \& LEVELS



Unit Testing: AI-generated scripts will validate individual functions for coordinate math and boundary clamping.



API Testing: Routing signatures (URLs) will be tested to ensure they return the expected hard-coded JSON strings.



Integration Testing: An automated client runner (test.js) validates the communication between the test suite and the active container.



Mock Persistence: Databases are excluded; a temporary JSON object will hold state information to simulate database access.



#### 4\. TEST ENVIRONMENT \& TOOLS



Docker: The Mock Web UI and API are contained within a Docker environment (node:18-slim) to ensure consistent behavior across all testing sessions on Port 3000.



Automation: Unit tests are AI-generated as most basic implementations required to validate account user actions, character movement, and save-state logic (at this point that is persistent).



Manual Validation: A manual review of AI output will be conducted to address missing elements like static mesh overlaps and object boundaries.





#### 5\. DATA MANAGEMENT



Stateless Testing: No persistence, each test begins with a fresh JSON state.



Boundary Simulation: Map limits are defined as a set range of coordinates; the API will return a specific response if the character attempts to exceed these limits.



Collision Testing: Specific coordinates (e.g., 50, 50) are designated for static object interaction to trigger 403 Forbidden responses, alongside proximity checks to ensure boundary precision.





#### 6\. CRITERIA FOR SUCCESS



Functional Coverage: Pass/Fail responses must satisfy all unit test requirements for login, profile selection and 3D movement.



Environmental Stability: The Docker container must build and run the Mock API without errors.



Logic Integrity: Redirects and error messages (e.g., "Invalid Credentials" or "Collision Detected") must trigger correctly based on hard-coded inputs.

