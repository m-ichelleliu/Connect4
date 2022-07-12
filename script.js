class GameBoard {
    constructor(rows, cols, winCondition) {
        this.board = [];
        this.colHeights = [];
        this.rows = rows;
        this.cols = cols;
        this.winCondition = winCondition;
        this.turn = "p1";

        // Initialize board state
        for (let i = 0; i < cols; i++) {
            this.board.push([]);
            for (let j = 0; j < rows; j++) {
                this.board[i].push("empty");
            }
        }
        for (let i = 0; i < cols; i++) {
            this.colHeights.push(0);
        }
    }

    render() {
        // Render board on page
        let boardElement = document.getElementsByClassName("board")[0];
        boardElement.innerHTML = "";
        boardElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        boardElement.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                boardElement.insertAdjacentHTML("afterbegin",
                    `<div class='slot'> 
                     <img src='assets/empty.png'></img>
                    </div>`
                );
            }
        }
    
        // Add event listeners to each column
        for (let i = 1; i <= this.cols; i++) {
            let column = document.querySelectorAll(`.board .slot:nth-child(${this.cols}n+${i})`);
            for (const slot of column) {
                slot.addEventListener("click", () => this.dropPiece(i));
                slot.addEventListener("mouseover", () => this.animateHover(i));
                slot.addEventListener("mouseleave", () => this.restoreSlot(i));
            }
        }
    
        // Clear win message
        let winmessage = document.getElementById("win-message");
        if (winmessage != null) {
            winmessage.remove();
        }
    }

    // Game Behavior
    dropPiece(column) {
        console.log(`dropped in ${column}`);
        this.board[column-1][this.colHeights[column-1]] = this.turn;
        // CHECK FOR OUT OF BOUNDS BTW
        let img = this.lowestEmptySlot(column);
        img.setAttribute("src", `assets/${this.turn}.png`);
        img.style.opacity = 1;
        this.colHeights[column-1]++;
        if (this.checkForWin(this.turn)) {
            document.querySelector(".form-wrapper").insertAdjacentHTML(
                "beforeend",
                `<p id="win-message">${this.turn} has won! Click reset to play again</p>`
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
            // Duct-taped solution to clear event listeners
            let boardElement = document.getElementsByClassName("board")[0];
            boardElement.innerHTML = boardElement.innerHTML;
            // this is O(n) on # of cols. but should be O(1) based on current mouse pos.
            for (let i = 1; i <= this.cols; i++) {
                console.log(i);
                this.restoreSlot(i);
            }
            return;
            // WHY IS IT ANIMATING HOVER
            // boardElement.style.removeProperty("cursor"); // Should remove by slot instead of whole board. oops
        }
        if (this.turn == "p1") this.turn = "p2";
        else this.turn = "p1";
        img.dispatchEvent(new MouseEvent("mouseover", {"bubbles": true}));
    }

    checkForWin(player) {
        // Verticals
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows - this.winCondition + 1; j++) {
                let hasWon = true;
                for (let k = 0; k < this.winCondition; k++) {
                    if (this.board[i][j+k] != player) {
                        hasWon = false;
                    } 
                }
                if (hasWon) return true;
            }
        }

        // Horizontals
        for (let i = 0; i < this.cols - this.winCondition + 1; i++) {
            for (let j = 0; j < this.rows; j++) {
                let hasWon = true;
                for (let k = 0; k < this.winCondition; k++) {
                    if (this.board[i+k][j] != player) {
                        hasWon = false;
                    } 
                }
                if (hasWon) return true;
            }
        }

        // Down-Right Diagonals
        for (let i = 0; i < this.cols - this.winCondition + 1; i++) {
            for (let j = 0; j < this.rows - this.winCondition + 1; j++) {
                let hasWon = true;
                for (let k = 0; k < this.winCondition; k++) {
                    if (this.board[i+k][j+k] != player) {
                        hasWon = false;
                    } 
                }
                if (hasWon) return true;
            }
        }

        // Down-Left Diagonals
        for (let i = this.winCondition - 1; i < this.cols; i++) {
            for (let j = 0; j < this.rows - this.winCondition + 1; j++) {
                let hasWon = true;
                for (let k = 0; k < this.winCondition; k++) {
                    if (this.board[i-k][j+k] != player) {
                        hasWon = false;
                    } 
                }
                if (hasWon) return true;
            }
        }   
    }

    // Show piece placement preview on hover

    lowestEmptySlot(column) {
        const slotIndex = column + this.cols * (this.rows - this.colHeights[column - 1] - 1);
        const slot = document.querySelector(`.slot:nth-child(${slotIndex})`);
        const img = slot.firstElementChild;
        return img;
    }

    animateHover(column) {
        let img = this.lowestEmptySlot(column);
        img.setAttribute("src", `assets/${this.turn}.png`);
        img.style.opacity = 0.30;
        console.log("a");
    }

    restoreSlot(column) {
        let img = this.lowestEmptySlot(column);
        img.setAttribute("src", `assets/empty.png`);
        img.style.opacity = 1;
        console.log(img.style.opacity);
        console.log(img.style);
    }
}

let turn = "p1";
const sizeform = document.getElementById("sizeform");
let gameBoard = new GameBoard(...readFormInput());
window.addEventListener("load", gameBoard.render());

function readFormInput() {
    let rows = sizeform.elements['rows'].value;
    let cols = sizeform.elements['cols'].value;
    let winCondition = sizeform.elements['wincondition'].value;
    return [rows, cols, winCondition];
}

// Menu button functionality
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
    gameBoard = new GameBoard(...readFormInput());
    gameBoard.render();
}
)

document.getElementById("reset").addEventListener("click", () => {
    gameBoard = new GameBoard(...readFormInput());
    gameBoard.render();
}
)