/**
* This program is a boilerplate code for the standard tic tac toe game
* Here the “box” represents one placeholder for either a “X” or a “0”
* We have a 2D array to represent the arrangement of X or O is a grid
* 0 -> empty box
* 1 -> box with X
* 2 -> box with O
*
* Below are the tasks which needs to be completed:
* Imagine you are playing with the computer so every alternate move should be done by the computer
* X -> player
* O -> Computer
*
* Winner needs to be decided and has to be flashed
*
* Extra points will be given for approaching the problem more creatively
* 
*/

const grid = [];
const GRID_LENGTH = 3;
let turn = 'X';

const winCombos =  [
    [[0, 0], [0, 1], [0,2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],

    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    
    [[0, 0], [1, 1], [2, 2]],
    [[2, 0], [1, 1], [0, 2]]
];

let possibleMoves = ["0 0", "0 1", "0 2", "1 0", "1 1", "1 2", "2 0", "2 1", "2 2"];
let remainingMoves = [];

function initializeGrid() {
    grid.splice(0, grid.length);
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            tempArray.push(0);
        }
        grid.push(tempArray);
    }
}

function getRowBoxes(colIdx, winnerObj) {
    let rowDivs = '';
    let winningBoxes = [];
    if (winnerObj && winnerObj.player) {
        winningBoxes = winnerObj.winningCombo.map((item) => {
            return "" + item[0] + item[1];
        });
    }
    for(let rowIdx=0; rowIdx < GRID_LENGTH ; rowIdx++ ) {
        let additionalClass = 'boxBorderRight';
        let content = '';
        let boxId = "" + colIdx + rowIdx;
        if (rowIdx === GRID_LENGTH - 1) {
            additionalClass = '';
        }
        if(winningBoxes.indexOf(boxId) > -1) {
            additionalClass += ' winnerBox';
        }
        const gridValue = grid[colIdx][rowIdx];
        if(gridValue === 1) {
            content = '<span class="cross times">X</span>';
        }
        else if (gridValue === 2) {
            content = '<span class="cross circle">O</span>';
        }
        rowDivs = `${rowDivs}<div id="${boxId}" colIdx="${colIdx}" rowIdx="${rowIdx}" 
                        class="box ${additionalClass}" > ${content} </div>`;
    }
    return rowDivs;
}

function getColumns(winnerObj) {
    let columnDivs = '';
    for(let colIdx=0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx, winnerObj);
        let additionalClass = 'boxBorderBottom';
        if (colIdx == GRID_LENGTH - 1 ) {
            additionalClass = '';
        }
        coldiv = `<div class="rowStyle ${additionalClass}">${coldiv}</div>`; 
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

function renderMainGrid(winnerObj) {
    const parent = document.getElementById("grid");
    const columnDivs = getColumns(winnerObj);
    parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    let boxId = colIdx + " " + rowIdx;
    
    // In case player clicks on a cell which is already used just return
    if (grid[colIdx][rowIdx] != 0) {
        return;
    }
    
    let newValue = 1;
    grid[colIdx][rowIdx] = newValue;
    
    // Check if there is an Winner
    let winnerObj = getWinner(winCombos, grid, turn);
    let winningCombo = winnerObj.winningCombo;

    // Rerender the Grid with Player's Move
    renderMainGrid({ winningCombo, player: turn});

    // if there are no more moves to make, show 'Game Over' message
    if (isGameOver(grid)) {
        renderGameEndScreen({gameOver: true});
        return;    
    }
    
    // If there is an winner declare him
    if (winnerObj.winner) {
        renderGameEndScreen({winner: turn});
        return;
    }

    addClickHandlers();
    
    // remove the 'move' taken by computer from 'remainingMoves'
    remainingMoves = remainingMoves.filter(move => move != boxId);

    if (remainingMoves.length) {
        setTimeout(function () {
            makeBotMove();
            // Change the player
            turn = "X";
        }, 300);
    }
}

function makeBotMove () {
    let idx = getRandNumber(0, remainingMoves.length-1);
    let boxId = remainingMoves[idx];
    let colIdx = boxId.split(" ")[0];
    let rowIdx = boxId.split(" ")[1];
    

    // make it as Computer's turn
    turn = "O";
    grid[colIdx][rowIdx] = 2;
    
    // Check if there is an Winner
    let winnerObj = getWinner(winCombos, grid, turn);
    let winningCombo = winnerObj.winningCombo;
    
    // Rerender the Grid with Computer's Move
    renderMainGrid({ winningCombo, player: turn});
    
    // if there are no more moves to make, show 'Game Over' message
    if (isGameOver(grid)) {
        renderGameEndScreen({gameOver: true});
        return;    
    }
    
    // If there is an winner declare him
    if (winnerObj.winner) {
        renderGameEndScreen({winner: turn});
        return;
    }

    // remove the 'move' taken by computer from 'remainingMoves'
    remainingMoves = remainingMoves.filter(move => move != boxId);

    addClickHandlers();
}


function renderGameEndScreen (winner) {
    let gameEndHTML = '';
    let message = `Winner ${winner.winner} !`;
    if (winner.gameOver) {
        message = `Game Over! It's a tie!`;
    }
    gameEndHTML = `<h1 id="winnerText" class="winnerText">${message}</h1>
                    <div id="playBtn" class="playBtn">
                        Play Again
                    </div>`;
    let parent = document.getElementById("gameEndScreen");
    parent.classList.remove('hide');
    parent.innerHTML = gameEndHTML;
    document.getElementById('playBtn').addEventListener('click', playBtnHandler, false);
}

let playBtnHandler = function () {
    turn = 'X';
    intializeGame(); 
    let gameEndScreenElem = document.getElementById("gameEndScreen");
    gameEndScreenElem.classList.add('hide');
    gameEndScreenElem.innerHTML = '';
}

function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        boxes[idx].addEventListener('click', onBoxClick, false);
    }
}

function intializeGame() {
    initializeGrid();
    renderMainGrid();
    addClickHandlers();
    remainingMoves = ["0 0", "0 1", "0 2", "1 0", "1 1", "1 2", "2 0", "2 1", "2 2"];
    let resetBtn = document.getElementById('resetBtn');
}

function getWinner (winCombos, grid, turn) {
    let winningCombo = [];
    let map = {
        "X": 1,
        "O": 2
    };
    let winner = winCombos.some(function(combination) {
        let winning = true;
        for (let i = 0; i < combination.length; i++) {
            if (grid[combination[i][0]][combination[i][1]] !== map[turn]) {
                winning = false;
            }
        }
        if (winning) {
            winningCombo = combination;
        }
        return winning;
    });
    return { 
        winner: winner, 
        winningCombo: winningCombo
    };
}

function isGameOver(grid) {
	let currentBoard = grid.flat();
	let gameOver = !currentBoard.some(function (box) {
		return box === 0;
	})
	return gameOver;
}	

function getRandNumber (low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

intializeGame();

