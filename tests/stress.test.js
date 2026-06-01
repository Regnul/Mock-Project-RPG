const http = require('http');

const CONCURRENT_PLAYERS = 50;
const TARGET_HOST = 'localhost';
const TARGET_PORT = 3000;

console.log(`🚀 Starting Specialized Automated Load & Performance Test...`);

function simulatePlayerAction(playerId) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ x: 10, y: 15, z: 0 });

        const options = {
            hostname: TARGET_HOST,
            port: TARGET_PORT,
            path: '/move',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'X-Player-Id': `player_${playerId}`,
                // We pass the new latency header to force the server to handle delayed I/O queues safely
                'X-Simulate-Latency': '50' 
            }
        };

        const startTime = Date.now();

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                const duration = Date.now() - startTime;
                resolve({ success: res.statusCode === 200, duration });
            });
        });

        req.on('error', (err) => reject(err));
        req.write(postData);
        req.end();
    });
}

// New Task: Pull the server metrics to assert memory compliance
function verifyServerMemory() {
    return new Promise((resolve, reject) => {
        http.get(`http://${TARGET_HOST}:${TARGET_PORT}/debug/perf`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on('error', (err) => reject(err));
    });
}

async function runLoadTest() {
    const promises = [];
    for (let i = 1; i <= CONCURRENT_PLAYERS; i++) {
        promises.push(simulatePlayerAction(i));
    }

    try {
        const results = await Promise.all(promises);
        
        let successfulRequests = 0;
        let totalDuration = 0;

        results.forEach(res => {
            if (res.success) {
                successfulRequests++;
                totalDuration += res.duration;
            }
        });

        const averageResponseTime = successfulRequests > 0 ? (totalDuration / successfulRequests).toFixed(2) : 0;

        // Fetch performance metrics from Item 4 endpoint
        const perfSnapshot = await verifyServerMemory();

        console.log('\n========= LOAD & MEMORY TEST RESULTS =========');
        console.log(`Simulated Parallel Sessions : ${CONCURRENT_PLAYERS}`);
        console.log(`Successful API Responses    : ${successfulRequests}/${CONCURRENT_PLAYERS}`);
        console.log(`Average Response Latency    : ${averageResponseTime}ms (Includes 50ms forced delay)`);
        console.log(`Post-Stress Server Heap Used: ${perfSnapshot.memory.heapUsedMb} MB / ${perfSnapshot.memory.heapTotalMb} MB`);
        console.log('==============================================\n');

        // Specialized Hard Assertions
        if (successfulRequests !== CONCURRENT_PLAYERS) {
            console.error('❌ TEST FAILED: Server dropped requests under concurrent traffic.');
            process.exit(1);
        }

        // Memory Leak Guard: Fail if the baseline node memory leaks past 100MB on a clean load
        if (parseFloat(perfSnapshot.memory.heapUsedMb) > 100.00) {
            console.error('❌ TEST FAILED: Memory leakage detected. Heap size exceeded safety threshold.');
            process.exit(1);
        }

        console.log('✅ TEST PASSED: Server successfully verified under load and memory bounds.');
        process.exit(0);

    } catch (error) {
        console.error(`❌ Critical Test Failure: ${error}`);
        process.exit(1);
    }
}

setTimeout(runLoadTest, 1000);