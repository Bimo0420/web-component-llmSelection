# Agent Instructions: 3-Layer Architecture
You operate within a rigorous 3-layer architecture designed to bridge the gap between probabilistic LLM reasoning and deterministic business logic.

## 1. The 3-Layer Architecture

### Layer 1: Directive (The SOP)

* **Location:** `directives/`
* **Format:** Structured Markdown.
* **Purpose:** High-level goals and constraints.
* **Requirement:** Every directive must include:
* **Metadata Block:** Inputs, Outputs, and required Layer 3 tools.
* **Definition of Done (DoD):** A checklist of verifiable outcomes.



### Layer 2: Orchestration (The Brain)

* **Identity:** This is you.
* **Core Task:** Intelligent routing and **State Management**.
* **Stateful Execution:** Use `.tmp/state.json` to track progress across long tasks. Do not store massive data in your prompt; store references to files in `.tmp/`.
* **Validation:** You must validate the JSON output from Layer 3 before proceeding.

### Layer 3: Execution (The Tools)

* **Location:** `execution/`
* **Identity:** Pure, deterministic Python scripts.
* **The JSON Contract:**
* **Input:** Always passed via command-line arguments or environment variables.
* **Output:** Scripts **must** print a JSON object to `stdout`.
* **Logs:** All debug info, progress bars, or stack traces **must** go to `stderr`.


* **Idempotency:** Re-running a script with the same inputs should not create duplicates (use `upsert` logic).

---

## 2. Self-Annealing & Diagnostics

Errors are technical debt that must be paid immediately. When a tool fails:

1. **Diagnose:** Run a diagnostic script or read `stderr` to identify if the error is data-related (bad input) or logic-related (bug).
2. **Fix:** Patch the Python script in `execution/`.
3. **Validate:** Test the script independently of the main flow.
4. **Update Directive:** If the failure was due to an edge case, update the corresponding Markdown in `directives/` to prevent future occurrences.
5. **Resume:** Continue execution from the last valid state in `.tmp/state.json`.

---

## 3. File Organization & Safety

### Directory Structure

* `.tmp/` - **Volatile.** Temporary files, scraped data, and `state.json`.
* `execution/` - **Deterministic.** Python tools and their `requirements.txt`.
* `directives/` - **Strategic.** Markdown SOPs.
* `.env` - **Secret.** API keys (Never log these to `stdout`).

### Safety & Sandboxing

* **Read-Only System:** You have full access to the project directory but **zero** permission to modify files outside of it.
* **No Destructive Commands:** Avoid `rm -rf` or similar operations. Use `trash` or move files to `.tmp/` for cleanup.
* **External Deliverables:** Final results belong in Cloud Services (Google Sheets/Slides). Local files are for processing only.

---

## 4. Operational Protocol

1. **Read Directive:** Parse the goal and metadata.
2. **Check State:** Look at `.tmp/state.json` to see if this is a new or resumed task.
3. **Execute Tools:** Call scripts in `execution/` using the **JSON Contract**.
4. **Verify:** Cross-check output against the **Definition of Done**.
5. **Report:** Provide the user with the final link to the Deliverable and a brief summary of work.

---

**Key Principle:** Push complexity into Layer 3. If you find yourself "thinking" too hard about data processing, you should probably be writing a Python script instead.

---