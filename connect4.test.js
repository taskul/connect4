describe('Setting game up', () => {
    beforeEach(() => {
        makeBoard()
    })
    it('makeBoard() should create array of 6 arrays with 7 items of null', () => {
        // checking if coordinate at indexes [5][6] is set to null
        expect(board[5][6] === null).toEqual(true);
    })
    it('makeHtmlBoard() should add new table cells to top row and rows below', () => {
        // checking if the top row was created for the game
        expect(htmlBoard.children[0].id).toEqual('column-top')
        // checking if the length of top row is 7 items long.
        expect(htmlBoard.children[0].children.length).toEqual(7)
        // locating if cell was created in bottom right corrner
        expect(htmlBoard.children[6].children[6].id).toEqual('5-6')
    })
    afterEach(() => {
        board.splice(0, board.length)
    })
})

describe('check game scoring', () => {
    beforeEach(() => {
        board.splice(0, board.length)
    })

    it('placeInTable() should return true when given correct coordinates', () => {
        expect(placeInTable(5,6)).toEqual(true)
    })
    it('placeInTable() should return false when given wrong coordinates', () => {
        expect(placeInTable(6,7)).toEqual(false)
    })

    it('checkForWin() should work', () => {
        makeBoard()
        board[4][0]=1
        board[4][1]=1
        board[4][2]=1
        board[4][3]=1
        
        expect(checkForWin()).toEqual(true);
    })

    it('check for draw', () =>{
        // set all board array items to 1
        for (let row = 0; row < HEIGHT; row++) {
            const newRow = [];
            for (let col = 0; col < WIDTH; col++) {
              newRow.push(1);
            }
            board.push(newRow);
          }
        // checking to make sure every item in the board array is either 1 or 2
        expect(board.every(row => row.every(cell => cell !==null))).toEqual(true)
    })
    
    afterEach(() => {
        board.splice(0, board.length)
        resetGameBoard()
    })
})