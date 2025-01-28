// main.js
import Board from './board.js';
import ChessGame from './game.js';

window.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.getElementById('chessboard');
  const game = new ChessGame(); // Temporarily pass null
  const board = new Board(boardElement, game); // Now pass ChessGame instance
  game.board = board; // Set the board reference in ChessGame
  board.render();
  game.init();
  console.log('Chess game initialized!');
});
