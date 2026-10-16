import { Volume2, VolumeX, Share2 } from 'lucide-react';
import { useState } from 'react';
import { LOGO_URL } from '@/constants';

interface HeaderProps {
  muted: boolean;
  onToggleMute: () => void;
  onShare: () => void;
}

export default function Header({ muted, onToggleMute, onShare }: HeaderProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[rgba(148,137,96,0.15)]">
      <div className="flex items-center gap-3">
        <div
          className="animate-fade-in-scale"
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: '2px solid #948960',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(26,15,10,0.8)',
            flexShrink: 0,
          }}
        >
          {logoError ? (
            <span style={{ fontSize: 24, color: '#948960' }}>⛰</span>
          ) : (
            <img
              src={LOGO_URL}
              alt="Seismic"
              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
              onError={() => setLogoError(true)}
            />
          )}
        </div>
        <div>
          <h1 className="font-display text-xl font-bold tracking-wider">
            <span style={{ color: '#e8e0d0' }}>CHESS</span>
            <span style={{ color: '#948960' }}>MIC</span>
          </h1>
          <p className="text-xs text-[#948960] tracking-wide opacity-80">
            Seismic Chess
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMute}
          className="chess-btn"
          style={{ padding: '0.5rem 0.7rem' }}
          aria-label="Toggle sound"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button
          onClick={onShare}
          className="chess-btn"
          style={{ padding: '0.5rem 0.7rem' }}
          aria-label="Share"
        >
          <Share2 size={18} />
        </button>
      </div>
    </header>
  );
}
