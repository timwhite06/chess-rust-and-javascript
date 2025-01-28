import MoveLogic from './moveLogic.js';

// Export the Board class so that we can setup the board in main.js
export default class Board {
  constructor(boardElement, game) {
    this.boardElement = boardElement;
    // Initialise the board by calling createBoard method.
    this.board = this.createBoard();
    // Initialise the pieces on the board by calling setupPieces method.
    this.setup = this.setupPieces();
    // Make an instance of the MoveLogic class to handle the movement of the pieces.
    this.game = game;
    this.moveLogic = new MoveLogic(this.game);
  }

  createBoard() {
    const associatedNotation = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const board = [];
    // row
    for (let row = 0; row < 8; row++) {
      board.push([]);
      // column
      for (let column = 0; column < 8; column++) {
        /**
         * The associated notation is equal to as saying the column number is the letter of the alphabet
         * and then the row is the number that follows it.
         * So if it is column 0 and row 3, it is a3.
         * ! POINT TO NOTE:
         * We start from the bottom and then go up. So we reverse() it in the render() method.
         */
        board[row].push({
          location: {
            notation: `${associatedNotation[column]}${row + 1}`,
            nColumn: associatedNotation[column],
            nRow: row + 1,
            rowIndex: row,
            columnIndex: column
          },
          piece: { type: null, color: null, imagePath: null }
        });
      }
    }
    // Reverse the board so that it starts from the bottom - a1 is at the bottom of the grid.
    return board.reverse();;
  }

  setupPieces() {
    // Place pieces on the board to start the game
    const whitePiecesImageLocation = 'assets/images/white/';
    const blackPiecesImageLocation = 'assets/images/black/';
  
    // White pieces setup
    this.board[7].forEach((cell, colIndex) => {
      switch (colIndex) {
        case 0:
        case 7:
          cell.piece = { type: 'rook', color: 'white', imagePath: `${whitePiecesImageLocation}rook.png` };
          break;
        case 1:
        case 6:
          cell.piece = { type: 'knight', color: 'white', imagePath: `${whitePiecesImageLocation}knight.png` };
          break;
        case 2:
        case 5:
          cell.piece = { type: 'bishop', color: 'white', imagePath: `${whitePiecesImageLocation}bishop.png` };
          break;
        case 3:
          cell.piece = { type: 'queen', color: 'white', imagePath: `${whitePiecesImageLocation}queen.png` };
          break;
        case 4:
          cell.piece = { type: 'king', color: 'white', imagePath: `${whitePiecesImageLocation}king.png` };
          break;
      }
    });
  
    this.board[6].forEach((cell) => {
      cell.piece = { type: 'pawn', color: 'white', imagePath: `${whitePiecesImageLocation}pawn.png` };
    });
  
    // Black pieces setup
    this.board[0].forEach((cell, colIndex) => {
      switch (colIndex) {
        case 0:
        case 7:
          cell.piece = { type: 'rook', color: 'black', imagePath: `${blackPiecesImageLocation}rook.png` };
          break;
        case 1:
        case 6:
          cell.piece = { type: 'knight', color: 'black', imagePath: `${blackPiecesImageLocation}knight.png` };
          break;
        case 2:
        case 5:
          cell.piece = { type: 'bishop', color: 'black', imagePath: `${blackPiecesImageLocation}bishop.png` };
          break;
        case 3:
          cell.piece = { type: 'queen', color: 'black', imagePath: `${blackPiecesImageLocation}queen.png` };
          break;
        case 4:
          cell.piece = { type: 'king', color: 'black', imagePath: `${blackPiecesImageLocation}king.png` };
          break;
      }
    });
  
    this.board[1].forEach((cell) => {
      cell.piece = { type: 'pawn', color: 'black', imagePath: `${blackPiecesImageLocation}pawn.png` };
    });
  }
  

  // TODO: Add event listeners to each cell to handle piece movement

  render() {
    this.boardElement.innerHTML = '';
    // Reverse the board so that it starts from the bottom - a1 is at the bottom of the grid.
    // Only on the first render.
    if(this.initialRender === 0) {
      this.board.reverse();
      this.initialRender++;
    }
    
    this.board.forEach((row, i) => {
      row.forEach((cellData, j) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.innerText = `${cellData.location.notation}`;
        // If the sum of the row and column is even, the cell is white, otherwise it is black
        if ((i + j) % 2 === 0) {
          cell.classList.add('white');
        } else {
          cell.classList.add('black');
        }

        // If the cell is the first of the notations that add and absolute text to it to label the board.
        if (i === 7) { // 7 because we reversed the board.
          const notation = document.createElement('div');
          notation.classList.add('notationBoardLabel-COLUMN');
          notation.innerText = `${cellData.location.nColumn}`;
          cell.appendChild(notation);
        }
        if (j === 0) {
          const notation = document.createElement('div');
          notation.classList.add('notationBoardLabel-ROW');
          notation.innerText = `${cellData.location.nRow}`;
          cell.appendChild(notation);
        }

        if (cellData.piece.type && cellData.piece.color && cellData.piece.imagePath) {
          const piece = document.createElement('img');
          piece.src = cellData.piece.imagePath;
          piece.alt = `${cellData.piece.color} ${cellData.piece.type}`;
          piece.classList.add('piece');
          piece.classList.add('piece-hover'); // apply the hover effect
          cell.appendChild(piece);
        }


         // Highlight selected cell
         if (this.game?.moveLogic?.selectedCell === cell) {
          cellElement.classList.add('selected');
        }

        // TODO: Highlight valid move cells
        if (this.game?.moveLogic?.validMoves?.includes(cell)) {
          cellElement.classList.add('valid-move');
        }

         // Add click event listener for move logic
         cell.addEventListener('click', () => {
          this.moveLogic.handleCellClick(cellData, this);
        });

        this.boardElement.appendChild(cell);
      });
    });
  }
}