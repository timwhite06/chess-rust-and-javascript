export default class MoveLogic {
  constructor(game) {
    this.game = game; // Reference to ChessGame instance
    this.selectedPiece = null;
    this.selectedTargetCell = null;
    // Bind the method to ensure correct 'this' context
    this.handleCellClick = this.handleCellClick.bind(this);
  }

  handleCellClick(cell, board) {
    const { piece, location } = cell;
    console.log('handle cell click');

    // Handle piece selection
    if (piece && piece.type && piece.color && piece.imagePath) {
        // Select the piece
        this.selectedPiece = piece;
        this.selectedSourceCell = cell;
        console.log('Selected piece:', piece);
    } 
    // Handle the move
    else if (this.selectedPiece) {
        // Ensure the target cell does not have a piece of the same colour
        if (!cell.piece || cell.piece.color !== this.selectedPiece.color) {
            this.selectedTargetCell = cell;

            // Validate the move
            if (this.isValidMove(this.selectedSourceCell, this.selectedTargetCell)) {
                // Move the piece
                this.selectedTargetCell.piece = this.selectedPiece;
                this.selectedSourceCell.piece = { type: null, color: null, imagePath: null };

                // Create the move log data
              const moveData = {
                from: this.selectedSourceCell.location.notation,
                to: cell.location.notation,
                piece: this.selectedPiece
              };

              // Delegate logging to the ChessGame instance
              // You can either pass the move object or a JSON string, as needed
              this.game.logMove(moveData);


                // Clear the selection
                this.selectedPiece = null;
                this.selectedSourceCell = null;
                this.selectedTargetCell = null;

                // Re-render the board
                board.render();
            } else {
                console.log('Invalid move');
            }
        } else {
            console.log('Cannot move to a cell with a piece of the same color');
        }
    } else {
        console.log('No piece selected or invalid cell clicked');
    }
}


  isValidMove(currentCell, selectedTargetCell, ) {
    // Implement specific movement rules based on piece type
    const { type, color } = currentCell.piece;

    return true;

    // switch (type) {
    //   case "pawn":
    //     return this.isValidPawnMove(currentCell, selectedTargetCell, color);
    //   case "rook":
    //     return /*this.isValidRookMove(currentCell, selectedTargetCell);*/;
    //   // Add cases for other pieces
    //   default:
    //     return false;
    // }
  }

  isValidPawnMove(currentCell, selectedTargetCell, color) {
    const direction = color === "white" ? 1 : -1; // White moves up, black moves down
    const startRow = color === "white" ? 2 : 7; // Starting row for pawns
    const rowDifference = selectedTargetCell.location.nRow - currentCell.location.nRow;
    const colDifference = selectedTargetCell.location.columnIndex - currentCell.location.columnIndex;
  
    // Simple pawn move: one step forward
    if (colDifference === 0 && rowDifference === direction && !selectedTargetCell.piece) {
      return true;
    }
  
    // Initial two-step move from the starting row
    if (
      colDifference === 0 &&
      rowDifference === 2 * direction &&
      currentCell.location.nRow === startRow &&
      !selectedTargetCell.piece
    ) {
      return true;
    }
  
    // Pawn capture: one step diagonally forward to take an opponent's piece
    if (
      Math.abs(colDifference) === 1 &&
      rowDifference === direction &&
      selectedTargetCell.piece &&
      selectedTargetCell.piece.color !== color
    ) {
      return true;
    }
  
    // All other moves are invalid
    return false;
  }
  

  // Add more validation methods for other piece types
}
