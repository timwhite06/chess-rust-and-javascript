-- Add migration script here
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    game_url_id TEXT UNIQUE NOT NULL
);

CREATE TABLE moves (
    id SERIAL PRIMARY KEY,
    game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    move_from TEXT NOT NULL,
    move_to TEXT NOT NULL,
    piece_color TEXT NOT NULL,
    piece_id TEXT NOT NULL,
    piece_image_path TEXT NOT NULL,
    piece_type TEXT NOT NULL
);
