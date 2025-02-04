# Chess App

This project is a web-based chess application with a **JavaScript frontend** and a **Rust backend**. The frontend displays the chessboard and handles game logic, while the backend serves JavaScript files via static HTML and stores all player games and moves in a **PostgreSQL** database.

---
## 📌 Clone the Repository
```bash
git clone git@github.com:timwhite06/chess-rust-and-javascript.git
cd chess-rust-and-javascript
```

---
## 🔧 Setup Instructions

### ✅ Prerequisites

#### 1️⃣ **Docker Desktop**  
Install [Docker Desktop](https://www.docker.com/products/docker-desktop) and ensure it is running in **Linux container mode** (right-click the Docker icon in the system tray and select *"Switch to Linux containers..."* if needed).

#### 2️⃣ **Node.js & npm**  
Install [Node.js](https://nodejs.org/) (which includes npm) for managing frontend dependencies.

#### 3️⃣ **Rust Toolchain**  
Install Rust via [rustup](https://rustup.rs/).

#### 4️⃣ **SQLx CLI**  
To run database migrations using SQLx, install the CLI:
```bash
cargo install sqlx-cli --no-default-features --features postgres
```

---

## Setting Up DBeaver for PostgreSQL

This guide will walk you through the process of setting up DBeaver to connect to your PostgreSQL database for the project.

### 1. Download and Install DBeaver

- **Download:**  
  Visit the [DBeaver Community Edition website](https://dbeaver.io/download/) and download the installer for your operating system.

- **Install:**  
  Follow the installation instructions specific to your OS.

### 2. Create a New PostgreSQL Connection

1. **Open DBeaver.**

2. **Start a New Connection:**  
   - Click on **Database** in the menu and select **New Database Connection**.  
   - Alternatively, click the **New Connection** button in the toolbar.

3. **Select Database Type:**  
   - In the "Connect to a database" dialog, scroll through the list and select **PostgreSQL**.
   - Click **Next**.

### 3. Configure Connection Settings

You need to provide the correct JDBC URL and credentials to connect to your database.

#### Option A: Use the Connection Fields

- **Host:** `localhost`  
- **Port:** `5432`  
- **Database:** `chess-rust-javascript`  
- **Username:** `admin`  
- **Password:** `admin`

DBeaver will automatically construct the JDBC URL for you when these fields are filled out.

#### Option B: Use a Custom JDBC URL

If you prefer to use a JDBC URL, use the following format:
```
jdbc:postgresql://localhost:5432/chess-rust-javascript?user=admin&password=admin
```
- Enter this URL into the **URL** field.
- You can leave the username and password fields blank if they are specified in the URL, or fill them in as above.

### 4. Test the Connection

- Click the **Test Connection** button.
- If prompted for a driver download, allow DBeaver to download the PostgreSQL JDBC driver.
- You should see a message indicating the connection was successful.

### 5. Finish and Save the Connection

- Once the connection test is successful, click **Finish**.
- Your new connection will appear in the **Database Navigator** panel on the left.

### 6. Refresh the Schema and Verify Tables

- **Refresh:**  
  Right-click on your connection or the `public` schema and choose **Refresh** or **Reload**.

- **Verify Tables:**  
  Open an SQL Editor in DBeaver and run:
  ```sql
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public';

---
## 🚀 Running the Project

### 1️⃣ Start the Database
Ensure Docker is running, then execute:
<!-- ```bash
npm run docker:up
``` -->

Verify database connection:

```bash
docker exec -it $(docker ps -q -f name=postgres) psql -U admin -d chess-rust-javascript -c "\dt"
```


**Expected Output:**

List of relations
```
Schema |  Name  | Type  | Owner
-------+--------+-------+-------
public | games  | table | admin
public | moves  | table | admin
(2 rows)
```
If tables are missing, proceed with migrations.

---
### 2️⃣ Run Database Migrations
Ensure `DATABASE_URL` is set:
```bash
export DATABASE_URL="postgres://admin:admin@localhost:5432/chess-rust-javascript"
```
For Windows PowerShell:
```powershell
$env:DATABASE_URL="postgres://admin:admin@localhost:5432/chess-rust-javascript"
```
Run migrations:
```bash
sqlx migrate run
```
Verify migrations:
```bash
sqlx migrate info
```

---
### 3️⃣ Build the Backend
```bash
npm run build:backend
```

### 4️⃣ Run the Project
```bash
npm run serve
```

---
## 🏗️ Project Structure

### 🎨 Frontend
- **Language:** JavaScript
- **Description:** Handles rendering the chessboard, user interactions, and game logic.
- **Key Files:**
  - `index.html` – Main HTML file with the chessboard container.
  - `css/styles.css` – Stylesheet for UI.
  - `scripts/main.js` – Initializes the game.
  - `scripts/board.js` – Manages chessboard rendering.
  - `scripts/game.js` – Controls game state.
  - `scripts/moveLogic.js` – Implements move validation and execution.
  - `scripts/piece.js` – Defines chess pieces.

### 🔧 Backend
- **Language:** Rust
- **Database:** PostgreSQL
- **Features:**
  - Serves static files (HTML, CSS, JS).
  - Supports WebSockets for real-time communication.
  - Stores games and moves in the database.

---
## 📚 Rust Libraries Used

### 🚀 Actix Web
- **Purpose:** Fast web framework for handling HTTP requests.
- **Usage:** Serves frontend files and API routes.

### ⚡ Actix RT
- **Purpose:** Async runtime for handling multiple tasks.
- **Usage:** Runs non-blocking operations like WebSockets and database queries.

### 🔄 Actix Web Actors
- **Purpose:** Enables WebSocket connections.
- **Usage:** Handles real-time chess game updates.

### 📂 Actix Files
- **Purpose:** Middleware for serving static files.
- **Usage:** Serves frontend files efficiently.

### 🗄️ SQLx
- **Purpose:** Async SQL library for Rust.
- **Usage:** Executes database queries and migrations.

### 📊 Tracing & Tracing Subscriber
- **Purpose:** Structured logging and diagnostics.
- **Usage:** Logs application activity for debugging and monitoring.

---
## 🔄 Why Async is Important?
Asynchronous programming improves performance by allowing the backend to handle:
✅ Multiple HTTP requests concurrently.  
✅ WebSocket connections for real-time communication.  
✅ Database operations without blocking execution.

---
## 🎮 Usage
- Open the application in a web browser.
- Play chess by interacting with the chessboard.
- The backend stores all game data in PostgreSQL.

---
## 📜 License
This project is licensed under the **MIT License**.
