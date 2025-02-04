// Create a WebSocket connection
const socket = new WebSocket("ws://127.0.0.1:3000/ws");

// Listen for the connection open event
socket.addEventListener("open", () => {
  // Inform the main thread
  postMessage({ type: "status", data: "Connected to WebSocket server!" });
  // Optionally send an initial message
  socket.send(JSON.stringify({ message: "Hello, server!" }));
});

// Listen for messages from the WebSocket server
socket.addEventListener("message", (event) => {
  postMessage({ type: "message", data: event.data });
});

// Listen for the connection close event
socket.addEventListener("close", () => {
  postMessage({ type: "status", data: "Disconnected from WebSocket server." });
});

// Listen for WebSocket errors
socket.addEventListener("error", (error) => {
  postMessage({ type: "error", data: error });
});

// Listen for messages from the main thread
self.addEventListener("message", (event) => {
  const { action, payload } = event.data;
  
  if (action === "send") {
    // Send a message through the WebSocket if it's open
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    } else {
      postMessage({ type: "error", data: "WebSocket is not open." });
    }
  } else if (action === "close") {
    // Optionally send a close notification then close the socket
    socket.send(JSON.stringify({ action: "close" }));
    socket.close();
  }
});