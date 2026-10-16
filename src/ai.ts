import type { ChessInstance, ChessMove, ChessConstructor } from './chess';
import { PIECE_VALUES, PIECE_TABLES } from './constants';

const OPENING_MOVES = ['e7e5', 'd7d5', 'g8f6', 'b8c6', 'e7e6', 'c7c5'];

function getGame(): ChessConstructor {
  if (typeof window === 'undefined') throw new Error('window not available');
  if (window.Chess) return window.Chess;
  if (window.chessjs) return window.chessjs;
  if (window.ChessJS) return window.ChessJS;
  throw new Error('chess.js not loaded');
}

export function createGame(fen?: string): ChessInstance {
  const ChessCtor = getGame();
  return new ChessCtor(fen);
}

function evaluateBoard(game: ChessInstance): number {
  const board = game.board();
  let score = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      const baseValue = PIECE_VALUES[piece.type] || 0;
      const table = PIECE_TABLES[piece.type];
      const isWhite = piece.color === 'w';
      const index = isWhite ? (7 - row) * 8 + col : row * 8 + col;
      const positional = table ? table[index] : 0;
      const total = baseValue + positional;
      score += isWhite ? total : -total;
    }
  }
  return score;
}

function minimax(
  game: ChessInstance,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.game_over()) {
    return evaluateBoard(game);
  }

  const moves = game.moves({ verbose: true }) as ChessMove[];
  if (isMaximizing) {
    let best = -Infinity;
    for (const move of moves) {
      game.move(move);
      const score = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      game.move(move);
      const score = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export function getBestMove(game: ChessInstance): ChessMove | null {
  const moves = game.moves({ verbose: true }) as ChessMove[];
  if (moves.length === 0) return null;

  // Opening book: first move by Black
  if (game.history().length === 0) {
    for (const pref of OPENING_MOVES) {
      const match = moves.find(
        (m) => m.from + m.to === pref || (m.from + m.to + 'q') === pref
      );
      if (match) return match;
    }
  }

  let bestMove: ChessMove = moves[0];
  let bestScore = Infinity;

  // Shuffle moves for variety
  const shuffled = [...moves].sort(() => Math.random() - 0.5);

  try {
    for (const move of shuffled) {
      game.move(move);
      const score = minimax(game, 1, -Infinity, Infinity, true);
      game.undo();
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  } catch (err) {
    console.error('[Chessmic] getBestMove minimax error:', err);
    // Ensure any partially-applied move is undone
    try { game.undo(); } catch { /* noop */ }
    // Fall back to a random legal move
    return shuffled[Math.floor(Math.random() * shuffled.length)];
  }

  return bestMove;
}
