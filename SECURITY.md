# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x (MVP)   | :white_check_mark: |

## Security Architecture Guarantees

DesignFlow AI enforces strict client-server boundary separation to protect sensitive user requirements and credentials:

1. **Server-Side API Credential Isolation**: External API keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) are evaluated exclusively within server-side Next.js Route Handlers (`/api/generate`). No secrets or API keys are ever transmitted to or bundled into client-side JavaScript.
2. **Zero-Tracking Client Storage**: Projects and generated UX artifacts reside strictly in the user's browser `localStorage`. No analytics trackers or telemetry scripts are injected.
3. **Safe Environment Configurations**: `.env` and `.env*.local` are explicitly blocked in `.gitignore`. Only `.env.example` containing empty dummy placeholders is tracked in version control.
4. **Sanitized Error Logging**: Upstream AI provider errors (e.g. rate limits or connection failures) are sanitized before being returned to client interfaces, ensuring connection headers and bearer tokens are never leaked in error payloads.

## Reporting a Vulnerability

If you discover a security vulnerability within DesignFlow AI, please follow responsible disclosure:

1. **Do not create public GitHub issues for security vulnerabilities.**
2. Send an email with detailed reproduction steps to the project maintainer:
   - **Email**: `sahilsharmabhardwaj@gmail.com` (or create a private GitHub Security Advisory).
3. Please include:
   - Description of the vulnerability
   - Proof-of-concept steps or minimal reproduction
   - Potential impact assessment
4. You will receive an acknowledgment within 48 hours and updates until the vulnerability is addressed.
