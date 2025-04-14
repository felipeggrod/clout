const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 400,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT, // Center the game view
        autoCenter: Phaser.Scale.CENTER_BOTH // Center both horizontally and vertically
    },
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
        cost: 1,
        tileSlot: 'room1',
        tilePosition: { x: 15, y: 15 }
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

function preload() {
    const imageNames = [
        'vehicle_8_helicopter',
        'vehicle_7_lamborghini',
        'vehicle_6_sports_car',
        'vehicle_5_suv',
        'vehicle_4_sedan',
        'vehicle_3_compact_car',
        'vehicle_2_rusty_bike',
        'vehicle_1_skateboard',
        'phone_6_iphone_diamond',
        'phone_5_iphone_modern',
        'phone_4_flagship_android_ultra',
        'phone_3_iphoneclassic',
        'phone_2_old_nokia',
        'phone_1_cracked_old_smartphone',
        'house_10_crypto_mansion',
        'house_9',
        'house_8',
        'house_7',
        'house_6',
        'house_5',
        'house_4',
        'house_3',
        'house_2',
        'house_1_cardboard_box',
        'computer4_gaming_setup',
        'computer_6_command_center',
        'computer_5_mainframe',
        'computer_3_office_desktop',
        'computer_2_chromebook',
        'computer_1_old_potato',
        'clothing_8_diamond_robe_and_crown',
        'clothing_7_personal_tailor_collection',
        'clothing_6_custom_fit_w_chains',
        'clothing_5_full_hypebeast_fit',
        'clothing_4_designer_streetwear',
        'clothing_3_branded_tee',
        'clothing_2_thrifted_hoodie',
        'clothing_1_torn_tee_cargo_shorts',
        'camera_5_cinematic_film_gear',
        'camera_4_dslr_mic_ringlight',
        'camera_3_basic_dslr',
        'camera_2_phone_on_tripod',
        'camera_1_cheap_webcam'
    ];

    imageNames.forEach((asset) => {
        this.load.image(asset, `assets/${asset}.png`);
    });
    // // Add error handling for image loading
    // this.load.on("filecomplete", (key, type, data) => {
    //   console.log(`Loaded: ${key}`);
    // });

    // this.load.on("fileerror", (file) => {
    //   console.error(`Failed to load: ${file.key}`);
    // });
}

function create() {
    render.call(this);

    const borderThickness = 5; // Thickness of the border
    const borderColor = 0xffffff; // White color for the border
    this.add.graphics().lineStyle(borderThickness, borderColor).strokeRect(0, 0, config.width, config.height);
}

function render() {
    renderSingleImage.call(this);
    renderImageGrid.call(this);
    renderUI.call(this);
}

function renderSingleImage() {
    // Render a single image in the second column
    const singleImageX = 600; // Adjust X position for the second column
    const singleImageY = 200; // Y position for the single image

    const desiredWidth = 300; // Desired width
    const desiredHeight = 300; // Desired height

    this.add
        .image(singleImageX, singleImageY, 'house_10_crypto_mansion')
        .setDisplaySize(desiredWidth, desiredHeight) // Set the display size to 300x300
        .setOrigin(0.5, 0.5); // Center the image
}

function renderImageGrid() {
    // Render a 2x2 grid of images in the third column
    const gridX = 800; // Adjust X position for the third column
    const gridY = 75; // Y position for the grid
    const tileSize = 200; // Size of each tile in the grid

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            const phoneImages = ['phone_6_iphone_diamond', 'phone_5_iphone_modern', 'computer_2_chromebook', 'clothing_6_custom_fit_w_chains', 'vehicle_1_skateboard', 'vehicle_7_lamborghini']; // Key for the image to be used
            const imageKey = phoneImages[Math.floor(Math.random() * phoneImages.length)]; // Pick a random phone image
            const image = this.add.image(0, 0, imageKey); // Create a temporary image to get its dimensions
            const imageWidth = image.width; // Get the width of the image
            const imageHeight = image.height; // Get the height of the image
            image.destroy(); // Destroy the temporary image

            const scaleX = (tileSize / imageWidth) * 0.55; // Calculate scale factor for width
            const scaleY = (tileSize / imageHeight) * 0.55; // Calculate scale factor for height
            const scale = Math.min(scaleX, scaleY); // Use the smaller scale to maintain aspect ratio

            const xPos = gridX + j * tileSize + (tileSize - imageWidth * scale) / 2; // Center the image horizontally
            const yPos = gridY + i * tileSize + (tileSize - imageHeight * scale) / 2; // Center the image vertically
            this.add
                .image(xPos, yPos, imageKey)
                .setDisplaySize(imageWidth * scale, imageHeight * scale) // Set the display size while maintaining aspect ratio
                // Set the display size to 300x300
                .setOrigin(0.5, 0.5); // Center the image

            const titleText = 'title'.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()); // Format title from image key
            this.add.text(xPos, yPos - (imageHeight * scale) / 2 - 10, titleText, { fontSize: '14px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5, 1); // Add title text

            this.add.text(xPos, yPos + (imageHeight * scale) / 2 + 10, '$clout/s', { fontSize: '14px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5, 0); // Add title text below
        }
    }
}

function renderUI() {
    // UI
    let uiTextStyle = {
        fontSize: '16px',
        color: '#00ff00',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 4
    };

    walletText = this.add.text(20, 0, `Wallet: ${walletAddress}`, uiTextStyle);

    totalPointsText = this.add.text(20, 20, '$CLOUT 0', uiTextStyle);

    farmSpeedText = this.add.text(20, 50, 'Farming Speed: ' + farmSpeed, uiTextStyle);

    // Shop Button
    const shopButton = this.add
        .text(20, 360, '🛒 Shop', {
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
            const upgradeText = this.add.text(20, 80 + index * 30, `${upgrade.name} - Cost: ${upgrade.cost}`, uiTextStyle).setName('shopItem');

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

        walletText.setText(`Wallet: ${walletAddress.toString().slice(0, 6)}...`);
        totalPointsText.setText(`$CLOUT ${totalPoints}`);
        farmSpeedText.setText(farmSpeed + '/s');
        lastTick = time;
    }
}
