# DesignFlow AI — Architecture & System Design

## 1. System Architecture Overview

DesignFlow AI is architected as a modular Next.js web application utilizing TypeScript and Tailwind CSS. It follows clean architectural principles with clear separation of concerns between presentation, business logic, state persistence, and AI orchestration.

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Browser)"]
        UI["React 18 / Next.js Pages"]
        Store["Project & Artifact State (Local Storage)"]
        UI -->|Reads / Writes| Store
        UI -->|Triggers Generation| ClientAPI["API Client (fetch)"]
    end

    subgraph Server ["Server Layer (Next.js API Routes)"]
        Route["/api/generate"]
        Factory["AI Provider Factory"]
        Route --> Factory
    end

    subgraph Providers ["AI Provider Abstraction"]
        Interface["<< AIProvider >> Interface"]
        Mock["MockProvider (Local Rule & Template Engine)"]
        Anthropic["AnthropicProvider (Claude 3.5 Sonnet)"]
        OpenAI["OpenAIProvider (GPT-4o)"]
        
        Interface <|.. Mock
        Interface <|.. Anthropic
        Interface <|.. OpenAI
        Factory --> Interface
    end

    ClientAPI -->|POST /api/generate (Payload without keys)| Route
    Anthropic -.->|Env: ANTHROPIC_API_KEY| AnthropicAPI["Anthropic API"]
    OpenAI -.->|Env: OPENAI_API_KEY| OpenAIAPI["OpenAI API"]
```

---

## 2. Directory & Component Structure

```tree
src/
├── app/                        # Next.js App Router
│   ├── api/
│   │   ├── generate/route.ts   # Server-side AI generation endpoint
│   │   └── health/route.ts     # Health check & provider status endpoint
│   ├── dashboard/page.tsx      # Project management dashboard
│   ├── project/
│   │   ├── new/page.tsx        # Project creation & requirements wizard
│   │   └── [id]/page.tsx       # Main artifact workspace & interactive views
│   ├── docs/page.tsx           # In-app interactive documentation reader
│   ├── settings/page.tsx       # Provider configuration & app settings
│   ├── layout.tsx              # Root layout with navigation & theme providers
│   ├── page.tsx                # Public Landing Page
│   └── globals.css             # Tailwind CSS & custom design tokens
├── components/                 # Reusable UI components
│   ├── ui/                     # Primitives (Button, Card, Badge, Modal, Tabs, Input)
│   ├── layout/                 # Navbar, Sidebar, Footer, Header
│   ├── artifacts/              # Artifact-specific interactive renderers
│   │   ├── UserFlowView.tsx
│   │   ├── UXAuditView.tsx
│   │   ├── UserStoriesView.tsx
│   │   ├── ResearchView.tsx
│   │   ├── UsabilityTestView.tsx
│   │   └── ExportModal.tsx
│   └── project/                # Project wizard & cards
├── lib/
│   ├── ai/                     # AI Provider Abstraction
│   │   ├── types.ts            # AIProvider interface & response schemas
│   │   ├── factory.ts          # Provider resolver based on environment
│   │   ├── mock-provider.ts    # High-fidelity domain mock generator
│   │   ├── anthropic-provider.ts # Anthropic Claude implementation
│   │   └── openai-provider.ts  # OpenAI implementation
│   ├── storage/                # Client-side storage & backup utilities
│   │   └── project-store.ts
│   ├── types/                  # Core domain data types
│   │   └── project.ts
│   └── utils/                  # String formatting, markdown export, clipboard
│       └── export.ts
```

---

## 3. AI Provider Abstraction

All AI generation is abstracted behind the `AIProvider` interface:

```typescript
export interface AIProvider {
  id: string;
  name: string;
  generate(request: GenerationRequest): Promise<GenerationResult>;
  validate(): Promise<{ valid: boolean; message?: string }>;
  getModelInfo(): { provider: string; model: string; isLocal: boolean };
}
```

### Provider Execution Logic
1. **MockProvider (`AI_PROVIDER=mock`)**: Default provider. Executes locally with zero network requests or API costs. Uses heuristic parsing of problem statements, user personas, and product types to produce realistic, domain-specific UX artifacts.
2. **AnthropicProvider (`AI_PROVIDER=anthropic`)**: Dynamically instantiated on the server when `ANTHROPIC_API_KEY` is configured. Formats UX prompt engineering templates and parses JSON-structured responses.
3. **OpenAIProvider (`AI_PROVIDER=openai`)**: Available as an alternative provider via `OPENAI_API_KEY`.

---

## 4. Security & Secret Handling

1. **Client Isolation**: API keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) are loaded via server-side `process.env` only inside Next.js Route Handlers. They are never sent to the browser.
2. **Zero Hardcoded Secrets**: The codebase uses `.env.example` with empty dummy values. `.env` and `.env*.local` are explicitly blocked in `.gitignore`.
3. **Safe Error Masking**: Upstream API errors (rate limits, invalid keys) are caught and returned with sanitized user-friendly error messages without echoing sensitive connection headers or authorization tokens.

---

## 5. Data Flow & State Management

- **Client Persistence**: Projects and generated UX artifacts are saved to browser `localStorage` under `designflow_projects_v1`.
- **JSON Import/Export**: Users can backup their workspace as a JSON file or restore previous projects at any time.
- **Exporting**: UX Artifacts can be exported as structured Markdown (with Gherkin tables, Mermaid diagrams, and formatted checklists) or raw JSON.
