import { useState, useEffect, useCallback, useRef } from "react";
import type { AppFile } from "./types";
import { convertFile, getFormats } from "./services/api";
import Header from "./components/Header";
import DropZone from "./components/DropZone";
import FileList from "./components/FileList";
import MarkdownPreview from "./components/MarkdownPreview";

let nextId = 0;
function genId() {
  return `file-${++nextId}`;
}

function App() {
  const [files, setFiles] = useState<AppFile[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const filesRef = useRef(files);
  filesRef.current = files;

  useEffect(() => {
    getFormats()
      .then(setFormats)
      .catch(() => {
        setFormats([
          "pdf", "docx", "doc", "pptx", "ppt", "xlsx", "xls",
          "html", "htm", "epub", "png", "jpg", "jpeg", "gif",
          "mp3", "wav", "csv", "json", "xml", "zip", "txt",
          "md", "ipynb", "tsv", "rst",
        ]);
      });
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const appFiles: AppFile[] = newFiles.map((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      return {
        id: genId(),
        file,
        name: file.name,
        size: file.size,
        format: ext,
        status: "pending" as const,
      };
    });
    setFiles((prev) => [...prev, ...appFiles]);
  }, []);

  const handleConvert = useCallback(async (id: string) => {
    const appFile = filesRef.current.find((f) => f.id === id);
    if (!appFile) return;

    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "converting" as const, error: undefined } : f))
    );

    try {
      const result = await convertFile(appFile.file);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "done" as const, markdown: result.markdown } : f
        )
      );
    } catch (err) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "error" as const, error: err instanceof Error ? err.message : "Erro desconhecido" }
            : f
        )
      );
    }
  }, []);

  const handleConvertAll = useCallback(async () => {
    const pending = filesRef.current.filter((f) => f.status === "pending");
    for (const f of pending) {
      await handleConvert(f.id);
    }
  }, [handleConvert]);

  const handlePreview = useCallback((id: string) => {
    setPreviewId(id);
  }, []);

  const handleDownload = useCallback((id: string) => {
    const appFile = filesRef.current.find((f) => f.id === id);
    if (!appFile?.markdown) return;
    const blob = new Blob([appFile.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = appFile.name.replace(/\.[^.]+$/, ".md");
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setPreviewId((prev) => (prev === id ? null : prev));
  }, []);

  const handleClearAll = useCallback(() => {
    setFiles([]);
    setPreviewId(null);
  }, []);

  const previewFile = files.find((f) => f.id === previewId);
  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header
        fileCount={files.length}
        pendingCount={pendingCount}
        onConvertAll={handleConvertAll}
        onClearAll={handleClearAll}
      />

      {files.length === 0 && !previewFile && (
        <div className="flex-1 flex items-center justify-center">
          <DropZone onFiles={addFiles} acceptedFormats={formats} />
        </div>
      )}

      {files.length > 0 && previewFile && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="lg:w-[420px] flex-shrink-0 flex flex-col overflow-y-auto border-r border-border">
            <div className="py-4">
              <DropZone onFiles={addFiles} acceptedFormats={formats} />
              <FileList
                files={files}
                onConvert={handleConvert}
                onPreview={handlePreview}
                onDownload={handleDownload}
                onRemove={handleRemove}
              />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <MarkdownPreview
              filename={previewFile.name}
              markdown={previewFile.markdown || ""}
              onClose={() => setPreviewId(null)}
            />
          </div>
        </div>
      )}

      {files.length > 0 && !previewFile && (
        <div className="flex-1 overflow-y-auto py-4">
          <DropZone onFiles={addFiles} acceptedFormats={formats} />
          <FileList
            files={files}
            onConvert={handleConvert}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onRemove={handleRemove}
          />
        </div>
      )}
    </div>
  );
}

export default App;
