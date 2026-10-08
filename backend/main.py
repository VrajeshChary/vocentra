from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pathlib import Path
import logging

from backend.api import upload_api, status_api, results_api
from backend.services.model_manager import model_manager
from backend.utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load AI models once
    model_manager.initialize_models()
    yield

app = FastAPI(title="Vocentra Scalable AI Backend", lifespan=lifespan)

# Phase 15: Global Error Handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "message": "An unexpected error occurred."}
    )

app.add_middleware(

    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(upload_api.router, tags=["Upload"])
app.include_router(status_api.router, tags=["Status"])
app.include_router(results_api.router, tags=["Results"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "vocentra-ai-backend"}


# Mount static files and templates
# Phase 3 & 13: Correct pathing to modular frontend
STATIC_DIR = Path(__file__).resolve().parent.parent / "frontend" / "static"
if not STATIC_DIR.exists():
    STATIC_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Templates for the HTML pages
template_dir = Path(__file__).resolve().parent.parent / "frontend"
templates = Jinja2Templates(directory=str(template_dir))

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    # Search for index.html in the frontend folder
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/upload", response_class=HTMLResponse)
async def upload_page(request: Request):
    return templates.TemplateResponse("upload.html", {"request": request})

@app.get("/result", response_class=HTMLResponse)
async def result_page(request: Request):
    # Job results are viewed here, but the page itself is standard
    return templates.TemplateResponse("result.html", {"request": request})

