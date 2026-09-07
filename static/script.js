/* ===================================================================
   Resume Scorer — Frontend interactivity
   Front-end only: no network calls to the real /scorer endpoint.
   `runMockAnalysis()` stands in for that response so the dashboard
   can be wired up and previewed on its own. Swap it for a real
   fetch() to POST /scorer once the UI is approved.
=================================================================== */

(() => {
    "use strict";

    /* ---------------------------------------------------------------
       Element references
    --------------------------------------------------------------- */
    const themeToggle = document.getElementById("theme-toggle");
    const helpToggle = document.getElementById("help-toggle");
    const helpOverlay = document.getElementById("help-overlay");
    const helpClose = document.getElementById("help-close");

    const uploadView = document.getElementById("upload-view");
    const resultsView = document.getElementById("results-view");

    const analysisForm = document.getElementById("analysis-form");
    const dropzone = document.getElementById("dropzone");
    const resumeInput = document.getElementById("resume-input");
    const fileNameDisplay = document.getElementById("file-name-display");
    const jobDescription = document.getElementById("job-description");
    const analyzeButton = document.getElementById("analyze-button");
    const formError = document.getElementById("form-error");

    const newAnalysisButton = document.getElementById("new-analysis-button");

    const scoreNumberEl = document.getElementById("score-number");
    const scoreRingProgress = document.getElementById("score-ring-progress");
    const scoreDescriptionEl = document.getElementById("score-description");

    const skillsSummaryEl = document.getElementById("skills-summary");
    const experienceSummaryEl = document.getElementById("experience-summary");
    const educationSummaryEl = document.getElementById("education-summary");
    const complianceSummaryEl = document.getElementById("compliance-summary");

    const strengthsListEl = document.getElementById("strengths-list");
    const improvementsListEl = document.getElementById("improvements-list");

    const RING_CIRCUMFERENCE = 2 * Math.PI * 60; // r = 60

    let charts = {}; // keep chart instances so we can destroy/rebuild cleanly

    /* ---------------------------------------------------------------
       Theme toggle (persists for the session only)
    --------------------------------------------------------------- */
    themeToggle.addEventListener("click", () => {
        const root = document.documentElement;
        const isLight = root.getAttribute("data-theme") === "light";
        root.setAttribute("data-theme", isLight ? "dark" : "light");
        themeToggle.setAttribute("aria-pressed", String(!isLight));
        themeToggle.setAttribute("aria-label", isLight ? "Switch to light mode" : "Switch to dark mode");
        refreshChartTheme();
    });

    /* ---------------------------------------------------------------
       Help dialog
    --------------------------------------------------------------- */
    function openHelp() {
        helpOverlay.hidden = false;
        helpToggle.setAttribute("aria-expanded", "true");
        helpClose.focus();
    }

    function closeHelp() {
        helpOverlay.hidden = true;
        helpToggle.setAttribute("aria-expanded", "false");
        helpToggle.focus();
    }

    helpToggle.addEventListener("click", openHelp);
    helpClose.addEventListener("click", closeHelp);
    helpOverlay.addEventListener("click", (event) => {
        if (event.target === helpOverlay) closeHelp();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !helpOverlay.hidden) closeHelp();
    });

    /* ---------------------------------------------------------------
       Upload: drag-and-drop + file picker
    --------------------------------------------------------------- */
    let selectedFile = null;

    dropzone.addEventListener("click", () => resumeInput.click());
    dropzone.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            resumeInput.click();
        }
    });

    resumeInput.addEventListener("change", () => {
        if (resumeInput.files && resumeInput.files[0]) {
            handleFileSelection(resumeInput.files[0]);
        }
    });

    ["dragenter", "dragover"].forEach((eventName) => {
        dropzone.addEventListener(eventName, (event) => {
            event.preventDefault();
            dropzone.classList.add("is-dragover");
        });
    });

    ["dragleave", "dragend"].forEach((eventName) => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.remove("is-dragover");
        });
    });

    dropzone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropzone.classList.remove("is-dragover");
        const file = event.dataTransfer.files && event.dataTransfer.files[0];
        if (file) handleFileSelection(file);
    });

    function handleFileSelection(file) {
        if (file.type !== "application/pdf") {
            showFormError("Please choose a PDF file.");
            return;
        }
        selectedFile = file;
        fileNameDisplay.textContent = file.name;
        fileNameDisplay.hidden = false;
        dropzone.classList.add("has-file");
        clearFormError();
    }

    function showFormError(message) {
        formError.textContent = message;
        formError.hidden = false;
    }

    function clearFormError() {
        formError.hidden = true;
        formError.textContent = "";
    }

    /* ---------------------------------------------------------------
       Form submit → analyze
    --------------------------------------------------------------- */
    analysisForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearFormError();

        if (!selectedFile) {
            showFormError("Upload a resume PDF before analyzing.");
            return;
        }
        if (!jobDescription.value.trim()) {
            showFormError("Paste a job description before analyzing.");
            return;
        }

        setLoading(true);
        try {
            const analysis = await runMockAnalysis(selectedFile, jobDescription.value);
            renderResults(analysis);
            showResultsView();
        } catch (err) {
            showFormError("Something went wrong while analyzing your resume. Please try again.");
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        analyzeButton.disabled = isLoading;
        analyzeButton.classList.toggle("is-loading", isLoading);
    }

    /* ---------------------------------------------------------------
       Mock analysis — mirrors the backend's ResumeScore schema:
       overall_score, score_description, skills_match, experience_match,
       education_match, job_compliance, additional_points, improvements.
       Replace with a real POST /scorer call when wiring up the backend.
    --------------------------------------------------------------- */
    function runMockAnalysis(file, jobDescriptionText) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    overall_score: 74,
                    score_description:
                        "A solid match for this role. Core backend skills and recent experience line up well with what the job asks for, though a couple of specific tools and a bit more seniority would strengthen the fit.",
                    skills_match: {
                        score: 78,
                        matched: ["Python", "Django", "REST APIs", "PostgreSQL", "Git", "Docker"],
                        missing: ["Kubernetes", "GraphQL", "AWS"]
                    },
                    experience_match: {
                        score: 65,
                        relevant_years: 3,
                        required_years: 5,
                        relevant_percentage: 70
                    },
                    education_match: {
                        score: 90,
                        degree_level_match: 100,
                        field_of_study_match: 80
                    },
                    job_compliance: {
                        score: 72,
                        categories: {
                            "Must-have skills": 82,
                            "Experience level": 60,
                            "Certifications": 45,
                            "Soft skills": 88
                        }
                    },
                    additional_points: [
                        "Clear, well-structured project descriptions that are easy to skim",
                        "Demonstrated mentoring and team collaboration experience",
                        "Consistent use of measurable outcomes in recent roles",
                        "Comfortable working across the full backend stack"
                    ],
                    improvements: [
                        "Add cloud platform experience (AWS, GCP, or Azure) if you have any",
                        "Quantify the impact of past projects with more specific metrics",
                        "Highlight any exposure to Kubernetes or container orchestration",
                        "Mention certifications relevant to the target role, if applicable"
                    ]
                });
            }, 1400);
        });
    }

    /* ---------------------------------------------------------------
       Render results into the DOM + charts
    --------------------------------------------------------------- */
    function renderResults(data) {
        animateScore(data.overall_score);
        scoreDescriptionEl.textContent = data.score_description;

        // Skills
        const skills = data.skills_match;
        skillsSummaryEl.textContent =
            `${skills.matched.length} matching skills found, ${skills.missing.length} missing.`;
        renderSkillsChart(skills);

        // Experience
        const experience = data.experience_match;
        experienceSummaryEl.textContent =
            `${experience.relevant_years} of ${experience.required_years} required years are directly relevant.`;
        renderExperienceCharts(experience);

        // Education
        const education = data.education_match;
        educationSummaryEl.textContent =
            "Degree level and field of study compared against the role's requirements.";
        renderEducationChart(education);

        // Job compliance
        const compliance = data.job_compliance;
        complianceSummaryEl.textContent =
            "How the resume holds up across each job-requirement category.";
        renderComplianceChart(compliance);

        // Lists
        fillList(strengthsListEl, data.additional_points);
        fillList(improvementsListEl, data.improvements);
    }

    function fillList(listEl, items) {
        listEl.innerHTML = "";
        items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            listEl.appendChild(li);
        });
    }

    function animateScore(score) {
        scoreNumberEl.textContent = "0";
        const offset = RING_CIRCUMFERENCE - (score / 100) * RING_CIRCUMFERENCE;

        // Force reflow so the transition re-triggers on repeat analyses.
        scoreRingProgress.style.transition = "none";
        scoreRingProgress.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
        void scoreRingProgress.getBoundingClientRect();
        scoreRingProgress.style.transition = "";

        requestAnimationFrame(() => {
            scoreRingProgress.style.strokeDashoffset = String(offset);
        });

        let current = 0;
        const duration = 900;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            current = Math.round(progress * score);
            scoreNumberEl.textContent = String(current);
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    /* ---------------------------------------------------------------
       Chart theming helpers
    --------------------------------------------------------------- */
    function themeColor(varName) {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }

    function chartFonts() {
        return {family: "Inter, sans-serif", size: 11};
    }

    function destroyChart(key) {
        if (charts[key]) {
            charts[key].destroy();
            delete charts[key];
        }
    }

    /* ---------------------------------------------------------------
       Skills radar chart
    --------------------------------------------------------------- */
    function renderSkillsChart(skills) {
        destroyChart("skills");
        const ctx = document.getElementById("skills-chart");
        const labels = [...skills.matched, ...skills.missing];
        const values = [
            ...skills.matched.map(() => 100),
            ...skills.missing.map(() => 0)
        ];

        charts.skills = new Chart(ctx, {
            type: "radar",
            data: {
                labels,
                datasets: [{
                    label: "Skill present",
                    data: values,
                    backgroundColor: "rgba(139, 124, 246, 0.22)",
                    borderColor: themeColor("--accent-violet") || "#8b7cf6",
                    pointBackgroundColor: themeColor("--accent-violet") || "#8b7cf6",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {legend: {display: false}},
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {display: false},
                        grid: {color: themeColor("--border-soft") || "rgba(139,124,246,0.16)"},
                        angleLines: {color: themeColor("--border-soft") || "rgba(139,124,246,0.16)"},
                        pointLabels: {
                            color: themeColor("--text-muted") || "#9096ba",
                            font: chartFonts()
                        }
                    }
                }
            }
        });
    }

    /* ---------------------------------------------------------------
       Experience: bar (years) + donut (relevance)
    --------------------------------------------------------------- */
    function renderExperienceCharts(experience) {
        destroyChart("experienceBar");
        destroyChart("experienceDonut");

        const barCtx = document.getElementById("experience-bar-chart");
        charts.experienceBar = new Chart(barCtx, {
            type: "bar",
            data: {
                labels: ["Your experience", "Required"],
                datasets: [{
                    data: [experience.relevant_years, experience.required_years],
                    backgroundColor: [themeColor("--accent-blue") || "#5b8def", themeColor("--border-strong") || "rgba(139,124,246,0.32)"],
                    borderRadius: 8,
                    maxBarThickness: 42
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {legend: {display: false}},
                scales: {
                    x: {
                        ticks: {color: themeColor("--text-muted") || "#9096ba", font: chartFonts()},
                        grid: {display: false}
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {color: themeColor("--text-muted") || "#9096ba", font: chartFonts()},
                        grid: {color: themeColor("--border-soft") || "rgba(139,124,246,0.12)"}
                    }
                }
            }
        });

        const donutCtx = document.getElementById("experience-donut-chart");
        charts.experienceDonut = new Chart(donutCtx, {
            type: "doughnut",
            data: {
                labels: ["Relevant", "Other"],
                datasets: [{
                    data: [experience.relevant_percentage, 100 - experience.relevant_percentage],
                    backgroundColor: [themeColor("--accent-blue") || "#5b8def", themeColor("--bg-raised") || "#1e2447"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "68%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: themeColor("--text-muted") || "#9096ba",
                            font: chartFonts(),
                            boxWidth: 10,
                            padding: 10
                        }
                    }
                }
            }
        });
    }

    /* ---------------------------------------------------------------
       Education: two-bar comparison
    --------------------------------------------------------------- */
    function renderEducationChart(education) {
        destroyChart("education");
        const ctx = document.getElementById("education-chart");
        charts.education = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Degree level", "Field of study"],
                datasets: [{
                    data: [education.degree_level_match, education.field_of_study_match],
                    backgroundColor: [themeColor("--accent-teal") || "#46d1b8", themeColor("--accent-violet") || "#8b7cf6"],
                    borderRadius: 8,
                    maxBarThickness: 46
                }]
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {legend: {display: false}},
                scales: {
                    x: {
                        min: 0,
                        max: 100,
                        ticks: {color: themeColor("--text-muted") || "#9096ba", font: chartFonts()},
                        grid: {color: themeColor("--border-soft") || "rgba(139,124,246,0.12)"}
                    },
                    y: {
                        ticks: {color: themeColor("--text-muted") || "#9096ba", font: chartFonts()},
                        grid: {display: false}
                    }
                }
            }
        });
    }

    /* ---------------------------------------------------------------
       Job compliance: radar across categories
    --------------------------------------------------------------- */
    function renderComplianceChart(compliance) {
        destroyChart("compliance");
        const ctx = document.getElementById("compliance-chart");
        const labels = Object.keys(compliance.categories);
        const values = Object.values(compliance.categories);

        charts.compliance = new Chart(ctx, {
            type: "radar",
            data: {
                labels,
                datasets: [{
                    label: "Compliance",
                    data: values,
                    backgroundColor: "rgba(243, 185, 95, 0.2)",
                    borderColor: themeColor("--accent-amber") || "#f3b95f",
                    pointBackgroundColor: themeColor("--accent-amber") || "#f3b95f",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {legend: {display: false}},
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {display: false},
                        grid: {color: themeColor("--border-soft") || "rgba(139,124,246,0.16)"},
                        angleLines: {color: themeColor("--border-soft") || "rgba(139,124,246,0.16)"},
                        pointLabels: {
                            color: themeColor("--text-muted") || "#9096ba",
                            font: chartFonts()
                        }
                    }
                }
            }
        });
    }

    function refreshChartTheme() {
        // Re-render any existing charts so colors follow the new theme.
        if (resultsView.hidden) return;
        if (charts.skills) {
            const labels = charts.skills.data.labels;
            const matchedCount = charts.skills.data.datasets[0].data.filter(v => v === 100).length;
            renderSkillsChart({matched: labels.slice(0, matchedCount), missing: labels.slice(matchedCount)});
        }
    }

    /* ---------------------------------------------------------------
       View switching
    --------------------------------------------------------------- */
    function showResultsView() {
        uploadView.hidden = true;
        resultsView.hidden = false;
        resultsView.classList.remove("is-entering");
        void resultsView.offsetWidth;
        resultsView.classList.add("is-entering");
        resultsView.scrollIntoView({behavior: "smooth", block: "start"});
    }

    function showUploadView() {
        resultsView.hidden = true;
        uploadView.hidden = false;
        uploadView.classList.remove("is-entering");
        void uploadView.offsetWidth;
        uploadView.classList.add("is-entering");
    }

    newAnalysisButton.addEventListener("click", () => {
        Object.keys(charts).forEach(destroyChart);

        selectedFile = null;
        resumeInput.value = "";
        fileNameDisplay.hidden = true;
        fileNameDisplay.textContent = "";
        dropzone.classList.remove("has-file");
        jobDescription.value = "";
        clearFormError();

        showUploadView();
    });

})();