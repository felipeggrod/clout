import zim from 'https://zimjs.org/cdn/017/zim_game';
import met from 'https://zimjs.org/cdn/017/zim';

let slotUpgrades = ['toaster', 'miner_1', 'miner_2', 'miner_3', 'miner_4', 'miner_5', 'miner_6', 'miner_7', 'miner_8']; //, 'asic_minerrack', 'raspberry_pi_miner', 'asic_miner', 'toaster', 'toaster', 'toaster'];

const zimDiv = document.getElementById('zim');
const frame = new Frame({
    scaling: 'zim', // Use FIT to scale the content to fit in the div
    width: 1000, // Your design width
    height: 1000, // Your design height
    ready: ready // Ready function
});

export function Render(minerIdList) {
    slotUpgrades = minerIdList;
    ready();
}
window.Render = function (minerIdList) {
    Render(minerIdList);
};

function ready() {
    // given F (Frame), S (Stage), W (width), H (height)

    const backgroundImage = new Image();
    const spriteImage = new Image();

    backgroundImage.src = 'bg1.png'; // Updated path
    spriteImage.src = 'sprite.png'; // Updated path

    // Wait for images to load
    Promise.all([
        new Promise((resolve) => {
            backgroundImage.onload = resolve;
        }),
        new Promise((resolve) => {
            spriteImage.onload = resolve;
        })
    ])
        .then(() => {
            // Set the background image
            const background = new Bitmap(backgroundImage).center();
            S.addChild(background); // Add background to the board first

            // Create the isometric board
            const boardSize = 4;
            const cellSize = 100;

            const boardConfig = {
                cols: boardSize,
                rows: boardSize,
                fill: false, // Disable fill completely
                backgroundColor: 'rgba(0, 0, 255, 0.01)',
                borderColor: 'rgba(255, 255, 255, 0.5)', // White borders
                borderWidth: 3, // Thicker borders
                isometric: true, // Make the board isometric

                size: 80
            };
            const board = new Board(boardConfig).center();
            board.y += board.getBounds().height * 0.5; // Move board down by 30%

            // board.alpha = 0.5;
            S.addChild(board);

            let slot = 0;
            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize; j++) {
                    // Create a container for the sprite
                    const container = new Container();

                    if (!slotUpgrades[slot]) continue;

                    // Load the image for the current slot
                    const img = new Image();
                    img.src = `${slotUpgrades[slot]}.png`;

                    // Wait for the image to load
                    img.onload = () => {
                        const sprite = new Bitmap(img);

                        // Calculate scale to fit the sprite within the cell
                        var scaleFactor = (cellSize * 2) / Math.max(spriteImage.width, spriteImage.height);
                        scaleFactor *= 0.4; // img from gif factor

                        var spriteScale = 1;
                        if (img.src.includes('miner_1')) spriteScale = 0.8;
                        if (img.src.includes('miner_2')) spriteScale = 1.1;
                        if (img.src.includes('miner_3')) spriteScale = 1.1;
                        if (img.src.includes('miner_4')) spriteScale = 1.2;
                        if (img.src.includes('miner_5')) spriteScale = 1.4;
                        if (img.src.includes('miner_6')) spriteScale = 1;
                        if (img.src.includes('miner_7')) spriteScale = 1.6;
                        if (img.src.includes('miner_8')) spriteScale = 1.6;
                        if (img.src.includes('miner_9')) spriteScale = 1.6;

                        scaleFactor *= spriteScale;

                        // Apply scaling and center the sprite within the container
                        sprite.sca(scaleFactor * (1 + -0.03 * (i + j))); // Stop perspective foreshortening
                        sprite.center(container);

                        if (img.src.includes('miner_1')) sprite.y *= 1.3;
                        if (img.src.includes('miner_2')) sprite.y *= 1.3;
                        if (img.src.includes('miner_3')) sprite.y *= 1.5;
                        if (img.src.includes('miner_4')) sprite.y *= 1.5;
                        if (img.src.includes('miner_5')) sprite.y *= 1.5;
                        if (img.src.includes('miner_6')) sprite.y *= 1.5;
                        if (img.src.includes('miner_7')) sprite.y *= 1.5;
                        if (img.src.includes('miner_8')) sprite.y *= 1.5;
                        if (img.src.includes('miner_9')) sprite.y *= 1.5;

                        // Add the container as a piece to the board
                        board.add(container, j, i);

                        sprite.animate({
                            props: {
                                scaleX: sprite.scaleX * 1.02,
                                y: sprite.y + 1
                            },
                            time: 0.099, // 0.5 seconds in one direction
                            loop: true,
                            rewind: true, // This creates a ping-pong effect
                            ease: 'linear',
                            wait: Math.random() * 0.3
                        });
                    };

                    img.onerror = () => {
                        console.error(`Error loading image for slot: ${slotUpgrades[slot]}`);
                    };

                    slot++; // Update slot
                }
            }

            board.on('click', (event) => {
                console.log('Event object:', event); // Log the entire event object for debugging
                console.log(`Cell clicked: Row ${event.target.boardRow}, Column ${event.target.boardCol}`); // Log the cell position

                slotUpgrades.pop();
                Render(slotUpgrades);
            });

            //Fit the gameview inside the html element
            const canvas = document.getElementById('zimCanvas');
            canvas.style.width = `${zimDiv.offsetWidth}px`;
            canvas.style.height = `${zimDiv.offsetHeight}px`;
            canvas.width = zimDiv.offsetWidth; // Set the canvas width
            canvas.height = zimDiv.offsetHeight; // Set the canvas height
        })

        .catch((error) => {
            console.error('Error loading images:', error);
        });
} // end ready
