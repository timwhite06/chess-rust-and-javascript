# Chess App

## Overview
This project is a web-based chess application with a JavaScript frontend and a Rust backend. The frontend displays the chessboard and handles the game logic, while the backend serves the JavaScript files via static HTML and stores all player games and moves in a PostgreSQL database.

## Frontend
- **Language:** JavaScript
- **Description:** The frontend is responsible for rendering the chessboard, handling user interactions, and implementing the game logic. It follows an object-oriented design.
- **Files:**
  - `index.html`: The main HTML file that includes the chessboard container.
  - `css/styles.css`: The stylesheet for the application.
  - `scripts/main.js`: The main JavaScript file that initializes the game.
  - `scripts/board.js`: Handles the chessboard rendering.
  - `scripts/game.js`: Manages the game state.
  - `scripts/moveLogic.js`: Contains the logic for validating and executing moves.
  - `scripts/piece.js`: Defines the `Piece` class.

## Backend
- **Language:** Rust
- **Description:** The backend is a web server that hosts the frontend files and interacts with a PostgreSQL database to store game data.
- **Database:** PostgreSQL
- **Functionality:**
  - Serves static HTML, CSS, and JavaScript files.
  - Supports WebSocket connections for real-time communication.
  - Stores player games and moves in the database.

## Libraries Used
The backend uses the following Rust libraries to provide functionality:

1. **Actix Web**
   - **Purpose:** A powerful, pragmatic, and extremely fast web framework for Rust.
   - **Usage in Project:** Used to handle HTTP routes and serve static files.
   - **Why Actix Web:** Its performance and ease of use make it ideal for building web servers and APIs.

2. **Actix RT**
   - **Purpose:** Actix runtime for running asynchronous tasks.
   - **Usage in Project:** Powers asynchronous operations, such as handling multiple HTTP requests and WebSocket connections concurrently.
   - **Why Actix RT:** It integrates seamlessly with Actix Web for async programming.

3. **Actix Web Actors**
   - **Purpose:** Provides support for WebSocket actors in Actix Web.
   - **Usage in Project:** Used to handle WebSocket connections for real-time communication.
   - **Why Actix Web Actors:** It allows easy integration of WebSocket support in Actix Web applications.

4. **Actix Files**
   - **Purpose:** Middleware for serving static files.
   - **Usage in Project:** Used to serve static files (HTML, CSS, JS) from a directory on the server.
   - **Why Actix Files:** It integrates seamlessly with Actix Web for static file serving.

5. **SQLx**
   - **Purpose:** A Rust library for interacting with databases.
   - **Usage in Project:** Used to connect to the PostgreSQL database and execute SQL queries for storing and retrieving game data.
   - **Why SQLx:** It supports async queries, has compile-time query validation, and integrates well with Rust.

6. **Tracing**
   - **Purpose:** A structured logging and diagnostics library for Rust.
   - **Usage in Project:** Provides detailed logs for debugging and monitoring application behavior.
   - **Why Tracing:** It enables rich, structured logs that help identify issues during development and production.

7. **Tracing Subscriber**
   - **Purpose:** A library that processes and outputs tracing data.
   - **Usage in Project:** Configures how logs are displayed in the application.
   - **Why Tracing Subscriber:** It works in tandem with tracing to provide a flexible logging setup.

## Why Async is Important
Asynchronous programming is crucial for this project because it allows the backend to handle multiple tasks concurrently without blocking the execution of other tasks. This is particularly important for:
- Handling multiple HTTP requests simultaneously, ensuring that the server remains responsive even under heavy load.
- Managing WebSocket connections for real-time communication between the frontend and backend.
- Performing database operations without blocking the main thread, which improves the overall performance and scalability of the application.

## Usage
- Open the application in a web browser.
- Play chess by interacting with the chessboard.
- The backend will store all game data in the PostgreSQL database.

## License
This project is licensed under the MIT License.