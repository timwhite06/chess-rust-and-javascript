use actix::{Actor, StreamHandler};
use actix_web::{web, Error, HttpRequest, HttpResponse};
use actix_web_actors::ws;
use std::sync::Arc;
use std::time::Instant;
use serde_json::Value;

// Import the database handler.
use crate::database_handler::DatabaseHandler;

/// WebSocket session struct with a database handler.
pub struct WebSocketSession {
    pub hb: Instant,
    pub db: Arc<DatabaseHandler>,
}

impl Actor for WebSocketSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb = Instant::now();
        ctx.text("Connected to WebSocket server");
    }
}

// Use the fully-qualified standard Result here to avoid conflicts.
impl StreamHandler<std::result::Result<ws::Message, ws::ProtocolError>> for WebSocketSession {
    fn handle(&mut self, msg: std::result::Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                // Parse the JSON text.
                match serde_json::from_str::<Value>(&text) {
                    Ok(json_val) => {
                        println!("Received: {:?}", json_val);
                        // Check for the "logMove" message type.
                        if json_val["message"]["messageType"] == "logMove" {
                            println!("Received logMove message");

                            // Extract move details from the JSON and convert them to owned strings.
                            let game_url_id = json_val["gameUrlId"]
                                .as_str()
                                .unwrap_or("default_game")
                                .to_string();
                            let move_from = json_val["message"]["from"]
                                .as_str()
                                .unwrap_or("")
                                .to_string();
                            let move_to = json_val["message"]["to"]
                                .as_str()
                                .unwrap_or("")
                                .to_string();
                            let piece_color = json_val["message"]["piece"]["color"]
                                .as_str()
                                .unwrap_or("")
                                .to_string();
                            let piece_id = json_val["message"]["piece"]["id"]
                                .as_str()
                                .unwrap_or("")
                                .to_string();
                            let piece_image_path = json_val["message"]["piece"]["imagePath"]
                                .as_str()
                                .unwrap_or("")
                                .to_string();
                            let piece_type = json_val["message"]["piece"]["type"]
                                .as_str()
                                .unwrap_or("")
                                .to_string();

                            // Spawn an asynchronous task to log the move.
                            let db = Arc::clone(&self.db);
                            actix::spawn(async move {
                                if let Err(e) = db
                                    .log_move(
                                        &game_url_id,
                                        &move_from,
                                        &move_to,
                                        &piece_color,
                                        &piece_id,
                                        &piece_image_path,
                                        &piece_type,
                                    )
                                    .await
                                {
                                    println!("Error logging move: {:?}", e);
                                } else {
                                    println!("Move logged successfully.");
                                }
                            });
                        }
                    }
                    Err(e) => println!("Error parsing JSON: {:?}", e),
                }
                // Send an echo message back to the client.
                ctx.text(format!("Echo: {}", text));
            }
            Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
            Ok(ws::Message::Ping(msg)) => ctx.pong(&msg),
            Ok(ws::Message::Close(_)) => println!("WebSocket closed"),
            _ => (),
        }
    }
}

/// WebSocket route handler function.
/// We assume that the DatabaseHandler is registered as shared data.
pub async fn websocket_handler(
    req: HttpRequest,
    stream: web::Payload,
) -> std::result::Result<HttpResponse, Error> {
    // Extract the database handler from the shared application state.
    let db_data = req
        .app_data::<web::Data<Arc<DatabaseHandler>>>()
        .expect("Database handler not configured")
        .get_ref()
        .clone();

    ws::start(
        WebSocketSession {
            hb: Instant::now(),
            db: db_data,
        },
        &req,
        stream,
    )
}
