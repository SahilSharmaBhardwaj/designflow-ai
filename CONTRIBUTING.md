# Contributing to DesignFlow AI

Thank you for your interest in contributing to DesignFlow AI! We welcome contributions from product designers, UX researchers, frontend engineers, and AI developers.

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please be respectful and constructive in all discussions.

## Development Workflow

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**

### 2. Setting Up Local Environment
```bash
# Fork & clone the repo
git clone https://github.com/your-username/designflow-ai.git
cd designflow-ai

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Run the local development server
npm run dev
```

The application will be running at `http://localhost:3000`. By default, it uses the **Local Mock AI Engine** (`AI_PROVIDER=mock`) so you can develop, test, and generate all UX artifacts without needing any external API keys or paid credits.

### 3. Branching & Commit Guidelines
- Use descriptive branch names: `feature/user-flow-export`, `fix/contrast-ratio-calc`, `docs/setup-guide`.
- Keep commits focused and write meaningful commit messages:
  - `feat(audit): add WCAG 2.2 touch target heuristic check`
  - `fix(provider): handle rate limit exponential backoff`
  - `docs: update architecture diagram and provider interface`

### 4. Security & Quality Standards
- **Never commit `.env` or API keys.** All environment variables must stay local.
- Run typechecking and linting before submitting pull requests:
  ```bash
  npm run typecheck
  npm run lint
  npm run build
  ```

### 5. Submitting Pull Requests
1. Push your branch to your fork.
2. Open a Pull Request against `main`.
3. Provide a clear description of changes, screenshots/screen recordings for UI updates, and test steps.
4. Ensure all CI checks pass.

## Architecture Guidelines
When adding new features or AI artifact generators, ensure they adhere to the `AIProvider` interface defined in `src/lib/ai/types.ts`. All artifact types should be typed in TypeScript and support export to Markdown and JSON formats.
