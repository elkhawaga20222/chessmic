import { useState, useEffect } from 'react';
import { PIECE_IMAGES, PIECE_UNICODE } from '@/constants';

interface PieceProps {
  type: string;
  color: 'w' | 'b';
}

export default function Piece({ type, color }: PieceProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [type, color]);

  const imgSrc = PIECE_IMAGES[type];
  const isWhite = color === 'w';

  return (
    <div
      className={`piece ${isWhite ? 'white' : 'black'}`}
      style={{
        background: 'transparent',
        backgroundColor: 'transparent',
      }}
    >
      {!imgError && (
        <img
          src={imgSrc}
          alt=""
          style={{
            width: '96%',
            height: '96%',
            objectFit: 'contain',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease',
            background: 'transparent',
            mixBlendMode: 'multiply',
          }}
          onLoad={() => {
            setImgLoaded(true);
            setImgError(false);
          }}
          onError={() => {
            setImgError(true);
          }}
        />
      )}
      {imgError && (
        <span
          className="piece-fallback"
          style={{
            fontSize: '60%',
            color: isWhite ? '#e8e0d0' : '#1a0f0a',
            textShadow: isWhite ? 'none' : '0 0 1px #948960',
          }}
        >
          {PIECE_UNICODE[type]}
        </span>
      )}
    </div>
  );
}
