# ResumeScorer

> **AI-powered resume analysis and scoring system built with Python and FastAPI.**

ResumeScorer is an intelligent backend system designed to analyze resumes against job requirements and provide
structured insights into candidate suitability.

The project combines **Natural Language Processing (NLP), Large Language Models (LLMs), semantic search, document
processing, and a modular Python architecture** to build a foundation for automated resume evaluation.

The goal is to transform unstructured resume documents into meaningful, structured information that can be used for
candidate evaluation, job matching, and recruitment workflows.

---

## ✨ Overview

Recruiters and hiring teams often need to evaluate large numbers of resumes against specific job requirements.

ResumeScorer aims to automate part of this process by:

1. Processing resume documents
2. Extracting relevant information
3. Analyzing candidate experience and skills
4. Comparing candidate information with job requirements
5. Using AI-powered reasoning to evaluate relevance
6. Producing structured scoring and analysis

The project is designed with a modular architecture so that individual components—such as document ingestion, AI
processing, prompts, data analysis, and API endpoints—can evolve independently.

---

## 🚀 Key Capabilities

### 📄 Resume Processing

* PDF resume processing
* Document text extraction
* Structured resume analysis
* File-based input handling
* Extensible document ingestion pipeline

### 🧠 AI & NLP

* Large Language Model integration
* Prompt-driven resume analysis
* Semantic analysis
* AI-assisted candidate evaluation
* Support for multiple AI providers
* LangChain-based AI orchestration
* LangGraph-based workflow capabilities

### 🔎 Semantic Search

* Vector-based document processing
* FAISS integration
* Embedding-based similarity workflows
* Foundation for semantic resume/job matching

### ⚡ API

Built with **FastAPI**, providing a lightweight and extensible REST API foundation.

The application is structured to allow AI and resume-processing capabilities to be exposed through clean API endpoints.

### 🧩 Modular Architecture

The project separates responsibilities into dedicated modules for:

* API handling
* Resume processing
* Data ingestion
* Data analysis
* Prompt management
* Models
* Configuration
* Exceptions
* Logging
* Utilities
* Templates

This structure makes the system easier to extend and maintain.

---

## 🏗️ Architecture

The project follows a modular processing pipeline:

```text
                    ┌─────────────────────┐
                    │      Client         │
                    │  Web / API / App    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │     API Layer       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Resume Processing   │
                    │   & Data Ingestion  │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
       ┌──────────────────┐       ┌──────────────────┐
       │ Document Parsing │       │   Data Analysis  │
       │    / Extraction  │       │    / Processing  │
       └────────┬─────────┘       └────────┬─────────┘
                │                          │
                └────────────┬─────────────┘
                             ▼
                    ┌─────────────────────┐
                    │ AI / NLP Pipeline   │
                    │                     │
                    │ LLMs                │
                    │ LangChain           │
                    │ LangGraph           │
                    │ Embeddings          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Semantic Retrieval  │
                    │      / FAISS        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Structured Analysis │
                    │   & Resume Score    │
                    └─────────────────────┘
```

---

## 🛠️ Technology Stack

| Category                | Technology                 |
|-------------------------|----------------------------|
| Language                | Python                     |
| API Framework           | FastAPI                    |
| Data Validation         | Pydantic                   |
| AI Orchestration        | LangChain                  |
| Agent / Workflow Graphs | LangGraph                  |
| LLM Providers           | Google GenAI, Groq         |
| Vector Search           | FAISS                      |
| PDF Processing          | PyMuPDF, pypdf             |
| Database Layer          | SQLAlchemy                 |
| Data Processing         | Pandas, NumPy              |
| Web UI / Prototyping    | Streamlit                  |
| Testing                 | Pytest                     |
| Logging                 | Structlog / Custom Logging |
| Package Management      | setuptools                 |
| Server                  | Uvicorn                    |

The dependency stack currently includes FastAPI, Pydantic, SQLAlchemy, FAISS, PyMuPDF, LangChain, LangGraph, Google
GenAI, Groq, Streamlit, and pytest.

---

## 📁 Project Structure

```text
ResumeScorer/
│
├── apis/
│   ├── __init__.py
│   └── main.py
│
├── config/
│
├── data/
│
├── exceptions/
│
├── logger/
│
├── models/
│   ├── __init__.py
│   └── models.py
│
├── prompts/
│   ├── __init__.py
│   └── prompts_library.py
│
├── src/
│   └── resume_scorer/
│       ├── __init__.py
│       ├── data_analysis.py
│       └── data_ingestion.py
│
├── templates/
│
├── utils/
│
├── tests.py
├── test_main.http
├── main.py
├── requirements.txt
├── setup.py
└── README.md
```

The repository is organized around separate API, configuration, model, prompt, processing, logging, exception, and
utility components, with the core resume-processing package located under `src/resume_scorer`.

---

## 🔄 Processing Workflow

A typical ResumeScorer workflow is designed around the following stages:

### 1. Resume ingestion

A resume is provided to the application as a supported document.

### 2. Document extraction

The document-processing layer extracts usable textual information from the resume.

### 3. Data analysis

Extracted information is analyzed to identify relevant candidate attributes such as:

* Skills
* Experience
* Education
* Technologies
* Qualifications
* Professional background

### 4. Semantic processing

The system can use embeddings and vector retrieval to represent and compare textual information.

FAISS provides the foundation for efficient vector similarity search.

### 5. AI reasoning

LLM-powered components can analyze the extracted information and generate higher-level insights using configurable
prompts.

### 6. Scoring

The candidate profile can then be evaluated against defined job requirements to produce structured scoring and analysis.

---

## 🤖 AI Architecture

One of the main goals of the project is to separate **document processing** from **AI reasoning**.

The AI layer is designed to support multiple providers rather than coupling the application to a single model.

Current dependencies include:

* Google GenAI
* Groq
* LangChain
* LangGraph
* FAISS

This allows the project to evolve from simple LLM calls toward more sophisticated retrieval and workflow-based AI
systems.

---

## 📊 Resume Scoring Concept

The scoring pipeline can be extended to evaluate a candidate across multiple dimensions.

For example:

| Dimension        | Purpose                                                |
|------------------|--------------------------------------------------------|
| Skills           | Match candidate skills with job requirements           |
| Experience       | Evaluate relevant professional experience              |
| Education        | Compare educational background                         |
| Technologies     | Identify relevant technical stack                      |
| Responsibilities | Compare previous responsibilities with the target role |
| Semantic Match   | Measure contextual similarity                          |
| Overall Fit      | Aggregate the evaluation                               |

A future scoring implementation can combine deterministic rules with semantic similarity and LLM-based reasoning.

> **Important:** Resume scores should be treated as decision-support signals rather than definitive hiring decisions.
> Automated scoring can contain bias, miss context, or incorrectly interpret information.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Mohammadalijafari/ResumeScorer.git
cd ResumeScorer
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on macOS/Linux:

```bash
source .venv/bin/activate
```

Windows:

```powershell
.venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

The repository also includes a `setup.py` package definition for the `resume_scorer` package.

---

## 🔐 Environment Configuration

Create a `.env` file for credentials and environment-specific configuration.

Example:

```env
GOOGLE_API_KEY=your_google_api_key
GROQ_API_KEY=your_groq_api_key

# Add additional application configuration here
```

Never commit API keys, credentials, or other secrets to the repository.

---

## ▶️ Running the API

Start the FastAPI application with Uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive documentation is available at:

```text
http://127.0.0.1:8000/docs
```

and the alternative API documentation at:

```text
http://127.0.0.1:8000/redoc
```

---

## 🧪 Testing

Run the test suite with:

```bash
pytest
```

You can also run:

```bash
pytest -v
```

The repository currently includes test infrastructure and an HTTP test file for exercising the API.

---

## 🧪 Example API

The current FastAPI entry point exposes a minimal health-style endpoint:

```http
GET /
```

Response:

```json
{
  "message": "Hello World"
}
```

It also contains a parameterized example endpoint:

```http
GET /hello/{name}
```

Example:

```http
GET /hello/Ali
```

Response:

```json
{
  "message": "Hello Ali"
}
```

These endpoints currently serve as the basic API foundation while the resume-processing functionality is developed
around the project's modular components.

---

## 🎯 Project Goals

ResumeScorer is being developed with several long-term goals:

* Build a reliable resume-processing pipeline
* Extract structured information from unstructured documents
* Compare resumes against job descriptions
* Introduce semantic candidate matching
* Combine deterministic scoring with LLM reasoning
* Support multiple LLM providers
* Provide a clean REST API
* Build reusable AI processing components
* Improve recruitment workflow automation
* Maintain a modular and testable architecture

---

## 🗺️ Roadmap

### Phase 1 — Foundation

* [x] FastAPI application
* [x] Modular project structure
* [x] Resume-processing package
* [x] Document processing dependencies
* [x] Prompt management
* [x] AI provider integrations
* [x] Vector-search foundation
* [x] Testing foundation

### Phase 2 — Resume Analysis

* [ ] Robust resume parsing
* [ ] Structured candidate profile extraction
* [ ] Skill extraction
* [ ] Experience extraction
* [ ] Education extraction
* [ ] Technology detection

### Phase 3 — Job Matching

* [ ] Job-description ingestion
* [ ] Resume ↔ Job semantic matching
* [ ] Skill-gap analysis
* [ ] Match scoring
* [ ] Explainable scoring results

### Phase 4 — AI Evaluation

* [ ] Multi-step AI evaluation pipeline
* [ ] Structured LLM outputs
* [ ] Model/provider abstraction
* [ ] Improved prompt management
* [ ] Evaluation benchmarks

### Phase 5 — Production

* [ ] Authentication
* [ ] Persistent database layer
* [ ] Background processing
* [ ] Docker support
* [ ] CI/CD
* [ ] Observability
* [ ] Production deployment
* [ ] API versioning

---

## 🔭 Future Architecture

The intended direction is to evolve the project toward:

```text
                         ┌──────────────────┐
                         │   Resume / CV    │
                         └────────┬─────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │ Document Processing │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │ Structured Profile  │
                       └──────────┬──────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
          ┌──────────────────┐       ┌──────────────────┐
          │ Resume Embedding │       │ Job Description  │
          │                  │       │    Embedding     │
          └────────┬─────────┘       └────────┬─────────┘
                   │                          │
                   └────────────┬─────────────┘
                                ▼
                      ┌─────────────────────┐
                      │ Semantic Matching   │
                      └──────────┬──────────┘
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │ AI Evaluation Layer │
                      └──────────┬──────────┘
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │ Explainable Score   │
                      │ + Recommendations   │
                      └─────────────────────┘
```

---

## 🧠 Engineering Principles

The project emphasizes:

### Separation of concerns

API, processing, AI orchestration, prompts, models, configuration, and utilities are kept in separate components.

### Provider flexibility

The system is designed to work with different AI providers instead of depending on one model vendor.

### Structured AI

AI outputs should ultimately be converted into structured, machine-readable data rather than relying solely on free-form
text.

### Explainability

A useful resume score should explain **why** a candidate received a particular score instead of producing an unexplained
number.

### Extensibility

The architecture is intended to make it straightforward to introduce new models, scoring strategies, document formats,
and matching algorithms.

---

## ⚠️ Current Status

> **This project is actively under development.**

The repository currently contains the foundational FastAPI application and modular resume-scoring architecture, while
several production-level components and complete scoring workflows remain under development.

The project should therefore be considered a **development/portfolio project rather than a production recruitment system
**.

---

## 🔒 Responsible AI Considerations

Automated resume evaluation should never be treated as an unquestionable hiring decision.

ResumeScorer is intended to provide **decision-support information**, not replace human judgment.

When developing or deploying resume-ranking systems, particular attention should be paid to:

* Bias in training data
* Bias introduced by LLMs
* Protected characteristics
* Missing or incomplete resume information
* False positives and false negatives
* Explainability
* Data privacy
* Candidate consent
* Secure document handling

The system should evaluate **job-relevant qualifications**, not protected or irrelevant personal characteristics.

---

## 📚 Technologies & Concepts Demonstrated

This project demonstrates practical work with:

* Python backend development
* FastAPI
* REST APIs
* Pydantic
* AI/LLM integration
* Prompt engineering
* LangChain
* LangGraph
* Semantic search
* Vector databases / vector indexing
* FAISS
* PDF processing
* Data ingestion
* Data analysis
* SQLAlchemy
* Testing with pytest
* Modular application architecture
* API-oriented system design

---

## 🤝 Contributing

Contributions, ideas, and improvements are welcome.

Typical contribution workflow:

```bash
git checkout -b feature/your-feature
```

Make your changes, add tests where appropriate, and submit a pull request.

For larger changes, open an issue first to discuss the proposed architecture or implementation.

---

## 📄 License

This project is currently maintained as a personal development and portfolio project.

Add an explicit open-source license to this repository before presenting it as an open-source project.

---

## 👨‍💻 Author

**Mohammadali Jafari**

Backend Developer focused on:

* Python
* FastAPI
* Django
* REST APIs
* Backend Architecture
* AI/LLM Applications
* SQL & Data Systems

---

## ⭐ If You Find This Project Useful

If you find the project interesting, consider giving it a ⭐ on GitHub.

Feedback, suggestions, and technical discussions are welcome.

---

<p align="center">
  Built with Python, FastAPI, and AI
</p>
