class GameBoard {
    constructor(rows, cols, winCondition) {
        this.board = [];
        this.colHeights = [];
        this.rows = rows;
        this.cols = cols;
        this.winCondition = winCondition;
        this.turn = "p1";
        this.boardElement = document.getElementsByClassName("board")[0];

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
        this.boardElement.innerHTML = "";
        this.boardElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        this.boardElement.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.boardElement.insertAdjacentHTML("afterbegin",
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

        // Do nothing if column is filled
        if (this.colHeights[column - 1] == this.rows) return;

        // Update board state
        this.board[column-1][this.colHeights[column-1]] = this.turn;
        console.log(this.board);
        
        // Animate dropping
        // let colwidth = getComputedStyle(this.lowestEmptySlotImg(column)).getPropertyValue("width");
        // let colpos = getComputedStyle(this.lowestEmptySlotImg(column)).getPropertyValue("left");
        // console.log(colwidth + " " + colpos);
        
        // const fallingPiece = document.createElement("img");
        // fallingPiece.innerHTML = ""

        // console.log(getComputedStyle(this.lowestEmptySlotImg(column)));

        // Simpler animate dropping
        let piece_y = this.rows;
        let currentTurn = this.turn;
        let timer = setInterval(() => {
            if (piece_y == this.colHeights[column - 1]) {
                clearInterval(timer);
                this.updateLowestEmptySlot(column, `assets/${currentTurn}.png`, 1);
                this.colHeights[column-1]++;
                if (this.lowestEmptySlotImg(column) != null)
                    this.lowestEmptySlotImg(column).dispatchEvent(new MouseEvent("mouseover", {"bubbles": true}));
            }
            else {
                if (piece_y != this.rows)
                    this.imageAtPos(this.rows - piece_y, column + 1).setAttribute("src", `assets/empty.png`);
                this.imageAtPos(this.rows - piece_y + 1, column + 1).setAttribute("src", `assets/${currentTurn}.png`);
                piece_y -= 1;
            }
        }, 80);

        // Check if game has ended
        if (this.checkForWin(this.turn)) {
            document.querySelector(".form-wrapper").insertAdjacentHTML(
                "beforeend",
                `<p id="win-message">${this.turn} has won! Click reset to play again</p>`
            )
            // Should now freeze board so as to avoid clogging up the html...
            /*
            // Janky callback issues with this (cleaner) approach
            let slots = document.querySelectorAll(".slot");
            for (slot of slots) {
                slot.removeEventListener("click", () => dropPiece(i));
                slot.removeEventListener("mouseover", () => animateHover(i));
                slot.removeEventListener("mouseleave", () => restoreSlot(i));
            }
            */  
            // For now: duct-taped solution to clear event listeners
            this.boardElement.innerHTML = this.boardElement.innerHTML;
            // this is O(n) on # of cols. but should be O(1) based on current mouse pos.
            for (let i = 1; i <= this.cols; i++) {
                this.restoreSlot(i);
            }
            return;
            // boardElement.style.removeProperty("cursor"); // Should remove by slot instead of whole board. oops
        }

        // If game has not ended, prepare for the next turn
        if (this.turn == "p1") this.turn = "p2";
        else this.turn = "p1";
        if (this.lowestEmptySlotImg(column) != null)
            this.lowestEmptySlotImg(column).dispatchEvent(new MouseEvent("mouseover", {"bubbles": true}));
    }

    checkForWin(player) {
        // This could probably be condensed but I can't yet think of a way to condense it that doesn't sacrifice readability

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

    lowestEmptySlotImg(column) {
        const slotIndex = column + this.cols * (this.rows - this.colHeights[column - 1] - 1);
        const slot = document.querySelector(`.slot:nth-child(${slotIndex})`);
        if (slot == null) return null;
        const img = slot.firstElementChild;
        return img;
    }

    updateLowestEmptySlot(column, filepath, opacity) {
        let img = this.lowestEmptySlotImg(column);
        if (img == null) return;
        img.setAttribute("src", filepath);
        img.style.opacity = opacity;
    }

    animateHover(column) {
        this.updateLowestEmptySlot(column, `assets/${this.turn}.png`, 0.30);
    }

    restoreSlot(column) {
        this.updateLowestEmptySlot(column, `assets/empty.png`, 1);
    }

    // Helper functions for animation

    // 
    imageAtPos(row, col) { 
        const slotIndex = (col - 1) + this.cols * (row - 1);
        console.log(slotIndex);
        const slot = document.querySelector(`.slot:nth-child(${slotIndex})`);
        if (slot == null) return null;
        const img = slot.firstElementChild;
        return img;
    }
}

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

// Submit button
sizeform.addEventListener('submit', (e) => {
    e.preventDefault();
    let input = readFormInput();
    let s_rows = input[0];
    let s_cols = input[1];
    let s_wincondition = input[2];
    let errormessage = document.querySelector("#sizeform p");
    if (s_wincondition > s_rows && s_wincondition > s_cols) {
        console.log("Bad");
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

// Reset button
document.getElementById("reset").addEventListener("click", () => {
    gameBoard = new GameBoard(...readFormInput());
    gameBoard.render();
}
)