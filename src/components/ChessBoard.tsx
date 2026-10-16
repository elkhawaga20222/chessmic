import { useMemo } from 'react';
import type { ChessInstance, ChessMove } from '@/chess';
import Piece from './Piece';

interface ChessBoardProps {
  game: ChessInstance;
  selectedSquare: string | null;
  legalMoves: ChessMove[];
  lastMove: ChessMove | null;
  checkSquare: string | null;
  flipped: boolean;
  onSquareClick: (square: string) => void;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
const SQUARE_SIZE = 60;

export default function ChessBoard({
  game,
  selectedSquare,
  legalMoves,
  lastMove,
  checkSquare,
  flipped,
  onSquareClick,
}: ChessBoardProps) {
  const board = useMemo(() => game.board(), [game]);

  const displayRanks = flipped ? [...RANKS].reverse() : RANKS;
  const displayFiles = flipped ? [...FILES].reverse() : FILES;

  const legalMoveMap = useMemo(() => {
    const map = new Map<string, ChessMove>();
    for (const m of legalMoves) {
      map.set(m.to, m);
    }
    return map;
  }, [legalMoves]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.25rem' }}>
      {/* Rank labels */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {displayRanks.map((rank) => (
          <div
            key={rank}
            style={{
              width: '1.2rem',
              height: SQUARE_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#948960',
              fontSize: '0.7rem',
              fontWeight: 600,
              opacity: 0.7,
            }}
          >
            {rank}
          </div>
        ))}
      </div>

      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(8, ${SQUARE_SIZE}px)`,
            border: '2px solid rgba(148,137,96,0.4)',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {displayRanks.map((rank) =>
            displayFiles.map((file) => {
              const square = file + rank;
              const boardRow = 8 - parseInt(rank);
              const boardCol = FILES.indexOf(file);
              const piece = board[boardRow][boardCol];
              const isLight = (boardRow + boardCol) % 2 === 1;
              const isSelected = selectedSquare === square;
              const legalMove = legalMoveMap.get(square);
              const isCapture =
                !!legalMove &&
                (legalMove.flags?.includes('c') ||
                  legalMove.flags?.includes('e'));
              const isLastMove =
                lastMove &&
                (lastMove.from === square || lastMove.to === square);
              const isCheck = checkSquare === square;

              return (
                <div
                  key={square}
                  className={`board-square ${
                    isLight ? 'board-square-light' : 'board-square-dark'
                  }`}
                  style={{
                    width: SQUARE_SIZE,
                    height: SQUARE_SIZE,
                    position: 'relative',
                  }}
                  onClick={() => onSquareClick(square)}
                >
                  {isLastMove && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(114,89,98,0.5)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  {isCheck && (
                    <div
                      className="check-pulse"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        border: '3px solid #948960',
                        pointerEvents: 'none',
                        zIndex: 5,
                      }}
                    />
                  )}
                  {piece && <Piece type={piece.type} color={piece.color} />}
                  {legalMove && !isCapture && (
                    <div className="legal-move-dot" />
                  )}
                  {legalMove && isCapture && (
                    <div className="legal-capture-ring" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* File labels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(8, ${SQUARE_SIZE}px)`,
            marginTop: '0.25rem',
          }}
        >
          {displayFiles.map((file) => (
            <div
              key={file}
              style={{
                height: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#948960',
                fontSize: '0.7rem',
                fontWeight: 600,
                opacity: 0.7,
              }}
            >
              {file}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
