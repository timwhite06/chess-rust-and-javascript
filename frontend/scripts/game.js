/**
 * Manages the overall game state, move history, turn switching, and communication with the backend.
 * Responsible for logging moves as part of its state management.
 */
import MoveLogic from './moveLogic.js';

export default class ChessGame {
  constructor(sendMessageToBackend) {
    this.board = null;
    this.currentTurn = 'white';
    this.moveHistory = [];
    this.sendMessageToBackend = sendMessageToBackend;
    
    // Inject this game instance into MoveLogic
    this.moveLogic = new MoveLogic(this);
  }

  setBoard(board) {
    this.board = board;
    this.moveLogic = new MoveLogic(this);
  }

  init() {
    this.board.render();
  }

  switchTurn() {
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
    console.log(`It's now ${this.currentTurn}'s turn.`);
  }

  logMove(move) {
    // Store the move
    this.moveHistory.push(move);
    
    const query = new URLSearchParams(window.location.search);

    // Grab the game ID
    let gameId;
    if (query.has('game')) {
      gameId = query.get('game');
      move.gameUrlId = gameId;
    }
    
    // Set the type of message to be sent to the backend
    move.messageType = "logMove"

    console.log(move);
    // Send the move to the backend

    this.sendMessageToBackend(move);
  }
}
