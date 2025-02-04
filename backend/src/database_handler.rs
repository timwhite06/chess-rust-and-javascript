// IMPORTANT: Before building, either set DATABASE_URL or run `cargo sqlx prepare`.

use sqlx::{PgPool, postgres::PgPoolOptions};

#[derive(Clone)]
pub struct DatabaseHandler {
    pub pool: PgPool,
}

impl DatabaseHandler {
    /// Creates a new database handler with a connection pool.
    pub async fn new(database_url: &str) -> Self {
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(database_url)
            .await
            .expect("Failed to connect to Postgres");

        DatabaseHandler { pool }
    }

    /// Logs a move into the database.
    ///
    /// This method:
    /// 1. Inserts a game record with the given game_url_id if it doesn't already exist.
    /// 2. Retrieves the game's numeric id.
    /// 3. Inserts the move into the moves table.
    pub async fn log_move(
        &self,
        game_url_id: &str,
        move_from: &str,
        move_to: &str,
        piece_color: &str,
        piece_id: &str,
        piece_image_path: &str,
        piece_type: &str,
    ) -> Result<(), sqlx::Error> {
        // Insert the game if it doesn't exist.
        sqlx::query!(
            "INSERT INTO games (game_url_id) VALUES ($1) ON CONFLICT (game_url_id) DO NOTHING",
            game_url_id
        )
        .execute(&self.pool)
        .await?;

        // Retrieve the game's id.
        let game = sqlx::query!("SELECT id FROM games WHERE game_url_id = $1", game_url_id)
            .fetch_one(&self.pool)
            .await?;
        let game_id = game.id;

        // Insert the move.
        sqlx::query!(
            "INSERT INTO moves (game_id, move_from, move_to, piece_color, piece_id, piece_image_path, piece_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7)",
            game_id,
            move_from,
            move_to,
            piece_color,
            piece_id,
            piece_image_path,
            piece_type
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }
}
