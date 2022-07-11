
let turn = "p1";
const sizeform = document.getElementById("sizeform");
let rows = sizeform.elements['rows'].value;
let cols = sizeform.elements['cols'].value;
let winCondition = sizeform.elements['wincondition'].value;
let board = [];
let colHeights = [];
window.addEventListener("load", generateBoard());

sizeform.addEventListener('submit', (e) => {
    e.preventDefault();
    /* Validation not working at the moment */
    let s_wincondition = parseInt(sizeform.elements['wincondition'].value);
    let s_rows = parseInt(sizeform.elements['rows'].value);
    let s_cols = parseInt(sizeform.elements['cols'].value);
    let errormessage = document.querySelector("#sizeform p");
    if (s_wincondition > s_rows && s_wincondition > s_cols) {
        if (errormessage == null) {
            sizeform.insertAdjacentHTML(
                "beforeend",
                '<p>Bad game rules; impossible win condition</p>');
        }
        return;
    } else {
        if (errormessage != null) errormessage.remove();
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
    winCondition = sizeform.elements['wincondition'].value;
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

    // Clear win message
    let winmessage = document.getElementById("win-message");
    if (winmessage != null) {
        winmessage.remove();
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
            `<p id="win-message">${turn} has won! Click reset to play again</p>`
        )
        // Should now freeze board so as to avoid clogging up the html...
        /*
        // Janky callback issues with this (better) approach
        let slots = document.querySelectorAll(".slot");
        for (slot of slots) {
            slot.removeEventListener("click", () => dropPiece(i));
            slot.removeEventListener("mouseover", () => animateHover(i));
            slot.removeEventListener("mouseleave", () => restoreSlot(i));
        }
        */ 
       // Duct-taped solution
       let boardElement = document.getElementsByClassName("board")[0];
       boardElement.innerHTML = boardElement.innerHTML;
       // this is O(n) based on # of cols. but should be O(1) based on current mouse pos.
       for (let i = 1; i <= cols; i++) {
           restoreSlot(i);
       }
       // boardElement.style.removeProperty("cursor"); // Should remove by slot instead of whole board. oops
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
    for (let i = winCondition - 1; i < cols; i++) {
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