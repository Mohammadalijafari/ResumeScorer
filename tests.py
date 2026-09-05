import os
from pathlib import Path
from src.resume_scorer.data_ingestion import ResumeHandler
from src.resume_scorer.data_analysis import ResumeAnalyser

CV_PATH = "data/CV.pdf"


class SimFile:
    def __init__(self, file_path):
        self.name = Path(file_path).name
        self._file_path = file_path

    def getbuffer(self):
        return open(self._file_path, "rb").read()


def main():
    dummy_resume = SimFile(CV_PATH)
    handler = ResumeHandler(session_id="test_session")

    saved_path = handler.save_pdf(dummy_resume)

    resume_text = handler.read_pdf(saved_path)
    job_file = "temp_job.txt"

    with open(job_file, "r", encoding="utf-8") as f:
        job_description = f.read()

    analyzer = ResumeAnalyser()

    result = analyzer.analyze_resume(resume_text, job_description)
    print(result)

    for key, value in result.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    main()
