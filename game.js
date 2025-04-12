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

let totalPoints = 0;
let totalPointsText;
let farmSpeed = 1; // per second
let lastTick = 0;
let isShopOpen = false; // Flag to track shop state
let walletAddress = '';

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
        cost: 2,
        tileSlot: 'room2',
        tilePosition: { x: 10, y: 10 }
    },
    {
        id: 'car',
        name: 'Red Car',
        farmSpeedIncrease: 1,
        cost: 100,
        tileSlot: 'room3',
        tilePosition: { x: 7, y: 7 }
    }
];

var playerOwnedUpgrades = ['car'];

function preload() {
    this.load.image('roomfloor', 'assets/roomfloor.png');
    this.load.image('guy', 'assets/tile_0455.png');
    this.load.image('computer_potato', 'assets/computer.png');
    this.load.image('car', 'assets/car.png');
    this.load.image('upgradeBtn', 'assets/tile_0480.png'); // placeholder for now

    // // Add error handling for image loading
    // this.load.on("filecomplete", (key, type, data) => {
    //   console.log(`Loaded: ${key}`);
    // });

    // this.load.on("fileerror", (file) => {
    //   console.error(`Failed to load: ${file.key}`);
    // });
}

async function connectWallet() {
    // Check for Phantom Wallet
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect(); // Connect to Phantom Wallet
            walletAddress = response.publicKey.toString(); // Get the wallet address
            console.log(`Connected wallet: ${walletAddress}`);
        } catch (error) {
            console.error('User denied account access or error occurred:', error);
        }
    } else {
        console.log('Please install Phantom Wallet!');
    }
}
connectWallet();

function create() {
    render.call(this);
}

function render() {
    renderUpgrades.call(this);
    renderUI.call(this);
}
function renderUpgrades() {
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

        this.add.image(upgrade.tilePosition.x * tileSize, upgrade.tilePosition.y * tileSize, upgrade.id).setScale(2);
    }
}

function renderUI() {
    // UI
    totalPointsText = this.add.text(20, 20, '$CLOUT 0', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#00ff00'
    });

    farmSpeedText = this.add.text(20, 50, 'Farming Speed: ' + farmSpeed, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#00ff00'
    });

    // Shop Button
    const shopButton = this.add
        .text(20, 240, '🛒 Shop', {
            fontFamily: 'monospace',
            fontSize: '16px',
            backgroundColor: '#333',
            color: '#fff',
            padding: { x: 6, y: 4 }
        })
        .setInteractive()
        .on('pointerover', () => {
            shopButton.setStyle({ backgroundColor: '#555' }); // Change background on hover
        })
        .on('pointerout', () => {
            shopButton.setStyle({ backgroundColor: '#333' }); // Revert background on hover out
        })
        .on('pointerdown', () => {
            shopButton.setStyle({ backgroundColor: '#777' }); // Change background on click
            if (isShopOpen) {
                closeShop.call(this); // Call function to close shop
            } else {
                openShop.call(this); // Call function to open shop with correct context
            }
            isShopOpen = !isShopOpen; // Toggle shop state
        })
        .on('pointerup', () => {
            shopButton.setStyle({ backgroundColor: '#555' }); // Revert background after click
        });

    // Function to open the shop
    const openShop = () => {
        // Clear previous shop UI if it exists
        this.children.each((child) => {
            if (child.name === 'shopItem') {
                child.destroy();
            }
        });

        // Display available upgrades and allow purchasing
        availableUpgrades.forEach((upgrade, index) => {
            const upgradeText = this.add
                .text(20, 80 + index * 30, `${upgrade.name} - Cost: ${upgrade.cost}`, {
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    color: '#00ff00'
                })
                .setName('shopItem');

            upgradeText
                .setInteractive()
                .on('pointerover', () => {
                    upgradeText.setStyle({ backgroundColor: '#555' }); // Change background on hover
                })
                .on('pointerout', () => {
                    upgradeText.setStyle({ backgroundColor: 'transparent' }); // Revert background on hover out
                })
                .on('pointerdown', () => {
                    if (totalPoints >= upgrade.cost) {
                        totalPoints -= upgrade.cost; // Deduct cost from total points
                        playerOwnedUpgrades.push(upgrade.id); // Add upgrade to owned upgrades
                        console.log(`Purchased: ${upgrade.name}`);
                        totalPointsText.setText('$CLOUT ' + totalPoints); // Update total points display
                        render.call(this);
                    } else {
                        console.log(`Not enough points to purchase: ${upgrade.name}`);
                    }
                });
        });
    };

    // Function to close the shop
    const closeShop = () => {
        this.children.each((child) => {
            if (child.name === 'shopItem') {
                child.destroy(); // Destroy shop items
            }
        });
    };
}

function update(time, delta) {
    if (time - lastTick > 1000) {
        totalPoints += farmSpeed;
        totalPointsText.setText(`Wallet: ${walletAddress.toString().slice(0, 6)}... $CLOUT  + ${totalPoints}`);
        farmSpeedText.setText(farmSpeed + '/s');
        lastTick = time;
    }
}
