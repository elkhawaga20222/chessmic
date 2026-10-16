import { useEffect, useRef } from 'react';
import type { ChessMove } from '@/chess';

interface MoveLogProps {
  history: ChessMove[];
}

export default function MoveLog({ history }: MoveLogProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [history]);

  const rows: { num: number; white?: ChessMove; black?: ChessMove }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    rows.push({
      num: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1],
    });
  }

  return (
    <div
      ref={listRef}
      className="move-log-list"
      style={{
        maxHeight: '160px',
        overflowY: 'auto',
        fontSize: '0.85rem',
      }}
    >
      {rows.length === 0 ? (
        <p className="text-xs opacity-40">No moves yet.</p>
      ) : (
        rows.map((row) => (
          <div
            key={row.num}
            className="flex items-center gap-2 py-1"
            style={{ borderBottom: '1px solid rgba(148,137,96,0.08)' }}
          >
            <span
              className="font-display"
              style={{ color: '#948960', minWidth: '1.5rem', fontSize: '0.75rem' }}
            >
              {row.num}.
            </span>
            <span style={{ flex: 1, color: '#e8e0d0' }}>
              {row.white?.san || ''}
            </span>
            <span style={{ flex: 1, color: '#b0a890' }}>
              {row.black?.san || ''}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
