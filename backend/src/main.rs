use actix_files as fs; // For serving static files
use actix_web::{get, App, HttpResponse, HttpServer, Responder};

/// Simple HTTP endpoint at "/api"
#[get("/api")]
async fn api_endpoint() -> impl Responder {
    HttpResponse::Ok().body("Hello from Actix API!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Attempt to bind and run the server
    let server_result = HttpServer::new(move || {
        App::new()
            .service(
                fs::Files::new("/", "../frontend")
                    .index_file("index.html") // Serve index.html by default
            )
    })
    .bind(("127.0.0.1", 3000));

    match server_result {
        Ok(server) => {
            println!("\x1b[32mServer running on http://127.0.0.1:3000\x1b[0m");
            server.run().await
        }
        Err(e) => {
            eprintln!("\x1b[31mFailed to start server: {}\x1b[0m", e); // Print error in red
            Err(e)
        }
    }
}
