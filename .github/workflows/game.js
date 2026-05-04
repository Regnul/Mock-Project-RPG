const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
const player = {
    x: 200,
    y: 200,
    size: 20,
    speed: 5,
    color: '#007bff'
};

const keys = {};

// Track key states (allows for diagonal movement)
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function update() {
    // Movement Logic
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;

    // Simple Field Boundaries (400x400 canvas)
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
    if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;
}

function draw() {
    // Clear the field
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop); // Smooth 60fps execution
}

loop(); // Start the game