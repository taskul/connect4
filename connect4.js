/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a player color will light up 
 * in an available cell until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
// the parent item for the whole board
const htmlBoard = document.getElementById('board');
// visual displays for user interface on the game 
const currentPlayerDisplayed = document.getElementById('player');
const mainDisplayText = document.getElementById('main-display-text');
// game sounds
const winSounds = new Audio('sfx/win.wav');
const toneSound = new Audio('sfx/tone.wav');
const randSounds = new Audio('sfx/random.wav')
// initializing a variable for the start game button
const startGameButton = document.getElementById('start-button')
// adding an eventListenr to the start game to control when game starts/resets
startGameButton.addEventListener('click', startGame)

// controls if the game should continue or not. 
// startGame() function changes it to false so the game could begin
let gameOver = true;

// constants used for dimensions for game board where player pieces go
const WIDTH = 7;
const HEIGHT = 6;

// current player starts out as null and changed to 1 with startGame() function
let currPlayer = null; // active player: 1 or 2

let board = []; // array of rows, each row is array of cells  (board[y][x])

// starts game, resets the board, updated text on game board displays
function startGame() {
  toneSound.play();
  resetGameBoard()
  gameOver = false;
  currPlayer = 1
  currentPlayerDisplayed.textContent = `Player ${currPlayer}`
  mainDisplayText.textContent = 'Connect     4'
  // change top game board buttons to player color. 
  updatePlayerLights(currPlayer)
}

// resets the game board
function resetGameBoard() {
  // getting the game piece board rows
  const htmlBoardRows = htmlBoard.children
  // clearing a board array which is used for keeping track of the score
  board.splice(0, board.length)
  // recreating a board array with items that will be used to keep track of score
  makeBoard()

  // clearing all of the player lights on the game board, except for the top row
  for (let boardRow of htmlBoardRows) {
    if (boardRow.id !== 'column-top') {
      for (let rowCell of boardRow.children) {
        rowCell.firstChild.className = 'board-piece-light';
      }
    }
  }
}

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 *  This is used for scoring the game. it creates an array of 6 arrays
 *  which have 7 items set to null, as the game progresses based on coordinates
 * within the range of array null items are changed to either 1 or 2 depending on
 * what player placed the piece. 
 */
function makeBoard() {
  for (let row = 0; row < HEIGHT; row++) {
    const newRow = [];
    for (let col = 0; col < WIDTH; col++) {
      newRow.push(null);
    }
    board.push(newRow);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // table header with event listener checking for user clicks
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Creating table data cells for table header/top
  // this is where player will click to place their game piece
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    const gameButtons = document.createElement('button');
    const gameButtonLight = document.createElement('div');
    gameButtons.classList.add('game-buttons');
    gameButtons.setAttribute('id', x)
    gameButtonLight.classList.add('game-buttons-light')
    gameButtons.append(gameButtonLight);
    headCell.append(gameButtons);
    top.append(headCell);
  }
  htmlBoard.append(top);

  /** first we create table rows, then we create table data for each of those
      rows. We then create div elements that will be game pieces lights
      finally we append divs to table data cells, and table data cells to rows **/
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      const boardPieceLight = document.createElement('div')
      boardPieceLight.classList.add('board-piece-light')
      cell.append(boardPieceLight)
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** This function controls which color lights will be shown on the top game 
 * board buttons used to play the game, they are either gray, yellow or red
 * depending on if game is turned off, or current player. it controlls CSS classes
 */
function updatePlayerLights(player) {
  const tableHeader = document.getElementById('column-top')
  for (let tableCell of tableHeader.children) {
    const gameButton = tableCell.firstChild.lastChild
    if (player === 1) {
      gameButton.classList.add('p1')
      if (gameButton.classList.contains('p2')) {
        gameButton.classList.remove('p2')
      }
    }
    if (player === 2) {
      gameButton.classList.add('p2')
      if (gameButton.classList.contains('p1')) {
        gameButton.classList.remove('p1')
      }
    }
    if (player === null) {
      if (gameButton.classList.contains('p1')) {
        gameButton.classList.remove('p1')
      }
      if (gameButton.classList.contains('p2')) {
        gameButton.classList.remove('p2')
      }
    }
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
// update board array for scoring
function findSpotForCol(x) {
  /** function loops over the rows of the board using hight of the board.
  since rows with higher numbers are at the bottom, we are doing a count down
  in order to place game pieces starting from the bottom. 
  if the coordinate in the board array is equal to null, then we can place a game 
  piece there. we first update the value in the board array to the current player number
  Then we return coordinate for y which can be used to for coordinates to place a game piece  **/
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      // change coordinate in board from null to currPlayer 1 or 2.
      board[y][x] = currPlayer;
      // return coordinate y for game piece
      return y
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // currentPlayerPiece is for CSS class that will be used to change color of player piece
  let currentPlayerPiece = ''
  // get the current cell based on coordinated passed
  const currentCell = document.getElementById(`${y}-${x}`)
  // if currentCell is found change to color of game piece to current player 
  if (currentCell) {
    if (currPlayer === 1) {
      currentPlayerPiece = 'player-one-piece'
    } else {
      currentPlayerPiece = 'player-two-piece'
    }
    // grab the div element which is a child of the currentCell
    let playerPiece = currentCell.children[0];
    //change the color of the currentCell child div
    playerPiece.classList.remove('board-piece-light')
    playerPiece.classList.add(currentPlayerPiece)
    return true;
  } else {
    return false;
  }

}

/** endGame: announce game end */
function endGame(msg) {
  // alert message will show up on the big game board display
  mainDisplayText.textContent = msg
  winSounds.play();
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (gameOver) return;

  // check to see if what is being clicked is a button
  if (evt.target.tagName === 'BUTTON') {
  // get x from ID of clicked cell
    let x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    let y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    if (placeInTable(y, x)) {
      randSounds.play();

      // check for win
      if (checkForWin()) {
        return endGame(`Player ${currPlayer} won!`);
      }

        // check for draw
      if (board.every(row => row.every(cell => cell !==null))) {
        endGame('DRAW!!')
        gameOver = True;
      } 
      
      // switch players
      if (currPlayer === 1) {
        currPlayer = 2;
        currentPlayerDisplayed.textContent = `Player ${currPlayer}`;
      } else {
        currPlayer = 1;
        currentPlayerDisplayed.textContent = `Player ${currPlayer}`;
      }
      updatePlayerLights(currPlayer);
    }
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    // console.log('cells',cells.every(([x,y]) => console.log('test',[x,y])))
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // we are looping over a board array to see if the coordinates we specify match
  // current player. We are checking 4 pairs/arrays at a time
  // then we check if any of the conditions are true, and if true then there is a win 
  

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        gameOver = true;
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
