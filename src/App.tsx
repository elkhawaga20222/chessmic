import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChessInstance, ChessMove } from './chess';
import { createGame, getBestMove } from './ai';
import {
  playMoveSound,
  playCaptureSound,
  playCheckSound,
  playGameOverSound,
  setMuted,
} from './sound';
import Header from '@/components/Header';
import ChessBoard from '@/components/ChessBoard';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import GameOverModal, { ShareModal } from '@/components/Modals';
import { useGameStats } from '@/hooks/useGameStats';

function findKingSquare(game: ChessInstance, color: 'w' | 'b'): string | null {
  const board = game.board();
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const p = board[row][col];
      if (p && p.type === 'k' && p.color === color) {
        const file = String.fromCharCode(97 + col);
        const rank = 8 - row;
        return file + rank;
      }
    }
  }
  return null;
}

export default function App() {
  const [game, setGame] = useState<ChessInstance>(() => createGame());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<ChessMove[]>([]);
  const [lastMove, setLastMove] = useState<ChessMove | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [gameOverModal, setGameOverModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [shareText, setShareText] = useState('');
  const [history, setHistory] = useState<ChessMove[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [gameOverInfo, setGameOverInfo] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [statsVersion, setStatsVersion] = useState(0);

  const { stats, recordWin, recordLoss, recordDraw } = useGameStats();
  const statsRecorded = useRef(false);

  const turn = game.turn();
  const inCheck = game.in_check() && !game.game_over();
  const checkSquare = inCheck ? findKingSquare(game, turn) : null;
  const moveCount = Math.ceil(game.history().length / 2);

  // Stats recording guard
  useEffect(() => {
    if (game.game_over() && !statsRecorded.current) {
      statsRecorded.current = true;
      if (game.in_checkmate()) {
        if (turn === 'b') {
          recordWin();
        } else {
          recordLoss();
        }
      } else {
        recordDraw();
      }
      setStatsVersion((v) => v + 1);
    }
  }, [game, turn, recordWin, recordLoss, recordDraw]);

  // Game over detection
  useEffect(() => {
    if (game.game_over()) {
      let title = 'Draw!';
      let description = '';

      if (game.in_checkmate()) {
        if (turn === 'b') {
          title = 'Checkmate!';
          description = `Victory! You won in ${moveCount} moves.`;
        } else {
          title = 'Checkmate!';
          description = `The AI won in ${moveCount} moves.`;
        }
      } else if (game.in_stalemate()) {
        title = 'Stalemate!';
        description = `The game ended in a stalemate after ${moveCount} moves.`;
      } else if (game.in_draw()) {
        title = 'Draw!';
        description = `The game ended in a draw after ${moveCount} moves.`;
      }

      setGameOverInfo({ title, description });
      setGameOverModal(true);
      playGameOverSound();
    }
  }, [game, turn, moveCount]);

  // AI move — triggered whenever the game state changes and it's Black's turn
  const aiThinkingRef = useRef(false);

  useEffect(() => {
    if (game.turn() !== 'b' || game.game_over() || aiThinkingRef.current) return;

    aiThinkingRef.current = true;
    setAiThinking(true);
    console.log('[Chessmic] AI move triggered, fen:', game.fen());

    const timer = setTimeout(() => {
      try {
        const moves = game.moves({ verbose: true }) as ChessMove[];
        if (moves.length === 0) {
          console.log('[Chessmic] AI has no legal moves');
          aiThinkingRef.current = false;
          setAiThinking(false);
          return;
        }

        let bestMove: ChessMove | null = null;
        try {
          bestMove = getBestMove(game);
        } catch (err) {
          console.error('[Chessmic] Minimax error, falling back to random:', err);
        }

        if (!bestMove) {
          bestMove = moves[Math.floor(Math.random() * moves.length)];
          console.log('[Chessmic] Using fallback random move:', bestMove.from + bestMove.to);
        } else {
          console.log('[Chessmic] AI best move:', bestMove.from + bestMove.to);
        }

        const result = game.move(bestMove);
        if (result) {
          setGame(createGame(game.fen()));
          setLastMove(result);
          setHistory([...(game.history({ verbose: true }) as ChessMove[])]);
          if (result.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
          if (game.in_check() && !game.game_over()) {
            playCheckSound();
          }
        }
      } catch (err) {
        console.error('[Chessmic] AI move error:', err);
      } finally {
        aiThinkingRef.current = false;
        setAiThinking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [game]);

  const handleSquareClick = useCallback(
    (square: string) => {
      if (game.turn() !== 'w' || game.game_over() || aiThinking) return;

      const piece = game.get(square);

      if (selectedSquare) {
        // Try to make a move
        const move = legalMoves.find((m) => m.to === square);
        if (move) {
          // Check for promotion
          const moveObj: ChessMove = {
            from: selectedSquare,
            to: square,
            promotion: move.promotion || 'q',
          };
          const result = game.move(moveObj);
          if (result) {
            setGame(createGame(game.fen()));
            setLastMove(result);
            setSelectedSquare(null);
            setLegalMoves([]);
            setHistory([...game.history({ verbose: true }) as ChessMove[]]);
            if (result.captured) {
              playCaptureSound();
            } else {
              playMoveSound();
            }
            if (game.in_check() && !game.game_over()) {
              playCheckSound();
            }
          }
          return;
        }

        // If clicking another white piece, select it
        if (piece && piece.color === 'w') {
          setSelectedSquare(square);
          const moves = game.moves({ square, verbose: true }) as ChessMove[];
          setLegalMoves(moves);
          return;
        }

        // Deselect
        setSelectedSquare(null);
        setLegalMoves([]);
      } else {
        // Select a white piece
        if (piece && piece.color === 'w') {
          setSelectedSquare(square);
          const moves = game.moves({ square, verbose: true }) as ChessMove[];
          setLegalMoves(moves);
        }
      }
    },
    [game, selectedSquare, legalMoves, aiThinking]
  );

  const handleNewGame = useCallback(() => {
    const newGame = createGame();
    setGame(newGame);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setHistory([]);
    setGameOverModal(false);
    setGameOverInfo(null);
    setAiThinking(false);
    statsRecorded.current = false;
  }, []);

  const handleUndo = useCallback(() => {
    if (game.history().length === 0 || aiThinking) return;

    // Undo AI move + player move (go back to player's turn)
    game.undo();
    if (game.history().length > 0 && game.turn() === 'b') {
      game.undo();
    }
    setGame(createGame(game.fen()));
    setSelectedSquare(null);
    setLegalMoves([]);
    setHistory([...game.history({ verbose: true }) as ChessMove[]]);
    const hist = game.history({ verbose: true }) as ChessMove[];
    setLastMove(hist.length > 0 ? hist[hist.length - 1] : null);
    setGameOverModal(false);
    setGameOverInfo(null);
    statsRecorded.current = false;
  }, [game, aiThinking]);

  const handleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  const handleToggleMute = useCallback(() => {
    setMutedState((m) => {
      const newMuted = !m;
      setMuted(newMuted);
      return newMuted;
    });
  }, []);

  const handleShare = useCallback((text?: string) => {
    const shareContent = text || `I played Chessmic! Result: ${
      gameOverInfo?.description || 'Game in progress.'
    } Play at chessmic.vercel.app`;
    setShareText(shareContent);
    setShareModal(true);
    setGameOverModal(false);
  }, [gameOverInfo]);

  const canUndo = game.history().length > 0 && !aiThinking;

  return (
    <div className="min-h-screen flex flex-col" style={{ position: 'relative' }}>
      {/* Background decorations */}
      <div className="bg-deco bg-deco-tl">♜</div>
      <div className="bg-deco bg-deco-tr">♞</div>
      <div className="bg-deco bg-deco-bl">♛</div>
      <div className="bg-deco bg-deco-br">♚</div>

      <Header muted={muted} onToggleMute={handleToggleMute} onShare={() => handleShare()} />

      <main
        className="main-layout flex-1 relative z-10"
        style={{
          display: 'flex',
          gap: '2rem',
          padding: '2rem',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Board area */}
        <div className="board-area" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              className="hero-title"
              style={{ fontSize: '2rem', color: '#e8e0d0', marginBottom: '0.25rem' }}
            >
              Outthink the unexpected.
            </h2>
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                color: '#948960',
                textTransform: 'uppercase',
              }}
            >
              Ranked Practice · Match 01
            </p>
          </div>

          <ChessBoard
            game={game}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            lastMove={lastMove}
            checkSquare={checkSquare}
            flipped={flipped}
            onSquareClick={handleSquareClick}
          />

          {/* Stats display */}
          <div
            className="chess-card"
            style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem' }}
          >
            <div>
              <p className="chess-card-title" style={{ marginBottom: '0.25rem' }}>
                Wins
              </p>
              <span className="font-display text-lg" style={{ color: '#948960' }}>
                {stats.wins}
              </span>
            </div>
            <div>
              <p className="chess-card-title" style={{ marginBottom: '0.25rem' }}>
                Losses
              </p>
              <span className="font-display text-lg" style={{ color: '#e8e0d0' }}>
                {stats.losses}
              </span>
            </div>
            <div>
              <p className="chess-card-title" style={{ marginBottom: '0.25rem' }}>
                Draws
              </p>
              <span className="font-display text-lg" style={{ color: '#725962' }}>
                {stats.draws}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="sidebar-wrapper">
          <Sidebar
            turn={turn}
            inCheck={inCheck}
            gameOver={game.game_over()}
            history={history}
            onNewGame={handleNewGame}
            onUndo={handleUndo}
            onFlip={handleFlip}
            canUndo={canUndo}
          />
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {gameOverModal && gameOverInfo && (
        <GameOverModal
          title={gameOverInfo.title}
          description={gameOverInfo.description}
          moveCount={moveCount}
          onPlayAgain={handleNewGame}
          onShare={handleShare}
          onClose={() => setGameOverModal(false)}
        />
      )}

      {shareModal && (
        <ShareModal
          defaultText={shareText}
          moveCount={moveCount}
          onClose={() => setShareModal(false)}
        />
      )}


    </div>
  );
}
