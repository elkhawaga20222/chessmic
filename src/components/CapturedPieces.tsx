import { useMemo } from 'react';
import type { ChessMove } from '@/chess';
import { PIECE_UNICODE } from '@/constants';

interface CapturedPiecesProps {
  history: ChessMove[];
}

export default function CapturedPieces({ history }: CapturedPiecesProps) {
  const { whiteCaptured, blackCaptured } = useMemo(() => {
    const whiteCaptured: string[] = [];
    const blackCaptured: string[] = [];
    for (const move of history) {
      if (move.captured) {
        if (move.color === 'w') {
          blackCaptured.push(move.captured);
        } else {
          whiteCaptured.push(move.captured);
        }
      }
    }
    return { whiteCaptured, blackCaptured };
  }, [history]);

  return (
    <div>
      <div style={{ marginBottom: '0.5rem' }}>
        <p className="text-xs text-[#948960] mb-1 tracking-wide">
          White captured ({blackCaptured.length})
        </p>
        <div className="flex flex-wrap gap-1">
          {blackCaptured.length === 0 ? (
            <span className="text-xs opacity-40">—</span>
          ) : (
            blackCaptured.map((p, i) => (
              <span
                key={i}
                style={{
                  fontSize: '1.4rem',
                  color: '#1a0f0a',
                  textShadow: '0 0 1px #948960',
                  lineHeight: 1,
                }}
              >
                {PIECE_UNICODE[p]}
              </span>
            ))
          )}
        </div>
      </div>
      <div>
        <p className="text-xs text-[#948960] mb-1 tracking-wide">
          Black captured ({whiteCaptured.length})
        </p>
        <div className="flex flex-wrap gap-1">
          {whiteCaptured.length === 0 ? (
            <span className="text-xs opacity-40">—</span>
          ) : (
            whiteCaptured.map((p, i) => (
              <span
                key={i}
                style={{
                  fontSize: '1.4rem',
                  color: '#e8e0d0',
                  lineHeight: 1,
                }}
              >
                {PIECE_UNICODE[p]}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
