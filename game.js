const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 270,
    pixelArt: true,
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let bitcoin = 0;
let bitcoinText;
let farmSpeed = 1; // per second
let lastTick = 0;

const availableUpgrades = [
    {
        id: 'green_screen',
        name: 'Green Screen',
        farmSpeedIncrease: 2,
        cost: 200,
        tileSlot: 'room1',
        tilePosition: { x: 5, y: 5 }
    },
    {
        id: 'computer_potato',
        name: 'Potato Computer',
        farmSpeedIncrease: 1,
        cost: 100,
        tileSlot: 'room2',
        tilePosition: { x: 7, y: 7 }
    }
];

const playerOwnedUpgrades = ['computer_potato'];

function preload() {
    this.load.image('roomfloor', 'assets/roomfloor.png');
    this.load.image('guy', 'assets/tile_0455.png');
    this.load.image('computer', 'assets/tile_0455.png');
    this.load.image('car', 'assets/tile_0453.png');
    this.load.image('upgradeBtn', 'assets/tile_0480.png'); // placeholder for now

    // // Add error handling for image loading
    // this.load.on("filecomplete", (key, type, data) => {
    //   console.log(`Loaded: ${key}`);
    // });

    // this.load.on("fileerror", (file) => {
    //   console.error(`Failed to load: ${file.key}`);
    // });
}

function create() {
    //OBJECTS
    const tileSize = 16;
    for (let x = 0; x < 32; x++) {
        for (let y = 0; y < 32; y++) {
            this.add.image(x * tileSize, y * tileSize, 'roomfloor');
        }
    }

    for (var ownedUpgrade of playerOwnedUpgrades) {
        var upgrade = availableUpgrades.find((x) => x.id == ownedUpgrade);
        console.log('upgrade:');
        console.log(upgrade);

        this.add.image(upgrade.tilePosition.x * tileSize, upgrade.tilePosition.y * tileSize, 'car').setScale(2);
    }

    // UI
    bitcoinText = this.add.text(20, 20, '₿ 0', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#00ff00'
    });

    farmSpeedText = this.add.text(20, 50, 'Farming Speed: ' + farmSpeed, {
        // Use farmSpeed variable
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#00ff00'
    });

    const upgradeButton = this.add
        .text(20, 240, '💻 Upgrade (+1/sec)', {
            fontFamily: 'monospace',
            fontSize: '16px',
            backgroundColor: '#333',
            color: '#fff',
            padding: { x: 6, y: 4 }
        })
        .setInteractive()
        .on('pointerover', () => {
            upgradeButton.setStyle({ backgroundColor: '#555' }); // Change background on hover
        })
        .on('pointerout', () => {
            upgradeButton.setStyle({ backgroundColor: '#333' }); // Revert background on hover out
        })
        .on('pointerdown', () => {
            upgradeButton.setStyle({ backgroundColor: '#777' }); // Change background on click
            farmSpeed += 1;
        })
        .on('pointerup', () => {
            upgradeButton.setStyle({ backgroundColor: '#555' }); // Revert background after click
        });

    upgradeButton.on('pointerdown', () => {
        farmSpeed += 1;
    });
}

function update(time, delta) {
    if (time - lastTick > 1000) {
        bitcoin += farmSpeed;
        bitcoinText.setText('₿ ' + bitcoin);
        farmSpeedText.setText(farmSpeed + '/s');
        lastTick = time;
    }
}
