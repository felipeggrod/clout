import zim from 'https://zimjs.org/cdn/017/zim_game';
import met from 'https://zimjs.org/cdn/017/zim';

var slotUpgrades = ['toaster', 'raspberry_pi', 'notebook', 'gamer_rig', 'gpu_rack', 'asic_solo', 'asic_rack', 'hydro_farm', 'quantum'];
var backgroundImages = ['bg1.png', 'bg2.png', 'bg3.png', 'bg4.png', 'bg5.png'];
var background = 'bg1';
var boardSize = { rows: 4, cols: 4 };
var board;

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
            S.removeAllChildren();
            // Set the background image
            const backgroundBitmap = new Bitmap(backgroundImage).center();
            S.addChild(backgroundBitmap); // Add background to the board first

            // Create the isometric board
            const cellSize = 100;

            if (background == 'bg1') {
                boardSize = { rows: 2, cols: 2 }; // stinky bedroom //max2
            }
            if (background == 'bg2') {
                boardSize = { rows: 2, cols: 2 }; // low profile storage //max4
            }
            if (background == 'bg3') {
                boardSize = { rows: 3, cols: 3 }; // hidden power house //max6
            }
            if (background == 'bg4') {
                boardSize = { rows: 3, cols: 3 }; // dad's garage //max9
            }
            if (background == 'bg5') {
                boardSize = { rows: 3, cols: 3 };
            }
            console.log(`Background: '${background}', GRID SIZE: ${boardSize.rows} x ${boardSize.cols}`);

            const boardConfig = {
                cols: boardSize.cols,
                rows: boardSize.rows,
                fill: false, // Disable fill completely
                backgroundColor: 'rgba(0, 0, 255, 0.01)',
                borderColor: 'rgba(255, 255, 255, 0.0002)', // White borders
                borderWidth: 3, // Thicker borders
                isometric: true, // Make the board isometric

                size: 80
            };
            board = new Board(boardConfig).center();
            board.y += board.getBounds().height * 0.5; // Move board down by 30%
            if (background == 'bg2') board.y += board.getBounds().height * 0.1;

            // board.alpha = 0.5;
            S.addChild(board);

            let slot = 0;
            for (let i = 0; i < boardSize.cols; i++) {
                for (let j = 0; j < boardSize.rows; j++) {
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
                        if (img.src.includes('raspberry_pi')) sprite.y *= 1.3;
                        if (img.src.includes('notebook')) sprite.y *= 1.5;
                        if (img.src.includes('gamer_rig')) sprite.y *= 1.5;
                        if (img.src.includes('gpu_rack')) sprite.y *= 1.5;
                        if (img.src.includes('asic_solo')) sprite.y *= 1.4; // Ensure asic solo is included
                        if (img.src.includes('asic_rack')) sprite.y *= 1.5;
                        if (img.src.includes('hydro_farm')) sprite.y *= 1.5;
                        if (img.src.includes('quantum')) sprite.y *= 1.5;

                        // Add the container as a piece to the board
                        console.log(`Adding ${img.src} at Row: ${i}, Column: ${j}, Current Board Size: ${boardSize.cols}x${boardSize.rows}`); // Debug log
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
}

function Pop(slotIndex) {
    console.log('Pop function called with slotIndex:', slotIndex); // Log the slotIndex
    const container = board.getChildAt(slotIndex); // Get the container for the specified slot
    console.log('Container:', container); // Log the container

    if (container) {
        console.log('pop2'); // This will now log if container is valid
        const sprite = container.children[0]; // Assuming the sprite is the first child
        sprite.animate({
            props: {
                alpha: 0 // Fade out to white
            },
            time: 0.08, // 80ms to fade out
            onComplete: () => {
                sprite.animate({
                    props: {
                        alpha: 1 // Fade back to normal
                    },
                    time: 0.08 // 80ms to fade back
                });
            }
        });
    } else {
        console.warn('No container found for slotIndex:', slotIndex); // Warn if container is not found
    }
}

window.Pop = Pop; // Export popSlot to the window object
