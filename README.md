# Resume Scorer

**AI-powered resume analysis and job-matching tool, built with FastAPI, LangChain, and a dark-themed web dashboard.**

Resume Scorer takes a candidate's resume (PDF) and a job description, extracts the resume text, sends both to an LLM
through a structured prompt, and returns a scored breakdown of how well the resume fits the role — covering skills,
experience, education, and overall job compliance, plus concrete suggestions for improvement.

---

## ✨ What it does

1. **Upload** a resume as a PDF and paste in a job description.
2. The backend **extracts the resume text** (via PyMuPDF) and saves the upload to a per-session folder.
3. A **LangChain-orchestrated LLM call** (Google Gemini or Groq) compares the resume against the job description using a
   structured prompt and a Pydantic output schema.
4. The API returns a **structured JSON result**: an overall score (0–100), a written summary, and per-category
   breakdowns for skills, experience, education, and job compliance, along with lists of strengths and suggested
   improvements.
5. A **dashboard UI** (dark theme, Chart.js visualizations) is served at `/` for viewing the analysis.

---

## 🖥️ Frontend

The `templates/index.html` + `static/style.css` + `static/script.js` files implement a dark, purple-blue-accented
dashboard:

- Drag-and-drop resume upload with a job-description text area
- An animated overall-score ring
- Radar/bar/donut charts (Chart.js) for skills, experience, education, and job compliance
- Strength and improvement lists
- A light/dark theme toggle and an in-app help dialog
- A "Start new analysis" reset flow

> **Current status:** the dashboard is fully built and interactive, but `static/script.js` currently renders results
> from a local mock dataset (`runMockAnalysis()`) rather than calling the live API, so it can be reviewed and styled
> independently of the backend. To connect it, replace `runMockAnalysis()` with a `fetch()` call to `POST /scorer` — the
> rendering code already expects a response shaped exactly like the `/scorer` endpoint's output (
> see [API Reference](#-api-reference)).

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      Client          │
                    │  Browser dashboard   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI         │
                    │     API Layer        │
                    │  (apis/main.py)      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Resume Ingestion     │
                    │ (ResumeHandler)      │
                    │ save PDF → extract   │
                    │ text via PyMuPDF     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Resume Analysis      │
                    │ (ResumeAnalyzer)     │
                    │ LangChain prompt →   │
                    │ LLM → JSON parser    │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
       ┌──────────────────┐       ┌──────────────────┐
       │  Google Gemini    │       │       Groq       │
       │ (gemini-2.0-flash)│       │ (gpt-oss-20b)     │
       └──────────┬─────────┘       └────────┬─────────┘
                  └─────────────┬─────────────┘
                                ▼
                    ┌─────────────────────┐
                    │ Structured Resume    │
                    │ Score (Pydantic)     │
                    └─────────────────────┘
```

---

## 🛠️ Technology stack

| Category                | Technology                                     |
|-------------------------|------------------------------------------------|
| Language                | Python 3                                       |
| API framework           | FastAPI + Uvicorn                              |
| Data validation         | Pydantic                                       |
| AI orchestration        | LangChain, LangChain-classic                   |
| LLM providers           | Google Gemini (`langchain-google-genai`), Groq |
| PDF processing          | PyMuPDF (`fitz`)                               |
| Templating              | Jinja2                                         |
| Config                  | PyYAML + `python-dotenv`                       |
| Logging                 | `structlog` + custom `CustomLogger`            |
| Frontend                | HTML, CSS, vanilla JavaScript, Chart.js        |
| Fonts                   | Poppins (display), Inter (body)                |
| Testing                 | pytest                                         |
| Vector search (planned) | FAISS                                          |

---

## 📁 Project structure

```text
ResumeScorer/
│
├── apis/
│   ├── __init__.py
│   └── main.py                # FastAPI app: routes, static/template mounts
│
├── config/
│   └── config.yaml             # LLM provider configuration
│
├── data/
│   └── CV.pdf                  # Sample resume used by tests.py
│
├── exceptions/
│   └── custom_exception.py     # ResumeAnalyzerException
│
├── logger/
│   └── custom_logger.py        # structlog-based logger (writes to logger/logs/)
│
├── models/
│   └── models.py               # ResumeScore Pydantic schema
│
├── prompts/
│   └── prompts_library.py      # Resume-analysis prompt template
│
├── src/
│   └── resume_scorer/
│       ├── data_ingestion.py   # ResumeHandler: save/read PDF resumes
│       └── data_analysis.py    # ResumeAnalyzer: LLM call + structured parsing
│
├── static/
│   ├── style.css                # Dashboard styling (dark theme)
│   └── script.js                # Dashboard interactivity + charts
│
├── templates/
│   └── index.html               # Dashboard markup, served at "/"
│
├── utils/
│   ├── config_loader.py         # Loads config/config.yaml
│   └── model_loader.py          # Builds the LangChain LLM client
│
├── tests.py                     # Manual smoke-test script
├── test_main.http                # Sample HTTP requests
├── requirements.txt
├── setup.py
└── README.md
```

---

## 🚀 Getting started

### Prerequisites

- Python 3.10+ (developed against Python 3.14)
- An API key for at least one supported LLM provider:
    - **Google Gemini** — [Google AI Studio](https://aistudio.google.com/) API key
    - **Groq** — [Groq Console](https://console.groq.com/) API key

### 1. Clone the repository

```bash
git clone https://github.com/Mohammadalijafari/ResumeScorer.git
cd ResumeScorer
```

### 2. Create a virtual environment and install dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment variables

`utils/model_loader.py` requires both of the following to be set (even if you only plan to use one provider):

```bash
# .env
GOOGLE_API_KEY=your_google_api_key
GROQ_API_KEY=your_groq_api_key

# Optional — selects which provider block in config/config.yaml is used.
# Defaults to "google" if not set.
LLM_PROVIDER=google
```

Provider-specific settings (model name, temperature, max tokens) live in `config/config.yaml` and can be edited
directly.

### 4. Run the server

```bash
uvicorn apis.main:app --reload
```

The dashboard is served at **http://127.0.0.1:8000/**.

---

## 📡 API reference

### `GET /`

Serves the dashboard UI (`templates/index.html`).

### `GET /health`

Basic health check.

```json
{
  "status": "ok",
  "service": "Resume-Scorer"
}
```

### `POST /scorer`

Analyzes a resume against a job description.

**Request:** `multipart/form-data`

| Field             | Type   | Description                         |
|-------------------|--------|-------------------------------------|
| `resume`          | file   | Resume as a PDF                     |
| `job_description` | string | Full text of the target job posting |

**Response:**

```json
{
  "session_id": "session_20260907_020000_ab12cd34",
  "analysis_result": {
    "overall_score": 74,
    "score_description": "A solid match for this role...",
    "skills_match": {
      "...": "..."
    },
    "experience_match": {
      "...": "..."
    },
    "education_match": {
      "...": "..."
    },
    "job_compliance": {
      "...": "..."
    },
    "additional_points": [
      "...",
      "..."
    ],
    "improvements": [
      "...",
      "..."
    ]
  }
}
```

`skills_match`, `experience_match`, `education_match`, and `job_compliance` are free-form dictionaries — their exact
keys are determined by the LLM's response to the analysis prompt (see `prompts/prompts_library.py` and
`models/models.py`), rather than a fixed sub-schema.

A resume that can't be parsed, or an LLM call that fails, returns a `500` with a `detail` message describing the
failure.

---

## 🔒 Responsible use

Resume Scorer is a decision-support tool, not a hiring decision-maker. Automated scoring can reflect bias present in the
underlying LLM or in how a job description is written. Scores should be reviewed by a human before being used to screen
or rank real candidates, and the system should be evaluated on job-relevant qualifications only — never on protected or
irrelevant personal characteristics.

---

## ⚠️ Current status & known gaps

This project is under active development. A few things worth knowing before you dig in:

- **Frontend is not yet wired to the live API.** `static/script.js` currently analyzes with mock data (
  `runMockAnalysis()`) so the dashboard can be built and reviewed independently. Swapping in a real
  `fetch('/scorer', ...)` call is the next step.
- **`tests.py` references an older class name** (`ResumeAnalyser`) that no longer matches `ResumeAnalyzer` in
  `src/resume_scorer/data_analysis.py`, and calls it without the required `session_id` argument — it will need a small
  update before it runs.
- **No persistent database layer yet** — uploaded resumes and results are stored per-session on disk (
  `data/resume_analysis/<session_id>/`) rather than in a database.
- **No authentication** — the API is currently open, which is fine for local development but should be addressed before
  any public deployment.
- **FAISS / semantic search** is included as a dependency for future work but isn't yet used in the current scoring
  pipeline.

---

## 🤝 Contributing

```bash
git checkout -b feature/your-feature
```

Make your changes, add tests where appropriate, and open a pull request. For larger changes, open an issue first to
discuss the approach.

---

## 📄 License

This project is currently maintained as a personal development and portfolio project. Add an explicit open-source
license before presenting it as an open-source project.

---

## 👨‍💻 Author

**Mohammadali Jafari**
Backend developer focused on Python, FastAPI, Django, REST APIs, backend architecture, AI/LLM applications, and SQL &
data systems.