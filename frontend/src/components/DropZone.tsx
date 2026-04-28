import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  acceptedFormats: string[];
}

const FORMAT_MIME_MAP: Record<string, string[]> = {
  pdf: ["application/pdf"],
  docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  doc: ["application/msword"],
  pptx: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ppt: ["application/vnd.ms-powerpoint"],
  xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  xls: ["application/vnd.ms-excel"],
  html: ["text/html"],
  htm: ["text/html"],
  epub: ["application/epub+zip"],
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  gif: ["image/gif"],
  mp3: ["audio/mpeg"],
  wav: ["audio/wav"],
  csv: ["text/csv"],
  json: ["application/json"],
  xml: ["text/xml", "application/xml"],
  zip: ["application/zip"],
  txt: ["text/plain"],
  md: ["text/markdown"],
  ipynb: ["application/x-ipynb+json"],
  tsv: ["text/tab-separated-values"],
  rst: ["text/x-rst"],
};

export default function DropZone({ onFiles, acceptedFormats }: DropZoneProps) {
  const accept: Record<string, string[]> = {};
  for (const fmt of acceptedFormats) {
    const mimes = FORMAT_MIME_MAP[fmt];
    if (mimes) {
      for (const mime of mimes) {
        if (!accept[mime]) accept[mime] = [];
        accept[mime].push(`.${fmt}`);
      }
    }
  }

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFiles(accepted);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.keys(accept).length > 0 ? accept : undefined,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center gap-3
        py-12 px-6 mx-6 mt-6
        border-2 border-dashed rounded-xl
        cursor-pointer transition-all duration-200
        ${isDragActive
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/50 hover:bg-surface"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragActive ? "bg-primary/10" : "bg-gray-100"}`}>
        <svg className={`w-6 h-6 transition-colors ${isDragActive ? "text-primary" : "text-text-secondary"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-text font-medium">
          {isDragActive ? "Solte os arquivos aqui" : "Arraste arquivos aqui ou clique para selecionar"}
        </p>
        <p className="text-sm text-text-secondary mt-1">
          PDF, DOCX, PPTX, XLSX, HTML, EPUB, imagens, áudio e mais
        </p>
      </div>
    </div>
  );
}
