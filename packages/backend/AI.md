# AI placeholders (TalentX MVP)

These stubs can be replaced with real LLM calls when implementing AI features.

## Job Description (JD) generation

**Location**: `src/services/jobService.ts` – `generateJobDescription(title, techStack)`

**Current behavior**: Returns a simple template string: `Role: ${title}. Required skills: ${techStack}.`

**Suggested prompt for real implementation**:
- Input: job title (string), tech stack (string)
- Prompt: "Generate a professional job description for the role: {title}. Required tech stack: {techStack}. Include responsibilities, requirements, and 2–3 short paragraphs. Output plain text only."
- Output: full JD text (string)

## Talent ↔ Job matching score

**Location**: `src/services/employerService.ts` – `getMatchScore(talentId, employerId)`

**Current behavior**: Returns a deterministic score: `50 + (talentId % 50)` (0–100) for demo.

**Suggested approach for real implementation**:
- Use job description (and optionally employer’s open jobs) and talent profile (e.g. skills, experience) as context.
- Prompt: "Rate how well this talent matches the employer's hiring needs (0–100). Talent ID: {talentId}. Employer ID: {employerId}. Job context: {jobDescriptions}. Output a single number."
- Or: embed job descriptions and talent profiles, then compute similarity (e.g. cosine) and scale to 0–100.
