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

// Create the Web Worker
const worker = new Worker('../workers/websocketWorker.js');

// Listen for messages from the worker
worker.onmessage = (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'connected':
      console.log('WebSocket connected');
      break;

    case 'message':
      const data = JSON.parse(payload);
      console.log('Message from server:', data);
      // Update your chess UI or game state here
      break;

    case 'disconnected':
      console.log('WebSocket disconnected');
      break;

    case 'error':
      console.error('WebSocket error:', payload);
      break;

    default:
      console.error('Unknown message type:', type);
  }
};

// Connect to the WebSocket server
worker.postMessage({ type: 'connect', payload: { url: 'ws://localhost:3000/ws' } });

// Send a message to the WebSocket server
function sendMove(move) {
  worker.postMessage({ type: 'send', payload: { move } });
}

// Example: Disconnect from the WebSocket server
function disconnect() {
  worker.postMessage({ type: 'disconnect' });
}

