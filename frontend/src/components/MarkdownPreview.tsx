import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  filename: string;
  markdown: string;
  onClose: () => void;
}

export default function MarkdownPreview({ filename, markdown, onClose }: MarkdownPreviewProps) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.replace(/\.[^.]+$/, ".md");
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full border-l border-border bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-medium text-text truncate">{filename}</h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* View toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView("preview")}
              className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                view === "preview" ? "bg-primary text-white" : "bg-surface text-text-secondary hover:bg-gray-50"
              }`}
            >
              Visualização
            </button>
            <button
              onClick={() => setView("code")}
              className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                view === "code" ? "bg-primary text-white" : "bg-surface text-text-secondary hover:bg-gray-50"
              }`}
            >
              Código
            </button>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="p-1.5 text-text-secondary hover:text-primary transition-colors cursor-pointer"
            title="Copiar"
          >
            {copied ? (
              <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="p-1.5 text-text-secondary hover:text-success transition-colors cursor-pointer"
            title="Baixar .md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-error transition-colors cursor-pointer"
            title="Fechar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {view === "preview" ? (
          <div className="markdown-preview text-sm text-text">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        ) : (
          <pre className="text-sm text-text font-mono whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-lg">
            {markdown}
          </pre>
        )}
      </div>
    </div>
  );
}
