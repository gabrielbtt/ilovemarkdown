# ❤️ iLoveMarkdown

Conversor de arquivos para Markdown — arraste, solte e converta. Construído sobre a biblioteca [markitdown](https://github.com/microsoft/markitdown) da Microsoft.

## Formatos Suportados

PDF, DOCX, PPTX, XLSX, HTML, EPUB, imagens (PNG, JPG, GIF), áudio (MP3, WAV), CSV, JSON, XML, ZIP e mais.

## Instalacao

Requisitos: [Python](https://python.org) + [Node.js](https://nodejs.org)

## Rodando

### Modo simples (Windows)

De um duplo-clique em `start.bat` — ele instala dependencias, sobe o backend e frontend, e abre o navegador automaticamente.

### Modo manual

```bash
# Terminal 1 — Backend
cd backend
pip install -r requirements.txt
python run.py

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000/docs`

## Build para Producao

```bash
cd frontend
npm run build
```

Os arquivos estaticos serao gerados em `frontend/dist/`. O backend FastAPI serve esses arquivos automaticamente quando a pasta `dist` existe.

Para rodar em producao:

```bash
cd backend
pip install -r requirements.txt
python run.py
```

Acesse `http://localhost:8000` — o frontend sera servido diretamente pelo backend.

## Funcionalidades

- **Drag & Drop**: Arraste arquivos diretamente para a área de upload
- **Conversão em lote**: Converta múltiplos arquivos de uma vez
- **Preview**: Visualize o markdown gerado antes de baixar
- **Download**: Baixe o arquivo .md convertido
- **Copiar**: Copie o markdown para a área de transferência

## Stack

- **Backend**: Python, FastAPI, markitdown
- **Frontend**: React, TypeScript, Vite, TailwindCSS
