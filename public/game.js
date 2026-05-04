const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WORLD_SIZE = 1600;

let player = { x: 50, y: 50, size: 50, speed: 10 };

const barriers = [
    { x: 300, y: 300, size: 100 },
    { x: 1600, y: 300, size: 100 },
    { x: 300, y: 1600, size: 100 },
    { x: 1600, y: 1600, size: 100 }
];

function checkCollision(newX, newY) {
    for (let wall of barriers) {
        if (
            newX < wall.x + wall.size &&
            newX + player.size > wall.x &&
            newY < wall.y + wall.size &&
            newY + player.size > wall.y
        ) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.save(); // Save the "normal" state
    
    // Clear the whole screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // CAMERA LOGIC: Shift the drawing context so the player is in the middle
    let camX = -player.x + canvas.width / 2;
    let camY = -player.y + canvas.height / 2;
    
    // Clamp camera to world edges so you don't see the "void"
    camX = Math.min(0, Math.max(camX, -(WORLD_SIZE - canvas.width)));
    camY = Math.min(0, Math.max(camY, -(WORLD_SIZE - canvas.height)));
    
    ctx.translate(camX, camY);

    // --- DRAW EVERYTHING IN "WORLD SPACE" NOW ---
    // Background 2000x2000
    ctx.fillStyle = "#ddd";
    ctx.fillRect(0, 0, WORLD_SIZE, WORLD_SIZE);

    // Barriers
    ctx.fillStyle = "yellow";
    barriers.forEach(wall => ctx.fillRect(wall.x, wall.y, wall.size, wall.size));

    // Player
    ctx.fillStyle = "#007bff";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    ctx.restore(); // Go back to normal state for the next frame
}

window.addEventListener('keydown', (e) => {
    let nextX = player.x;
    let nextY = player.y;

    if (e.key === 'ArrowRight' || e.key === 'd') nextX += player.speed;
    if (e.key === 'ArrowLeft' || e.key === 'a')  nextX -= player.speed;
    if (e.key === 'ArrowUp' || e.key === 'w')    nextY -= player.speed;
    if (e.key === 'ArrowDown' || e.key === 's')  nextY += player.speed;

    // Check world boundaries (0 to WORLD_SIZE) AND barrier collisions
    if (nextX >= 0 && nextX <= WORLD_SIZE - player.size && 
        nextY >= 0 && nextY <= WORLD_SIZE - player.size) {
        
        if (!checkCollision(nextX, nextY)) {
            player.x = nextX;
            player.y = nextY;
            draw();
        }
    }
});

// Initial draw to show the world on load
draw();