from typing import Any, Dict
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path

from src.resume_scorer.data_analysis import ResumeAnalyser
from src.resume_scorer.data_ingestion import ResumeHandler
from logger.custom_logger import CustomLogger

log = CustomLogger().get_logger(__name__)

app = FastAPI(title="Resume Scorer", version="0.1")

BASE_DIR = Path(__file__).resolve().parent.parent
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse)
async def serve_ui(request: Request):
    log.info("Serving UI homepage.")
    resp = templates.TemplateResponse(request=request, name="index.html", context={"request": request})
    resp.headers["Cache-Control"] = "no-store"
    return resp


@app.get("/health")
def health() -> Dict[str, str]:
    log.info("Health check passed.")
    return {"status": "ok", "service": "Resume-Scorer"}


@app.post("/scorer", response_class=HTMLResponse)
async def scorer_resume(resume: UploadFile = File(...), job_description: str = Form(...)) -> Any:
    try:
        log.info(f"Starting resume analysis - File: {resume.filename}, Job description length: {len(job_description)}")

        handler = ResumeHandler()
        saved_path = handler.save_pdf(resume)
        log.info(f"PDF saved at: {saved_path}")

        cv_content = handler.read_pdf(saved_path)
        log.info(f"Extracted text length: {len(cv_content)} chars")

        log.info("Starting LLM analysis")
        analyzer = ResumeAnalyser()
        analysis_result = analyzer.analyze_resume(cv_content, job_description)

        log.info(
            f"Analysis completed. Result keys: {list(analysis_result.keys()) if isinstance(analysis_result, dict) else "Not a dict"}")
        log.info(f"Overall score: {analysis_result.get("overall_score", "Not Found")}")

        if hasattr(analysis_result, "dict"):
            analysis_result = analysis_result.dict()
        elif hasattr(analysis_result, "__dict__"):
            analysis_result = analysis_result.__dict__

        return {"session_id": handler.session_id, "analysis_result": analysis_result}

    except HTTPException:
        raise HTTPException(status_code=500, detail="Resume scoring failed")
    except Exception as e:
        log.exception("Resume scoring failed")
        raise HTTPException(status_code=500, detail=f"Resume scoring failed: {e}")
