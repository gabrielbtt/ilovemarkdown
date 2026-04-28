from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.converter import convert_file, get_supported_formats
from app.models import ConvertResult, FormatListResponse

FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="iLoveMarkdown", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/convert", response_model=ConvertResult)
async def api_convert(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        return convert_file(contents, file.filename or "unknown")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao converter: {e}")


@app.post("/api/convert/batch", response_model=list[ConvertResult])
async def api_convert_batch(files: list[UploadFile] = File(...)):
    results: list[ConvertResult] = []
    errors: list[str] = []
    for f in files:
        try:
            contents = await f.read()
            results.append(convert_file(contents, f.filename or "unknown"))
        except ValueError as e:
            errors.append(f"{f.filename}: {e}")
        except Exception as e:
            errors.append(f"{f.filename}: erro interno - {e}")

    if not results and errors:
        raise HTTPException(status_code=400, detail="; ".join(errors))

    return results


@app.get("/api/formats", response_model=FormatListResponse)
async def api_formats():
    return FormatListResponse(formats=get_supported_formats())


# Serve frontend estático em produção
if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="static")
