mod websocket;
mod database_handler;

use std::sync::Arc; // Import Arc for shared ownership.
use crate::database_handler::DatabaseHandler; // Import DatabaseHandler.
use actix_files as fs;
use actix_web::{get, web, App, HttpResponse, HttpServer};

#[get("/api")]
async fn api_endpoint() -> impl actix_web::Responder {
    HttpResponse::Ok().body("Hello from Actix API!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Read the database URL from an environment variable (or use a default)
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://user:password@localhost/dbname".to_string());
    
    // Initialize the database handler.
    let db_handler = Arc::new(DatabaseHandler::new(&database_url).await);

    let server_result = HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db_handler.clone()))
            .service(api_endpoint)
            .route("/ws", web::get().to(websocket::websocket_handler)) // WebSocket route
            .service(
                fs::Files::new("/", "../frontend")
                    .index_file("index.html") 
            )
    })
    .bind(("127.0.0.1", 3000));

    match server_result {
        Ok(server) => {
            println!("\x1b[32mServer running on http://127.0.0.1:3000\x1b[0m");
            server.run().await
        }
        Err(e) => {
            eprintln!("\x1b[31mFailed to start server: {}\x1b[0m", e);
            Err(e)
        }
    }
}
