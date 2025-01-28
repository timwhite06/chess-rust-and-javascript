// game.js
import MoveLogic from './moveLogic.js';

export default class ChessGame {
  constructor(board) {
    this.board = board;
    this.currentTurn = 'white'; // Tracks whose turn it is
    this.moveLogic = new MoveLogic(this); // Pass ChessGame instance to MoveLogic
    this.moveHistory = []; // To log moves
  }

  setBoard(board) {
    this.board = board;
    this.moveLogic = new MoveLogic(this); // Initialize MoveLogic with this game instance
  }

  init() {
    this.board.render();
    console.log("Game initialized!");
  }

  switchTurn() {
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
    console.log(`It's now ${this.currentTurn}'s turn.`);
  }

  logMove(move) {
    this.moveHistory.push(move);
    const moveHistoryElement = document.getElementById('moveHistory');
    if (moveHistoryElement) {
      const moveItem = document.createElement('div');
      moveItem.innerText = move;
      moveHistoryElement.appendChild(moveItem);
    }
    console.log("Move logged:", move);
  }
}
