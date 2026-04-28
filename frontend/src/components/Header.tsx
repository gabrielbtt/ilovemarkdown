interface HeaderProps {
  fileCount: number;
  pendingCount: number;
  onConvertAll: () => void;
  onClearAll: () => void;
}

export default function Header({ fileCount, pendingCount, onConvertAll, onClearAll }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-text">iLoveMarkdown</h1>
          <p className="text-xs text-text-secondary">Converta seus arquivos para Markdown</p>
        </div>
      </div>

      {fileCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">
            {fileCount} arquivo{fileCount !== 1 ? "s" : ""}
          </span>
          {pendingCount > 0 && (
            <button
              onClick={onConvertAll}
              className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Converter todos
            </button>
          )}
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 text-text-secondary text-sm hover:text-error transition-colors cursor-pointer"
          >
            Limpar
          </button>
        </div>
      )}
    </header>
  );
}
