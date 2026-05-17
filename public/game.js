// ==========================================
// 1. LOGIN SCENE (DOM Component Integration)
// ==========================================
class LoginScene extends Phaser.Scene {
    constructor() { super('LoginScene'); }
    
    create() {
        const cx = 600;
        const cy = 450;

        this.add.text(cx, cy - 180, 'MONSTER REALM LOGIN', { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);

        this.emailDOM = this.add.dom(cx, cy - 60, 'input', {
            type: 'text',
            placeholder: 'Email (test@game.com)',
            value: 'test@game.com',
            style: 'width: 300px; height: 35px; font-size: 18px; background-color: #222; color: #fff; border: 1px solid #555; padding-left: 10px;'
        });

        this.passwordDOM = this.add.dom(cx, cy, 'input', {
            type: 'password',
            placeholder: 'Password',
            value: 'password123',
            style: 'width: 300px; height: 35px; font-size: 18px; background-color: #222; color: #fff; border: 1px solid #555; padding-left: 10px;'
        });

        this.errorText = this.add.text(cx, cy + 60, '', { fontSize: '20px', fill: '#ff3333' }).setOrigin(0.5);

        let loginButton = this.add.text(cx, cy + 120, '[ Click Here to Login ]', { fontSize: '28px', fill: '#00ff00' })
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
            
        loginButton.on('pointerdown', () => this.handleLoginSubmit());

        let quitButton = this.add.text(cx, cy + 190, '[ Quit Game ]', { fontSize: '24px', fill: '#ff3333' })
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        quitButton.on('pointerdown', () => {
            this.game.destroy(true);
            document.body.innerHTML = '<div style="color: #ff3333; font-family: sans-serif; font-size: 32px; text-align: center; margin-top: 20%;">You have exited Monster Realm. Close the tab to close the application.</div>';
        });
    }

    async handleLoginSubmit() {
        const email = this.emailDOM.node.value;
        const password = this.passwordDOM.node.value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.status === 200) {
                this.registry.set('token', data.token);
                this.scene.start('ProfileScene');
            } else {
                this.errorText.setText(data.error || 'Authentication Failed');
            }
        } catch (err) {
            this.errorText.setText('Network server connection error');
        }
    }
}

// ==========================================
// 2. PROFILE SCENE (API Network Integration)
// ==========================================
class ProfileScene extends Phaser.Scene {
    constructor() { super('ProfileScene'); }
    
    async create() {
        const cx = 600;
        const cy = 450;

        this.add.text(cx, cy - 150, 'SELECT YOUR PROFILE', { fontSize: '36px', fill: '#fff' }).setOrigin(0.5);

        try {
            const response = await fetch('/profile/1');
            if (response.status === 200) {
                const profileData = await response.json();
                
                let t = this.add.text(cx, cy, `Slot 1: ${profileData.name} (Lvl ${profileData.level})`, { 
                    fontSize: '24px', fill: '#00ffff', backgroundColor: '#222222', padding: { x: 20, y: 10 }
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });
                
                t.on('pointerdown', () => this.scene.start('MyGame', { profile: profileData }));
            } else {
                this.add.text(cx, cy, '[ Profile Fetch Error ]', { fontSize: '20px', fill: '#ff3333' }).setOrigin(0.5);
            }
        } catch (e) {
            this.add.text(cx, cy, '[ Server Disconnected ]', { fontSize: '20px', fill: '#ff3333' }).setOrigin(0.5);
        }

        let backButton = this.add.text(cx, cy + 200, '[ Back to Main Menu ]', { fontSize: '24px', fill: '#ffcc00' })
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => this.scene.start('LoginScene'));
    }
}

// ==========================================
// 3. USER INTERFACE LAYER (Positioned Directly Under Map Frame)
// ==========================================
class UIScene extends Phaser.Scene {
    constructor() { super('UIScene'); }
    create() {
        const buttonY = 705;

        let saveQuitButton = this.add.text(430, buttonY, '[ Save & Quit to Profiles ]', { 
            fontSize: '18px', 
            fill: '#00ffff',
            backgroundColor: '#1a1a1a',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
        
        saveQuitButton.on('pointerdown', () => {
            this.input.stopPropagation();
            this.scene.stop('MyGame');
            this.scene.start('ProfileScene');
        });

        let exitMenuButton = this.add.text(770, buttonY, '[ Exit to Main Menu ]', { 
            fontSize: '18px', 
            fill: '#ff3333',
            backgroundColor: '#1a1a1a',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
        
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
    init(data) { 
        this.selectedProfile = data.profile || { name: 'Guest' }; 
        this.isAttacking = false; 
    }
    
    preload() {
        const tiles = ['Wall_Bottom_Left_Corner', 'Wall_Bottom_Straight', 'Wall_Bottom_Right_Corner', 'Wall_Left_Straight', 'Open_Floor_Center', 'Wall_Right_Straight'];
        tiles.forEach(name => this.load.image(name, `/${name}.png`));
        
        // Load Rock2 natively as an individual static asset
        this.load.image('Rock', '/Rock2.png');
        
        this.load.spritesheet('dude_walk', '/Dude_Monster_Walk_6.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('dude_run', '/Dude_Monster_Run_6.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('dude_attack', '/Dude_Monster_Attack2_6.png', { frameWidth: 32, frameHeight: 32 });
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

        const rockX = centerX - 150;
        const rockY = centerY - 150;

        // Render Rock2 with 4x scaling
        const obstacleRock = this.add.image(rockX, rockY, 'Rock').setScale(4);
        this.walls.add(obstacleRock);

        this.player = this.physics.add.sprite(centerX, centerY, 'dude_walk').setScale(2);
        this.player.body.setCircle(8, 8, 20);
        this.physics.add.collider(this.player, this.walls);

        this.anims.create({ key: 'walk', frames: this.anims.generateFrameNumbers('dude_walk', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('dude_run', { start: 0, end: 5 }), frameRate: 15, repeat: -1 });
        this.anims.create({ key: 'attack', frames: this.anims.generateFrameNumbers('dude_attack', { start: 0, end: 5 }), frameRate: 12, repeat: 0 });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.player.on('animationcomplete-attack', () => {
            this.isAttacking = false;
        });
        
        this.cameras.main.centerOn(centerX, centerY).setZoom(0.35);
    }

    update() {
        if (this.isAttacking) {
            this.player.setVelocity(0);
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
            this.isAttacking = true;
            this.player.play('attack', true);
            this.player.setVelocity(0);
            return;
        }

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
    width: 1200, 
    height: 900, 
    parent: 'game-container', 
    backgroundColor: '#111111',
    dom: { createContainer: true },
    scale: { mode: Phaser.Scale.NONE },
    physics: { 
        default: 'arcade', 
        arcade: { debug: false } 
    },
    render: { pixelArt: true, antialias: false, roundPixels: true },
    scene: [LoginScene, ProfileScene, MyGame, UIScene]
};

const game = new Phaser.Game(config);

// GLOBAL BINDING HOOK: Exposes this precise runtime game memory interface securely to Playwright commands
window.phaserGameInstance = game;