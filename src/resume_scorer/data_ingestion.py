import os
import fitz
import sys
import uuid
from datetime import datetime
from logger.custom_logger import CustomLogger
from exceptions.custom_exception import ResumeAnalyzerException


class ResumeHandler:

    def __init__(self, data_dir=None, session_id=None):
        try:
            self.log = CustomLogger.get_logger(__name__)
            self.data_dir = data_dir or os.getenv(
                "DATA_STORAGE_PATH",
                os.path.join(os.getcwd(), "data", "resume_analysis")
            )
            self.session_id = session_id or f"session_{datetime.utcnow().strftime("%Y%m%d_%H%M%S")}_{uuid.uuid4().hex[:8]}"

            # Create base session directory
            self.session_path = os.path.join(self.data_dir, self.session_id)
            os.makedirs(self.session_path, exist_ok=True)

            self.log.info("ResumeHandler initialized", session_id=self.session_id, session_path=self.session_path)

        except Exception as e:
            self.log.error(f"Error initializing ResumeHandler: {e}")
            raise ResumeAnalyzerException("Error initializing ResumeHandler", sys)

    def save_pdf(self, uploaded_file):
        try:
            file_name = None
            if hasattr(uploaded_file, "file_name") and uploaded_file.file_name:
                file_name = os.path.basename(uploaded_file.file_name)
            elif hasattr(uploaded_file, "filename") and uploaded_file.name:
                file_name = os.path.basename(uploaded_file.name)

            if not file_name.lower().endswith(".pdf"):
                raise ResumeAnalyzerException("Invalid file type. Only PDFs are allowed", sys)

            save_path = os.path.join(self.session_path, file_name)

            file_bytes = None
            if hasattr(uploaded_file, "file") and hasattr(uploaded_file.file, "read"):
                file_bytes = uploaded_file.file.read()
            elif hasattr(uploaded_file, "getbuffer"):
                file_bytes = uploaded_file.getbuffer()
            elif hasattr(uploaded_file, "read"):
                file_bytes = uploaded_file.read()
            else:
                raise ResumeAnalyzerException("unsupported upload file type: cannot read bytes", sys)

            with open(save_path, "wb") as f:
                f.write(file_bytes)

            self.log.info("Resume saved successfully", file=file_name, save_path=save_path, session_id=self.session_id)

            return save_path

        except Exception as e:
            self.log.error(f"Error saving Resume: {e}")
            raise ResumeAnalyzerException("Error saving Resume", sys)

    def read_pdf(self, pdf_path: str) -> str:
        try:
            text_chunks = []
            with fitz.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf, start=1):
                    text_chunks.append(f"\n--- Page {page_num} ---\n{page.get_text()}")
            text = "\n".join(text_chunks)

            self.log.info("Resume read successfully", pdf_path=pdf_path, session_id=self.session_id,
                          pages=len(text_chunks))
            return text
        except Exception as e:
            self.log.error(f"Error reading PDF resume: {e}")
            raise ResumeAnalyzerException("Error reading PDF resume", sys)
