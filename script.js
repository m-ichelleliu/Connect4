
let turn = "p1";
const sizeform = document.getElementById("sizeform");
let rows = sizeform.elements['rows'].value;
let cols = sizeform.elements['cols'].value;
let winCondition = sizeform.elements['wincondition'].value; /* 4 by default */
let board = [];
let colHeights = [];
generateBoard();

sizeform.addEventListener('submit', (e) => {
    e.preventDefault();
    /* Validation not working at the moment */
    if (sizeform.elements['wincondition'].value > sizeform.elements['rows'].value && sizeform.elements['wincondition'].value > sizeform.elements['cols'].value) {
        sizeform.appendChild('<p>Bad game rules; impossible win condition</p>');
        console.log('bruh');
        return;
    }
    generateBoard();
}
)

document.getElementById("reset").addEventListener("click", () => {
    generateBoard();
}
)


// Generate board

function generateBoard() {
    rows = sizeform.elements['rows'].value;
    cols = sizeform.elements['cols'].value;
    board = [];
    for (let i = 0; i < cols; i++) {
        board.push([]);
        for (let j = 0; j < rows; j++) {
            board[i].push("empty");
        }
    }
    colHeights = [];
    for (let i = 0; i < cols; i++) {
        colHeights.push(0);
    }
    
    let boardElement = document.getElementsByClassName("board")[0];
    boardElement.innerHTML = "";
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
            slot.addEventListener("mouseover", () => animateHover(i));
            slot.addEventListener("mouseleave", () => restoreSlot(i));
        }
    }

}

// Show piece placement preview on hover

function lowestEmptySlot(column) {
    const slotIndex = column + cols * (rows - colHeights[column - 1] - 1);
    const slot = document.querySelector(`.slot:nth-child(${slotIndex})`);
    const img = slot.firstElementChild;
    return img;
}

function animateHover(column) {
    img = lowestEmptySlot(column);
    img.setAttribute("src", `assets/${turn}.png`);
    img.style.opacity = 0.30;
}

function restoreSlot(column) {
    img = lowestEmptySlot(column);
    img.setAttribute("src", `assets/empty.png`);
    img.style.opacity = 1;
}

// Game Behavior

function dropPiece(column) {
    console.log(`dropped in ${column}`);
    console.log(board);
    board[column-1][colHeights[column-1]] = turn;
    // CHECK FOR OUT OF BOUNDS BTW
    img = lowestEmptySlot(column);
    img.setAttribute("src", `assets/${turn}.png`);
    img.style.opacity = 1;
    colHeights[column-1]++;
    if (checkForWin(turn)) {
        document.querySelector(".form-wrapper").insertAdjacentHTML(
            "beforeend",
            `<p>${turn} has won! Click reset to play again</p>`
        )
        // Should now freeze board so as to avoid clogging up the html...
    }
    if (turn == "p1") turn = "p2";
    else turn = "p1";
    img.dispatchEvent(new MouseEvent("mouseover", {"bubbles": true}));
}

function checkForWin(player) {
    // Verticals
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows - winCondition + 1; j++) {
            let hasWon = true;
            for (let k = 0; k < winCondition; k++) {
                if (board[i][j+k] != player) {
                    hasWon = false;
                } 
            }
            if (hasWon) return true;
        }
    }

    // Horizontals
    for (let i = 0; i < cols - winCondition + 1; i++) {
        for (let j = 0; j < rows; j++) {
            let hasWon = true;
            for (let k = 0; k < winCondition; k++) {
                if (board[i+k][j] != player) {
                    hasWon = false;
                } 
            }
            if (hasWon) return true;
        }
    }

    // Down-Right Diagonals
    for (let i = 0; i < cols - winCondition + 1; i++) {
        for (let j = 0; j < rows - winCondition + 1; j++) {
            let hasWon = true;
            for (let k = 0; k < winCondition; k++) {
                if (board[i+k][j+k] != player) {
                    hasWon = false;
                } 
            }
            if (hasWon) return true;
        }
    }

    // Down-Left Diagonals
    for (let i = 3; i < cols; i++) {
        for (let j = 0; j < rows - winCondition + 1; j++) {
            let hasWon = true;
            for (let k = 0; k < winCondition; k++) {
                if (board[i-k][j+k] != player) {
                    hasWon = false;
                } 
            }
            if (hasWon) return true;
        }
    }
}


