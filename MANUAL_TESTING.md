# Manual Testing Documentation

## 1. Overview
This document outlines the manual validation steps performed to ensure the visual and interactive elements of the  Web Service function correctly.

I have this hard coded but the real tests would pass if they applied to the interactive version of the game which is also included now

## 2. Manual Test Cases & Results

### MT-01: Canvas Rendering & Field Size
- **Objective:** Verify the 2000x2000 world renders without visual artifacts.
- **Steps:** Navigate to `localhost:3000`. Observe the floor texture/color.
- **Result:** Successfully renders a `#ddd` gray field. No "white void" visible within the 1600x1000 browser window or inappropriate field boundaries.

### MT-02: Camera Behavior Test
- **Objective:** Ensure the camera stops at the edge of the `WORLD_SIZE`.
- **Steps:** Move the player to the far right (X=2000) and bottom (Y=2000).
- **Result:** Camera stops scrolling at the boundary, preventing the player from seeing past the game world.

### MT-03: Keyboard Input Responsiveness
- **Objective:** Verify 'WASD' and 'Arrow' keys move the player smoothly.
- **Steps:** Rapidly switch between W and S keys and A and D.
- **Result:** Player movement is fluid; diagonal movement is not handled.

### MT-04: Barrier Visualization
- **Objective:** Ensure "Pillars" (yellow rectangles) are visible and match collision logic.
- **Steps:** Walk toward the yellow squares. Only one is typically visible at the start.
- **Result:** Visual barriers are clear. Player stops moving when making contact with the barrier's edge.

## 3. Environment
- **OS:** Windows 11 / Docker Desktop
- **Browsers Tested:** Chrome, Firefox Developer Edition
- **Resolution:** 1600x1000 (Canvas)