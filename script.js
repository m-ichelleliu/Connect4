
let turn = "p1";

// Generate board

const rows = 6;
const cols = 7;
let board = [];
for (let i = 0; i < cols; i++) {
    board.push([]);
    for (let j = 0; j < rows; j++) {
        board[i].push("empty");
    }
}
let colHeights = [];
for (let i = 0; i < cols; i++) {
    colHeights.push(0);
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
    board[column-1][colHeights[column-1]] = turn;
    // CHECK FOR OUT OF BOUNDS BTW
    const slotIndex = column + cols * (rows - colHeights[column - 1] - 1);
    const slot = document.querySelector(`.slot:nth-child(${slotIndex})`);
    const img = slot.firstElementChild;
    img.setAttribute("src", `assets/${turn}.png`);
    if (turn == "p1") turn = "p2";
    else turn = "p1";
    colHeights[column-1]++;
    checkForWin("p1");
    checkForWin("p2");
}

function checkForWin(player) {
    // Verticals
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows - 3; j++) {
            if (board[i][j] === player && board[i][j+1] === player &&
                board[i][j+2] === player && board[i][j+3] === player){
                    console.log(player + "wins!");
            }
        }
    }
}


