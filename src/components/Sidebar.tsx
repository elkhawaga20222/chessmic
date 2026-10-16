import { RotateCcw, RefreshCw, FlipHorizontal2, Lightbulb } from 'lucide-react';
import type { ChessMove } from '@/chess';
import MoveLog from './MoveLog';
import CapturedPieces from './CapturedPieces';

interface SidebarProps {
  turn: 'w' | 'b';
  inCheck: boolean;
  gameOver: boolean;
  history: ChessMove[];
  onNewGame: () => void;
  onUndo: () => void;
  onFlip: () => void;
  canUndo: boolean;
}

export default function Sidebar({
  turn,
  inCheck,
  gameOver,
  history,
  onNewGame,
  onUndo,
  onFlip,
  canUndo,
}: SidebarProps) {
  const turnText = gameOver
    ? 'Game Over'
    : inCheck
    ? 'Check!'
    : turn === 'w'
    ? 'White to move'
    : 'Black to move';

  const turnColor = inCheck
    ? '#dc2626'
    : turn === 'w'
    ? '#e8e0d0'
    : '#948960';

  return (
    <div className="flex flex-col gap-4" style={{ width: 320, flexShrink: 0 }}>
      {/* Turn Indicator */}
      <div className="chess-card">
        <p className="chess-card-title">Current Turn</p>
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: turn === 'w' ? '#e8e0d0' : '#1a0f0a',
              border: turn === 'b' ? '1px solid #948960' : 'none',
            }}
          />
          <span
            className="font-display"
            style={{ fontSize: '1.1rem', fontWeight: 600, color: turnColor }}
          >
            {turnText}
          </span>
        </div>
      </div>

      {/* Match Log */}
      <div className="chess-card">
        <p className="chess-card-title">Match Log</p>
        <MoveLog history={history} />
      </div>

      {/* Captured Pieces */}
      <div className="chess-card">
        <p className="chess-card-title">Captured Pieces</p>
        <CapturedPieces history={history} />
      </div>

      {/* Buttons */}
      <div className="chess-card">
        <p className="chess-card-title">Controls</p>
        <div className="flex flex-col gap-2">
          <button className="chess-btn chess-btn-primary" onClick={onNewGame}>
            <RefreshCw size={15} /> New Game
          </button>
          <div className="flex gap-2">
            <button
              className="chess-btn"
              style={{ flex: 1 }}
              onClick={onUndo}
              disabled={!canUndo}
            >
              <RotateCcw size={15} /> Undo
            </button>
            <button
              className="chess-btn"
              style={{ flex: 1 }}
              onClick={onFlip}
            >
              <FlipHorizontal2 size={15} /> Flip
            </button>
          </div>
        </div>
      </div>

      {/* Quick Tip */}
      <div className="chess-card">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={16} style={{ color: '#948960' }} />
          <p className="chess-card-title" style={{ marginBottom: 0 }}>
            Quick Tip
          </p>
        </div>
        <p className="text-sm opacity-80 leading-relaxed">
          Control the center early. Space creates options.
        </p>
      </div>
    </div>
  );
}
