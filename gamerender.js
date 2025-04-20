import zim from 'https://zimjs.org/cdn/017/zim_game';
import met from 'https://zimjs.org/cdn/017/zim';

var slotUpgrades = ['toaster', 'raspberry_pi', 'notebook', 'gamer_rig', 'gpu_rack', 'asic_solo', 'asic_rack', 'hydro_farm', 'quantum'];
var backgroundImages = ['bg1.png', 'bg2.png', 'bg3.png'];
var background = 'bg2';

const zimDiv = document.getElementById('zim');
const frame = new Frame({
    scaling: 'zim', // Use FIT to scale the content to fit in the div
    width: 1000, // Your design width
    height: 1000, // Your design height
    ready: ready // Ready function
});

export function Render(minerIdList, backgroundId) {
    slotUpgrades = minerIdList;
    background = backgroundId;
    ready();
}
window.Render = function (minerIdList, backgroundId) {
    Render(minerIdList, backgroundId);
};

function ready() {
    // given F (Frame), S (Stage), W (width), H (height)

    const backgroundImage = new Image();
    backgroundImage.src = background + '.png';

    // Wait for images to load
    Promise.all([
        new Promise((resolve) => {
            backgroundImage.onload = resolve;
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
                        var scaleFactor = (cellSize * 2) / Math.max(img.width, img.height);
                        scaleFactor *= 0.4; // img from gif factor

                        var spriteScale = 1;
                        if (img.src.includes('toaster')) spriteScale = 0.8;
                        if (img.src.includes('raspberry_pi')) spriteScale = 1.1;
                        if (img.src.includes('notebook')) spriteScale = 1.1;
                        if (img.src.includes('gamer_rig')) spriteScale = 1.2;
                        if (img.src.includes('gpu_rack')) spriteScale = 1.4;
                        if (img.src.includes('asic_solo')) spriteScale = 0.9;
                        if (img.src.includes('asic_rack')) spriteScale = 1.6;
                        if (img.src.includes('hydro_farm')) spriteScale = 1.6;
                        if (img.src.includes('quantum')) spriteScale = 1.4;

                        scaleFactor *= spriteScale;

                        // Apply scaling and center the sprite within the container
                        sprite.sca(scaleFactor * (1 + -0.03 * (i + j))); // Stop perspective foreshortening
                        sprite.center(container);

                        if (img.src.includes('toaster_miner')) sprite.y *= 1.3;
                        if (img.src.includes('pi_miner_one')) sprite.y *= 1.3;
                        if (img.src.includes('notebook')) sprite.y *= 1.5;
                        if (img.src.includes('gamer_rig')) sprite.y *= 1.5;
                        if (img.src.includes('gpu_rack')) sprite.y *= 1.5;
                        if (img.src.includes('asic_solo')) sprite.y *= 1.4; // Ensure asic solo is included
                        if (img.src.includes('asic_rack')) sprite.y *= 1.5;
                        if (img.src.includes('hydro_farm')) sprite.y *= 1.5;
                        if (img.src.includes('quantum')) sprite.y *= 1.5;

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
