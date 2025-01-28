let ws;

onmessage = (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'connect':
      ws = new WebSocket(payload.url);

      ws.onopen = () => {
        postMessage({ type: 'connected' });
      };

      ws.onmessage = (messageEvent) => {
        postMessage({ type: 'message', payload: messageEvent.data });
      };

      ws.onclose = () => {
        postMessage({ type: 'disconnected' });
      };

      ws.onerror = (error) => {
        postMessage({ type: 'error', payload: error });
      };
      break;

    case 'send':
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
      } else {
        postMessage({ type: 'error', payload: 'WebSocket is not connected' });
      }
      break;

    case 'disconnect':
      if (ws) {
        ws.close();
      }
      break;

    default:
      postMessage({ type: 'error', payload: 'Unknown command' });
  }
};
