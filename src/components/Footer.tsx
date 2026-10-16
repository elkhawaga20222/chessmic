export default function Footer() {
  return (
    <footer
      className="relative z-10 px-6 py-4 border-t border-[rgba(148,137,96,0.15)] flex flex-col sm:flex-row items-center justify-between gap-3"
    >
      <p className="text-xs text-[#948960] opacity-70">
        Built by adelkhater · elkhawaga20222
      </p>
      <div className="flex items-center gap-4 text-xs">
        <a
          href="https://seismic-glossary.lovable.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#948960] opacity-70 hover:opacity-100 transition-opacity"
        >
          Seismic Glossary
        </a>
        <a
          href="https://seismic-quiz-arena.lovable.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#948960] opacity-70 hover:opacity-100 transition-opacity"
        >
          Seismic Quiz Arena
        </a>
        <a
          href="https://x.com/SeismicSys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#948960] opacity-70 hover:opacity-100 transition-opacity"
        >
          @SeismicSys
        </a>
      </div>
    </footer>
  );
}
