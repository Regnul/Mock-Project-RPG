const express = require('express');
const path = require('path');
const app = express();

// ==========================================
// ITEM 4: SPECIALIZED TESTING ACCOMMODATIONS
// ==========================================

// 1. Simulated Network Latency Middleware
app.use((req, res, next) => {
    const simulatedLatency = req.headers['x-simulate-latency'];
    if (simulatedLatency) {
        const delayMs = parseInt(simulatedLatency, 10) || 0;
        return setTimeout(next, delayMs);
    }
    next();
});

// 2. System Performance Metrics Endpoint
app.get('/debug/perf', (req, res) => {
    const memoryMetrics = process.memoryUsage();
    res.status(200).json({
        status: 'healthy',
        timestamp: Date.now(),
        uptime: process.uptime(),
        memory: {
            heapUsedMb: (memoryMetrics.heapUsed / 1024 / 1024).toFixed(2),
            heapTotalMb: (memoryMetrics.heapTotal / 1024 / 1024).toFixed(2),
            rssMb: (memoryMetrics.rss / 1024 / 1024).toFixed(2)
        }
    });
});

// ==========================================
// STANDARD MIDDLEWARE & STATIC ASSETS
// ==========================================
app.use(express.json());

// Serve static assets from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// IDENTITY (AUTH)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === "test@game.com" && password === "password123") {
        return res.status(200).json({ status: "success", message: "Login Successful", token: "mock-token" });
    } 
    res.status(401).json({ error: "Invalid credentials" });
});

// SESSION (PROFILES)
app.get('/profile/:id', (req, res) => {
    if (req.params.id === "1") {
        return res.json({ id: 1, name: "Warrior_Slot", x: 0, y: 0, z: 0, level: 10 });
    }
    res.status(404).json({ error: "Profile not found" });
});

// ACTIVE STATE (MOVEMENT & COLLISION)
app.post('/move', (req, res) => {
    const { x, y, z } = req.body;

    if (x > 100 || y > 100 || x < 0 || y < 0 || x === 150) {
        return res.status(400).json({ status: "error", message: "Out of bounds" });
    }

    if (x === 50 && y === 50) {
        return res.status(403).json({ status: "error", message: "Collision Blocked" });
    }

    res.json({ x, y, z: z || 0, status: "Grounded (No Gravity)" });
});

if (require.main === module) {
    app.listen(3000, () => console.log('Mock RPG API running on port 3000'));
}

module.exports = app;