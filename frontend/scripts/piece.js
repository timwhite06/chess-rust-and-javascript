// Export a base Piece class (could also do named exports)
export default class Piece {
    constructor(type, color, position) {
      this.type = type;     // e.g. "pawn", "rook", "knight", etc.
      this.color = color;   // "white" or "black"
      this.position = position; // e.g. { row: 1, col: 0 }
    }
  
    // Common methods for all pieces
  }
  