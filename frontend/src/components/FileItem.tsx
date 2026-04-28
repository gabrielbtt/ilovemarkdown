import type { AppFile } from "../types";

interface FileItemProps {
  appFile: AppFile;
  onConvert: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onRemove: (id: string) => void;
}

const FORMAT_ICONS: Record<string, string> = {
  pdf: "📕", docx: "📘", doc: "📘", pptx: "📙", ppt: "📙",
  xlsx: "📗", xls: "📗", html: "🌐", htm: "🌐", epub: "📱",
  png: "🖼️", jpg: "🖼️", jpeg: "🖼️", gif: "🖼️",
  mp3: "🎵", wav: "🎵", csv: "📊", json: "🔧", xml: "🔧",
  zip: "📦", txt: "📝", md: "📝", ipynb: "📓", tsv: "📊", rst: "📝",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileItem({ appFile, onConvert, onPreview, onDownload, onRemove }: FileItemProps) {
  const icon = FORMAT_ICONS[appFile.format] || "📄";

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200
      ${appFile.status === "done" ? "border-success/30 bg-success/5" : ""}
      ${appFile.status === "error" ? "border-error/30 bg-error/5" : ""}
      ${appFile.status === "converting" ? "border-primary/30 bg-primary/5" : ""}
      ${appFile.status === "pending" ? "border-border bg-surface" : ""}
    `}>
      <span className="text-xl flex-shrink-0">{icon}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{appFile.name}</p>
        <p className="text-xs text-text-secondary">
          {appFile.format.toUpperCase()} &middot; {formatSize(appFile.size)}
          {appFile.status === "converting" && " · Convertendo..."}
          {appFile.status === "error" && ` · ${appFile.error || "Erro"}`}
        </p>
      </div>

      {/* Status indicator */}
      <div className="flex-shrink-0">
        {appFile.status === "pending" && (
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        )}
        {appFile.status === "converting" && (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
        {appFile.status === "done" && (
          <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {appFile.status === "error" && (
          <svg className="w-4 h-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {appFile.status === "pending" && (
          <button
            onClick={() => onConvert(appFile.id)}
            className="p-1.5 text-text-secondary hover:text-primary transition-colors cursor-pointer"
            title="Converter"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
        {appFile.status === "done" && (
          <>
            <button
              onClick={() => onPreview(appFile.id)}
              className="p-1.5 text-text-secondary hover:text-primary transition-colors cursor-pointer"
              title="Visualizar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={() => onDownload(appFile.id)}
              className="p-1.5 text-text-secondary hover:text-success transition-colors cursor-pointer"
              title="Baixar .md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </>
        )}
        <button
          onClick={() => onRemove(appFile.id)}
          className="p-1.5 text-text-secondary hover:text-error transition-colors cursor-pointer"
          title="Remover"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
