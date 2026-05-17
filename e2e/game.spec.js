const { test, expect } = require('@playwright/test');

test.describe('Monster Realm End-to-End Game Suite', () => {

  test('Should authenticate, select profile, and pass all physics verification loops', async ({ page }) => {
    // 1. Load the active root game context page
    await page.goto('/');
    await page.waitForTimeout(3000);

    // 2. Fill the embedded HTML input overlay forms
    const inputs = page.locator('input');
    await inputs.nth(0).fill('test@game.com');
    await inputs.nth(1).fill('password123');
    await page.waitForTimeout(500);

    // 3. Command the Login Scene to process pointer submissions via direct scene handler
    await page.evaluate(() => {
        const gameInstance = window.phaserGameInstance || Phaser.GAMES.games[0];
        const loginScene = gameInstance.scene.getScene('LoginScene');
        loginScene.handleLoginSubmit();
    });

    // 4. Wait for network resolution and profile interface generation layers
    await page.waitForTimeout(2500);

    // 5. Select character profile slot cleanly inside memory
    await page.evaluate(() => {
        const gameInstance = window.phaserGameInstance || Phaser.GAMES.games[0];
        const profileScene = gameInstance.scene.getScene('ProfileScene');
        const slot1Button = profileScene.children.list.find(child => child.text && child.text.includes('Slot 1:'));
        if (slot1Button) {
            slot1Button.emit('pointerdown');
        } else {
            throw new Error("Could not find dynamic profile text components in current memory snapshot.");
        }
    });

    // 6. Give room maps and physics zones a quick moment to finish spawning loops
    await page.waitForTimeout(1500);

    // Context execution monitor to capture active vector dynamics safely from the engine
    const getPlayerState = async () => {
        return await page.evaluate(() => {
            const gameInstance = window.phaserGameInstance || Phaser.GAMES.games[0];
            const activeScene = gameInstance.scene.getScene('MyGame');
            return {
                x: activeScene.player.x,
                y: activeScene.player.y,
                vx: activeScene.player.body.velocity.x,
                vy: activeScene.player.body.velocity.y,
                isAttacking: activeScene.isAttacking
            };
        });
    };

    // --- PHYSICS CHECK 1: WALKING SPEED MATRIX ---
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(200);
    let state = await getPlayerState();
    
    expect(state.vx).toBeCloseTo(225, 0);
    await page.keyboard.up('ArrowRight');
    await page.waitForTimeout(100);

    // --- PHYSICS CHECK 2: SPRINTING MECHANICS MULTIPLIER ---
    await page.keyboard.down('Space');
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(200);
    state = await getPlayerState();
    
    expect(state.vx).toBeCloseTo(400, 0);
    await page.keyboard.up('ArrowRight');
    await page.keyboard.up('Space');
    await page.waitForTimeout(100);

   // --- PHYSICS CHECK 3: COMBAT ANIMS ATTACK OVERRIDE LOCK ---
    // Start holding the direction key first
    await page.keyboard.down('ArrowLeft');
    await page.waitForTimeout(150); // Give it a clear window of active movement

    // Hold the attack key down deliberately across engine frames
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(60); // Guarantees the engine catches the attack state mid-walk
    
    let movingState = await getPlayerState();
    
    // Release the attack key and movement key safely
    await page.keyboard.up('KeyA');
    await page.keyboard.up('ArrowLeft');

    // Verify that the animation successfully dropped the velocity to 0
    expect(movingState.vx).toBe(0); 

    // Wait for full animation cooldown to pass completely before moving to the rock
    await page.waitForTimeout(600);
    state = await getPlayerState();
    expect(state.isAttacking).toBe(false);

    // --- PHYSICS CHECK 4: HEAD-ON HORIZONTAL OBSTACLE COLLISION ---
    // Step A: Move UP to align perfectly with the Rock's Y-axis level (300)
    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(720); 
    await page.keyboard.up('ArrowUp');
    await page.waitForTimeout(200); 

    // Step B: Walk straight LEFT directly into the rock face
    await page.keyboard.down('ArrowLeft');
    await page.waitForTimeout(1600); // Guarantees the player reaches and presses flush against the rock face at 498

    // CAPTURE FIRST POSITION (Firmly flush against the rock, key actively held down)
    const firstImpactState = await getPlayerState();
    
    // Continue holding the key down for another 400ms to actively push against the boundary
    await page.waitForTimeout(400); 
    
    // CAPTURE SECOND POSITION (Still trying to push through)
    const secondImpactState = await getPlayerState();

    // Clean up and release the key
    await page.keyboard.up('ArrowLeft');
    await page.waitForTimeout(100);

    // PROVE VERIFICATION: Intent velocity stays active, but physical position does not change a single decimal
    expect(secondImpactState.vx).toBe(-225); 
    expect(secondImpactState.x).toBe(firstImpactState.x); // Both read exactly 498, proving position is locked!
    
    // Verify the player was successfully blocked from passing through the rock
    expect(secondImpactState.x).toBeGreaterThan(450);
  });
});