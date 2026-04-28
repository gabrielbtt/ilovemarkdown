import type { ConvertResult } from "../types";

const API_BASE = "/api";

export async function convertFile(file: File): Promise<ConvertResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/convert`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: "Erro desconhecido" }));
    throw new Error(data.detail || "Erro ao converter arquivo");
  }

  return response.json();
}

export async function convertBatch(files: File[]): Promise<ConvertResult[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(`${API_BASE}/convert/batch`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: "Erro desconhecido" }));
    throw new Error(data.detail || "Erro ao converter arquivos");
  }

  return response.json();
}

export async function getFormats(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/formats`);
  if (!response.ok) throw new Error("Erro ao buscar formatos");
  const data = await response.json();
  return data.formats;
}
