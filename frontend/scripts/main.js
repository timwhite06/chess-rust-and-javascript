import Board from './board.js';
import ChessGame from './game.js';

window.addEventListener('DOMContentLoaded', () => {
  // A simple router function that reads the URL and loads the corresponding view.
  function router() {
    const query = new URLSearchParams(window.location.search);

    // If a game id is present in the URL, load the game view.
    if (query.has('game')) {
      const gameId = query.get('game');
      loadGameView(gameId);
    }
    // If the view is set to "history", load the history view.
    else if (query.has('view') && query.get('view') === 'history') {
      loadHistoryView();
    }
    // Otherwise, load the home view.
    else {
      renderHome();
    }
  }

  // Render the home view with the two main buttons.
  function renderHome() {
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.innerHTML = `
      <h1>Chess App</h1>
      <button id="newGameBtn">Create New Game</button>
      <button id="viewGamesBtn">View Previous Games</button>
    `;

    document.getElementById('newGameBtn').addEventListener('click', () => {
      // Generate a new game id.
      const gameId = Date.now();
      // Push the new URL with the game query parameter.
      history.pushState({ gameId }, '', '/frontend/?game=' + gameId);
      // Load the game view.
      loadGameView(gameId);
    });

    document.getElementById('viewGamesBtn').addEventListener('click', () => {
      history.pushState({ view: 'history' }, '', '/?view=history');
      loadHistoryView();
    });
  }

  // Load the game view, reusing your chess logic.
  function loadGameView(gameId) {
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.innerHTML = `
      <div id="gameHeader">
        <h2>Chess Game: ${gameId}</h2>
        <button id="backBtn">Back</button>
      </div>
      <div id="gameContent">
        <div id="turnIndicator">Turn: ?</div>
        <div id="chessboard"></div>
        <div id="moveHistory"></div>
        <button id="sendBtn">Send Message</button>
        <button id="disconnectBtn">Disconnect</button>
      </div>
    `;

    // Initialize your WebSocket worker and chess game logic here.
    const boardElement = document.getElementById('chessboard');
    const socketWorker = new Worker('./workers/websocketWorker.js', { type: 'module' });

    // Listen for messages from the worker.
    socketWorker.addEventListener('message', (event) => {
      const { type, data } = event.data;
      if (type === "status") {
        console.log("Worker status:", data);
      } else if (type === "message") {
        console.log("Message from server via worker:", data);
      } else if (type === "error") {
        console.error("Worker error:", data);
      }
    });

    // Function to send a message via the worker.
    function sendMessageToBackend(payload) {
      socketWorker.postMessage({
        action: "send",
        payload: { message: payload }
      });
    }

    function closeConnection() {
      socketWorker.postMessage({ action: "close" });
    }

    const game = new ChessGame(sendMessageToBackend);
    const board = new Board(boardElement, game);
    game.board = board;
    board.render();
    game.init();

    // Bind to buttons.
    document.getElementById("sendBtn")?.addEventListener("click", () => sendMessageToBackend("Hello from game view!"));
    document.getElementById("disconnectBtn")?.addEventListener("click", closeConnection);
    document.getElementById("backBtn")?.addEventListener("click", () => {
      history.pushState({}, '', '/');
      renderHome();
    });
  }

  // Load a simple history view.
  function loadHistoryView() {
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.innerHTML = `
      <h2>Previous Games</h2>
      <p>List of previous games goes here...</p>
      <button id="backBtn">Back</button>
    `;
    document.getElementById('backBtn').addEventListener('click', () => {
      history.pushState({}, '', '/');
      renderHome();
    });
  }

  // Listen for popstate events to handle browser navigation (back/forward buttons).
  window.addEventListener('popstate', router);

  // Initialize the router.
  router();
});
