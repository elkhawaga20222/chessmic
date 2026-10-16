// TypeScript declarations for chess.js loaded from CDN (window.Chess)

export interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
  flags?: string;
  piece?: string;
  color?: 'w' | 'b';
  san?: string;
  captured?: string;
}

interface ChessMoveOptions {
  verbose?: boolean;
  square?: string;
}

interface ChessSquare {
  type: string;
  color: 'w' | 'b';
}

export interface ChessConstructor {
  new (fen?: string): ChessInstance;
}

export interface ChessInstance {
  move(move: string | ChessMove): ChessMove | null;
  undo(): ChessMove | null;
  fen(): string;
  load(fen: string): void;
  reset(): void;
  game_over(): boolean;
  in_check(): boolean;
  in_checkmate(): boolean;
  in_stalemate(): boolean;
  in_draw(): boolean;
  in_threefold_repetition(): boolean;
  insufficient_material(): boolean;
  turns(): number;
  move_number(): number;
  history(opts?: ChessMoveOptions): string[] | ChessMove[];
  get(square: string): ChessSquare | null | false;
  put(piece: ChessSquare, square: string): boolean;
  remove(square: string): void;
  moves(opts?: ChessMoveOptions): string[] | ChessMove[];
  square_color(square: string): 'light' | 'dark' | null;
  board(): (ChessSquare | null)[][];
  turn(): 'w' | 'b';
  ascii(): string;
}

declare global {
  interface Window {
    Chess?: ChessConstructor;
    chessjs?: ChessConstructor;
    ChessJS?: ChessConstructor;
  }
}
