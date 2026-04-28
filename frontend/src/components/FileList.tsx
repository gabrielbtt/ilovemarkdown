import type { AppFile } from "../types";
import FileItem from "./FileItem";

interface FileListProps {
  files: AppFile[];
  onConvert: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function FileList({ files, onConvert, onPreview, onDownload, onRemove }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="px-6 mt-4">
      <div className="flex flex-col gap-2">
        {files.map((f) => (
          <FileItem
            key={f.id}
            appFile={f}
            onConvert={onConvert}
            onPreview={onPreview}
            onDownload={onDownload}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
