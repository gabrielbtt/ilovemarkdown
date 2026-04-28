import io
from pathlib import Path

from markitdown import MarkItDown

from app.models import ConvertResult

SUPPORTED_EXTENSIONS: set[str] = {
    ".pdf", ".docx", ".doc", ".pptx", ".ppt", ".xlsx", ".xls",
    ".html", ".htm", ".epub", ".png", ".jpg", ".jpeg", ".gif",
    ".mp3", ".wav", ".csv", ".json", ".xml", ".zip", ".txt",
    ".md", ".rst", ".ipynb", ".tsv",
}

_markitdown = MarkItDown()


def get_supported_formats() -> list[str]:
    return sorted(ext.lstrip(".") for ext in SUPPORTED_EXTENSIONS)


def convert_file(file_bytes: bytes, filename: str) -> ConvertResult:
    ext = Path(filename).suffix.lower()
    if ext not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Formato '{ext}' não suportado. "
            f"Formatos aceitos: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
        )

    stream = io.BytesIO(file_bytes)
    result = _markitdown.convert_stream(stream, file_path=filename)

    return ConvertResult(
        filename=filename,
        markdown=result.text_content,
        format=ext.lstrip("."),
        size=len(file_bytes),
    )
