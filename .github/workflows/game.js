// ==========================================
// 1. LOGIN SCENE
// ==========================================
class LoginScene extends Phaser.Scene {
    constructor() { super('LoginScene'); }
    create() {
        this.add.text(600, 250, 'MONSTER REALM LOGIN', { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);

        let loginButton = this.add.text(600, 420, '[ Click Here to Login ]', { fontSize: '28px', fill: '#00ff00' })
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        loginButton.on('pointerdown', () => this.scene.start('ProfileScene'));

        let quitButton = this.add.text(600, 520, '[ Quit Game ]', { fontSize: '24px', fill: '#ff3333' })
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        quitButton.on('pointerdown', () => {
            this.game.destroy(true);
            document.body.innerHTML = '<div style="color: #ff3333; font-family: sans-serif; font-size: 32px; text-align: center; margin-top: 20%;">You have exited Monster Realm. Close the tab to close the application.</div>';
        });
    }
}

// ==========================================
// 2. PROFILE SCENE
// ==========================================
class ProfileScene extends Phaser.Scene {
    constructor() { super('ProfileScene'); }
    create() {
        this.add.text(600, 150, 'SELECT YOUR PROFILE', { fontSize: '36px', fill: '#fff' }).setOrigin(0.5);

        const slots = [
            { id: 1, name: 'Save Slot A', level: 'Lvl 5 Dungeon' },
            { id: 2, name: 'Save Slot B', level: 'Lvl 1 Clear' }
        ];

        slots.forEach((slot, i) => {
            let t = this.add.text(600, 300 + (i * 120), `${slot.name} - (${slot.level})`, { 
                fontSize: '24px', fill: '#00ffff', backgroundColor: '#222222', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            t.on('pointerdown', () => this.scene.start('MyGame', { profile: slot }));
        });

        let backButton = this.add.text(600, 650, '[ Back to Main Menu ]', { fontSize: '24px', fill: '#ffcc00' })
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => this.scene.start('LoginScene'));
    }
}

// ==========================================
// 3. USER INTERFACE LAYER
// ==========================================
class UIScene extends Phaser.Scene {
    constructor() { super('UIScene'); }
    create() {
        // 1. Save & Quit to Profiles Button
        let saveQuitButton = this.add.text(20, 20, '[ Save & Quit to Profiles ]', { 
            fontSize: '18px', 
            fill: '#00ffff',
            backgroundColor: '#1a1a1a',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });
        
        saveQuitButton.on('pointerdown', () => {
            this.input.stopPropagation();
            this.scene.stop('MyGame');
            this.scene.start('ProfileScene');
        });

        // 2. Exit to Main Menu Button
        let exitMenuButton = this.add.text(280, 20, '[ Exit to Main Menu ]', { 
            fontSize: '18px', 
            fill: '#ff3333',
            backgroundColor: '#1a1a1a',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });
        
        exitMenuButton.on('pointerdown', () => {
            this.input.stopPropagation();
            this.scene.stop('MyGame');
            this.scene.start('LoginScene');
        });
    }
}

// ==========================================
// 4. MAIN GAMEPLAY SCENE
// ==========================================
class MyGame extends Phaser.Scene {
    constructor() { super('MyGame'); }
    init(data) { this.selectedProfile = data.profile || { name: 'Guest' }; }
    
    preload() {
        const tiles = ['Wall_Bottom_Left_Corner', 'Wall_Bottom_Straight', 'Wall_Bottom_Right_Corner', 'Wall_Left_Straight', 'Open_Floor_Center', 'Wall_Right_Straight'];
        tiles.forEach(name => this.load.image(name, `/${name}.png`));
        this.load.spritesheet('dude_walk', '/Dude_Monster_Walk_6.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('dude_run', '/Dude_Monster_Run_6.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.scene.launch('UIScene');
        this.scene.bringToTop('UIScene');

        const grid = 256, worldSize = 2, centerX = 600, centerY = 450;
        this.walls = this.physics.add.staticGroup();

        for (let x = -worldSize; x <= worldSize; x++) {
            for (let y = -worldSize; y <= worldSize; y++) {
                const posX = centerX + (x * grid), posY = centerY + (y * grid);
                this.add.image(posX, posY, 'Open_Floor_Center');

                if (y === -worldSize) {
                    const w = this.add.image(posX, posY, 'Wall_Bottom_Straight').setFlipY(true);
                    if (x === -worldSize) w.setTexture('Wall_Bottom_Left_Corner');
                    if (x === worldSize) w.setTexture('Wall_Bottom_Right_Corner');
                } else if (y === worldSize) {
                    const w = this.add.image(posX, posY, 'Wall_Bottom_Straight');
                    if (x === -worldSize) w.setTexture('Wall_Bottom_Left_Corner');
                    if (x === worldSize) w.setTexture('Wall_Bottom_Right_Corner');
                } else if (x === -worldSize) {
                    this.add.image(posX, posY, 'Wall_Left_Straight');
                } else if (x === worldSize) {
                    this.add.image(posX, posY, 'Wall_Right_Straight');
                }

                if (y === -worldSize) this.walls.add(this.add.zone(posX, posY - 65, 256, 40));
                if (y === worldSize) this.walls.add(this.add.zone(posX, posY + 65, 256, 40));
                if (x === -worldSize) this.walls.add(this.add.zone(posX - 65, posY, 40, 256));
                if (x === worldSize) this.walls.add(this.add.zone(posX + 65, posY, 40, 256));
            }
        }

        this.player = this.physics.add.sprite(centerX, centerY, 'dude_walk').setScale(2);
        this.player.body.setCircle(8, 8, 20);
        this.physics.add.collider(this.player, this.walls);

        this.anims.create({ key: 'walk', frames: this.anims.generateFrameNumbers('dude_walk', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('dude_run', { start: 0, end: 5 }), frameRate: 15, repeat: -1 });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Center camera initially
        this.cameras.main.centerOn(centerX, centerY);
        
        // Calculate initial zoom based on actual window configuration
        this.updateCameraZoom();

        // Listen for browser scaling/resize events and recalculate camera zoom factors dynamically
        this.scale.on('resize', () => {
            this.updateCameraZoom();
        });
    }

    updateCameraZoom() {
        // Base width calculation to determine browser window context scaling factor
        const baseWidth = 1200;
        const currentWidth = this.scale.width;
        
        // Calculate factor. Scales base zoom (0.35) dynamically with the size of the screen real-estate.
        let dynamicZoom = (currentWidth / baseWidth) * 0.35;
        
        // Clamp bounds so it doesn't get unplayably small or massively distorted
        dynamicZoom = Phaser.Math.Clamp(dynamicZoom, 0.25, 1.5);
        
        this.cameras.main.setZoom(dynamicZoom);
    }

    update() {
        let speed = this.spacebar.isDown ? 400 : 225;
        let anim = this.spacebar.isDown ? 'run' : 'walk';
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) { this.player.setVelocityX(-speed); this.player.setFlipX(true); }
        else if (this.cursors.right.isDown) { this.player.setVelocityX(speed); this.player.setFlipX(false); }
        if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.player.setVelocityY(speed);

        if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
            this.player.body.velocity.normalize().scale(speed);
            this.player.play(anim, true);
        } else {
            this.player.stop();
            this.player.setFrame(0);
        }
    }
}

// ==========================================
// 5. ARCHITECTURE CONFIGURATION
// ==========================================
const config = {
    type: Phaser.AUTO, 
    parent: 'game-container', 
    backgroundColor: '#111111',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: { 
        default: 'arcade', 
        arcade: { debug: false } 
    },
    render: { pixelArt: true, antialias: false, roundPixels: true },
    scene: [LoginScene, ProfileScene, MyGame, UIScene]
};

new Phaser.Game(config);