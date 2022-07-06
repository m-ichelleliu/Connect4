
let turn = "p1";

// Generate board

const rows = 6;
const cols = 7;
let board = [];
for (let i = 0; i < cols; i++) {
    board.push([]);
}

console.log(document.getElementsByClassName("board"));
let boardElement = document.getElementsByClassName("board")[0];
boardElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
boardElement.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        boardElement.insertAdjacentHTML("afterbegin",
            `<div class='slot'> 
             <img src='assets/empty.png'></img>
            </div>`
        );
    }
}

// Add event listeners to each column
for (let i = 1; i <= cols; i++) {
    let column = document.querySelectorAll(`.board .slot:nth-child(${cols}n+${i})`);
    for (const slot of column) {
        slot.addEventListener("click", () => dropPiece(i));
    }
}

// Game Behavior

function dropPiece(column) {
    console.log(`dropped in ${column}`);
    console.log(board);
    board[column-1].push(turn);
    // CHECK FOR OUT OF BOUNDS BTW
    const slotIndex = column + cols * (rows - board[column - 1].length);
    const slot = document.querySelector(`.slot:nth-child(${slotIndex})`);
    const img = slot.firstElementChild;
    img.setAttribute("src", `assets/${turn}.png`);
    if (turn == "p1") turn = "p2";
    else turn = "p1";
    checkForWin();
}

function checkForWin() {

}


