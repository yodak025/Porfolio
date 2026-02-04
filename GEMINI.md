# GEMINI.md - Source of Truth
## Project: Minimalist Astro Portfolio/CV

### 1. Vision & Philosophy
- **Core Concept:** A hyper-minimalist, static-appearing CV/Portfolio.
- **Aesthetic:** "Classic European" meets "Swiss/Brutalist". Elegant, serious, stark black-on-white, but modern and young. Prioritizes clear hierarchy, ample whitespace, and crisp lines.
- **Format:** Emulates a digitized A4 document, primarily for desktop viewing, adapted responsively for mobile. Continuous scroll, no sticky navigation elements visible.
- **Technological Goal:** Utilize Astro as a static site generator and Markdown as a local "headless CMS" for content, ensuring high customizability and rapid content iteration.
- **Future Proofing:** Acknowledged future intent to add hidden interactivity (Phase 2). During Phase 1, the focus remains strictly on the static, classic design and content architecture. The `@old` directory containing prototypes related to future interactivity is to be explicitly ignored.

### 2. Architecture

#### 2.1. Tech Stack
- **Framework:** Astro (current version used: `^5.16.1`).
- **Styling:** TailwindCSS (current version used: `^4.1.17`) with its official Typography plugin (`@tailwindcss/typography`, version `^0.5.19`) for robust markdown styling. Tailwind integration is managed via `@tailwindcss/vite`.
- **Content Storage:** Markdown (.md) files enhanced with YAML Frontmatter for structured metadata.
- **Fonts:** Strict use of Sans-serif fonts (e.g., Inter, Helvetica, Arial, or system-ui) to uphold the Swiss/Brutalist aesthetic.

#### 2.2. File Structure
The content markdown files (`.md`) are located in a `cv/` directory at the project root for direct accessibility and clear separation from `src/`. Astro components are structured to reflect the modular design:

```text
/ (Project Root)
├── cv/                        # CONTENT (The Single Source of Data)
│   ├── contactInfo.md         # Heavily structured frontmatter, minimal body content.
│   ├── summary.md             # Primarily body content.
│   ├── education.md           # Body content with H2s for entries, paragraph-based descriptions.
│   ├── languages.md           # List-based body content.
│   ├── workExperience.md      # Body content with H2s for entries, paragraph-based descriptions.
│   ├── hardSkills.md          # List-based body content.
│   ├── softSkills.md          # List-based body content.
│   └── projects.md            # Body content with H2s for entries, paragraph-based descriptions.
├── src/
│   ├── components/
│   │   ├── BaseSection.astro      # Reusable wrapper for common section structure (title, spacing).
│   │   ├── MarkdownStyler.astro   # Applies Tailwind Typography styles to markdown content.
│   │   ├── ContactSection.astro   # Specialized component for header/contact info, parsing frontmatter.
│   │   ├── EducationSection.astro
│   │   ├── HardSkillsSection.astro
│   │   ├── LanguagesSection.astro
│   │   ├── ProjectsSection.astro
│   │   ├── SoftSkillsSection.astro
│   │   └── SummarySection.astro
│   │   └── WorkExperienceSection.astro
│   ├── layouts/
│   │   └── Layout.astro           # Main HTML shell, global CSS, A4-like container, Print button.
│   ├── pages/
│   │   └── index.astro            # The main page orchestrating the layout and content assembly.
│   └── styles/
│       └── global.css             # Main CSS file, includes Tailwind directives and base styles.
└── astro.config.mjs             # Astro configuration, integrating Tailwind via Vite plugin.
```

### 3. Data & Content Model

**Guiding Principle:** *Structure rigid, machine-readable data in YAML Frontmatter. Structure flexible, human-readable content via Markdown body conventions.*

#### 3.1. Frontmatter (Rigid Metadata)
-   Used for mandatory, structured data (e.g., section title, visibility, specific contact fields).
-   Each `.md` file's frontmatter includes at least `title: "Section Title"` and `visible: true/false`.
-   **Example (ContactInfo):** Fields like `name`, `role`, `email`, `phone`, `location`, `linkedin`, `github`, `web` are defined and parsed directly.

#### 3.2. Markdown Body (Flexible Content with Conventions)
-   **General Content:** Used for paragraphs and lists.
-   **Lists (Skills/Languages):** Standard Markdown unordered lists (`- Item`).
-   **Complex Entries (Work Experience, Education, Projects):**
    -   Each entry (e.g., a job, a degree, a project) starts with an `## Heading 2` for its name/title.
    -   It is followed by a `**Bolded Subtitle/Dates**` (which renders as a paragraph with strong text).
    -   The description *must* be a continuous paragraph (or multiple paragraphs if separated by blank lines), **explicitly avoiding bullet points or nested lists** for a denser, more editorial look. This was a key design decision.

### 4. Design System (Swiss/Brutalist)

#### 4.1. Global Typography & Colors
-   **Colors:** Stark black text (`text-black`) on a white background (`bg-white`). Subtlety introduced with `text-gray-400` for section titles and `text-gray-600` for secondary text.
-   **Fonts:** System font stack preference for Sans-serif (configured in `global.css` with `"Inter", "Helvetica Neue", "Helvetica", "Arial", sans-serif`).
-   **Text Styling:**
    -   `prose-headings`: Bold, uppercase, tight tracking.
    -   `prose-h2`: Smaller text (`text-lg`), minimal top/bottom margin, with a `border-b` for separation.
    -   `prose-p`: Justified text (`text-justify`), `leading-normal` for comfortable reading, `mb-4` for standard paragraph separation.
    -   `prose-a`: Black, underlined (`underline`), with subtle hover effects.
    -   `prose-li`: Black markers.
    -   `prose-strong`: Bold black text.

#### 4.2. Layout Structure
The `index.astro` orchestrates a responsive grid layout:
1.  **Header (`ContactSection`) & Summary (`SummarySection`):** Occupy the full width at the top of the document.
2.  **Main Content Grid:** Uses `md:grid-cols-10` with `gap-x-12` (on medium screens and up) to create an asymmetric two-column layout.
    *   **Left Column (70% width, `md:col-span-7`):** Contains `EducationSection` and `WorkExperienceSection`. A subtle `md:border-r` (`border-gray-300`) with `md:pr-12` creates a visual separator from the right column.
    *   **Right Column (30% width, `md:col-span-3`):** Contains `LanguagesSection`, `HardSkillsSection`, and `SoftSkillsSection`. The content within these sections is displayed as single, vertical lists (columns were removed from their internal components to fit the narrower space).
3.  **Projects Section (`ProjectsSection`):** Placed at the very bottom, it occupies the full width of the page.
    *   Internally, it uses CSS columns (`md:columns-2 gap-8 space-y-8`) to display projects side-by-side in a newspaper-like flow.
    *   **Constraint:** Due to the plain Markdown content structure, achieving an "odd last item centered" effect (like a true CSS Grid with `col-span-2`) is not directly supported by CSS Columns. The visual order is top-to-bottom in the first column, then top-to-bottom in the second.

#### 4.3. Spacing & Compactness
-   **Section Spacing:** Each section (managed by `BaseSection.astro`) has a bottom margin of `mb-8`.
-   **Header Spacing (`ContactSection`):** Top-level spacing and internal element spacing have been reduced (`mb-10`, `pb-6`, `h1:mb-2`, `p:mb-6`).
-   **Paragraph/List Spacing (Conditional):**
    -   `MarkdownStyler.astro` has a `removeParagraphSpacing` prop. When `true`, it applies a much denser style (`prose-p:my-0 prose-p:leading-tight`, `prose-ul:my-1 prose-ul:leading-tight`, `prose-li:my-0`) to specific sections (e.g., `WorkExperience`, `Education`, `Projects`) to achieve a compact, block-like feel for entries. This ensures elements within an entry are tightly grouped.

### 5. Features
-   **Print to PDF Button:** A provisional fixed button (`id="print-button"`) in `src/layouts/Layout.astro` triggers `window.print()`. It is styled to be visible on screen but hidden (`print:hidden`) when printing to PDF, ensuring a clean printed output.
-   **Responsive Design:** The layout gracefully adapts from the multi-column desktop view to a single-column mobile view, stacking sections vertically.
-   **Content-Driven:** All main content is sourced from Markdown files, making content updates simple and independent of code changes.