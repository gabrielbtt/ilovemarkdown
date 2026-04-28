export type FileStatus = "pending" | "converting" | "done" | "error";

export interface AppFile {
  id: string;
  file: File;
  name: string;
  size: number;
  format: string;
  status: FileStatus;
  markdown?: string;
  error?: string;
}

export interface ConvertResult {
  filename: string;
  markdown: string;
  format: string;
  size: number;
}
