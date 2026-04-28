from pydantic import BaseModel


class ConvertResult(BaseModel):
    filename: str
    markdown: str
    format: str
    size: int


class FormatListResponse(BaseModel):
    formats: list[str]
