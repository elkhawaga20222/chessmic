import { useState } from 'react';
import { X, Copy, Download, Play, Share2 } from 'lucide-react';

interface GameOverModalProps {
  title: string;
  description: string;
  moveCount: number;
  onPlayAgain: () => void;
  onShare: (resultText: string) => void;
  onClose: () => void;
}

export default function GameOverModal({
  title,
  description,
  moveCount,
  onPlayAgain,
  onShare,
  onClose,
}: GameOverModalProps) {
  const resultText = `${description} Play at chessmic.vercel.app`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ textAlign: 'center' }}
      >
        <h2
          className="font-display"
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#948960',
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: '#e8e0d0',
            opacity: 0.8,
            marginBottom: '2rem',
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button className="chess-btn chess-btn-primary" onClick={onPlayAgain}>
            <Play size={16} /> Play Again
          </button>
          <button
            className="chess-btn"
            onClick={() => onShare(resultText)}
          >
            <Share2 size={16} /> Share Result
          </button>
          <button className="chess-btn" onClick={onClose}>
            <X size={16} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface ShareModalProps {
  defaultText: string;
  moveCount: number;
  onClose: () => void;
}

export function ShareModal({ defaultText, moveCount, onClose }: ShareModalProps) {
  const [text, setText] = useState(defaultText);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, '#1A0F0A');
    grad.addColorStop(1, '#111111');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Gold border
    ctx.strokeStyle = '#948960';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, 1000, 1000);

    // Title
    ctx.fillStyle = '#948960';
    ctx.font = 'bold 80px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('CHESSMIC', 540, 350);

    // Subtitle
    ctx.fillStyle = '#e8e0d0';
    ctx.font = '36px Inter, sans-serif';
    ctx.fillText('Seismic Chess', 540, 410);

    // Result text
    ctx.fillStyle = '#e8e0d0';
    ctx.font = '32px Inter, sans-serif';
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, 540, 520 + i * 45);
    });

    // Moves
    ctx.fillStyle = '#948960';
    ctx.font = 'bold 48px Cinzel, serif';
    ctx.fillText(`${moveCount} moves`, 540, 680);

    // Footer
    ctx.fillStyle = '#948960';
    ctx.font = '28px Inter, sans-serif';
    ctx.fillText('Play at chessmic.vercel.app', 540, 960);

    // Download
    const link = document.createElement('a');
    link.download = 'chessmic-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 520 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-display"
            style={{ fontSize: '1.5rem', fontWeight: 600, color: '#948960' }}
          >
            Share Result
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#948960' }}
          >
            <X size={20} />
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            background: 'rgba(17,17,17,0.8)',
            border: '1px solid rgba(148,137,96,0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#e8e0d0',
            fontSize: '0.85rem',
            fontFamily: 'Inter, sans-serif',
            resize: 'vertical',
            marginBottom: '1.5rem',
          }}
        />

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="chess-btn chess-btn-primary" onClick={handleCopy}>
            <Copy size={16} /> {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button className="chess-btn" onClick={handleDownloadPNG}>
            <Download size={16} /> Download PNG
          </button>
          <button className="chess-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
