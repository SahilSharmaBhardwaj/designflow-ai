'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { BookOpen, Layers, Cpu, Compass, ShieldCheck, Terminal, CheckCircle2 } from 'lucide-react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<string>('product');

  const docTabs = [
    { id: 'product', label: 'Product Vision & Specs', icon: <Layers className="w-4 h-4" /> },
    { id: 'architecture', label: 'Architecture & AI Abstraction', icon: <Cpu className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Roadmap & Status', icon: <Compass className="w-4 h-4" /> },
    { id: 'setup', label: 'Developer Guide & Security', icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="teal">Official Documentation</Badge>
          <span className="text-xs text-zinc-500">DesignFlow AI v0.1.0</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          System Documentation & Specifications
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Explore product requirements, architectural design, AI provider abstraction, and development standards.
        </p>
      </div>

      <Tabs tabs={docTabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="pt-2">
        {activeTab === 'product' && (
          <Card className="p-6 md:p-8 bg-zinc-900/60 border-zinc-800 space-y-6 text-sm leading-relaxed text-zinc-300">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">1. Executive Summary</h2>
              <p>
                <strong>DesignFlow AI</strong> is an open-source, AI-assisted product-design toolkit tailored for UX designers, product managers, and design engineers.
                It transforms unstructured problem statements into structured UX artifacts: interactive user flows, heuristic & accessibility audits, user stories with Gherkin acceptance criteria, user research interview guides, and usability testing protocols.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">2. Grounded Domain Heuristics</h2>
              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                <li><strong>Nielsen Norman 10 Usability Heuristics:</strong> Visibility of system status, error prevention, recognition vs recall.</li>
                <li><strong>WCAG 2.2 AA Compliance:</strong> 4.5:1 text contrast ratios, minimum 48x48px mobile touch targets, keyboard navigation.</li>
                <li><strong>Gherkin Syntax Acceptance Criteria:</strong> Given-When-Then criteria for seamless developer and QA alignment.</li>
                <li><strong>FinTech Specific Patterns:</strong> SEBI-compliant risk disclosures, rate locking countdowns, and 2FA authentication steps.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">3. Supported Artifact Types</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="font-semibold text-teal-400 block mb-1">Interactive User Flows</span>
                  <span className="text-xs text-zinc-400">Step-by-step pathways, decision forks, UI touchpoints, and error recovery sequences.</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="font-semibold text-emerald-400 block mb-1">Heuristic UX Audits</span>
                  <span className="text-xs text-zinc-400">Nielsen Norman heuristics and WCAG 2.2 evaluations with severity scoring.</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="font-semibold text-sky-400 block mb-1">User Stories & Gherkin</span>
                  <span className="text-xs text-zinc-400">Standardized agile stories with Given-When-Then acceptance criteria.</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="font-semibold text-purple-400 block mb-1">Usability Test Plans</span>
                  <span className="text-xs text-zinc-400">Participant tasks, scripts, and quantitative metric benchmarks (SUS, SEQ).</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'architecture' && (
          <Card className="p-6 md:p-8 bg-zinc-900/60 border-zinc-800 space-y-6 text-sm leading-relaxed text-zinc-300">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">1. AI Provider Abstraction Interface</h2>
              <p className="mb-3">
                All AI interactions in DesignFlow AI adhere strictly to the decoupled <code className="text-teal-400 font-mono">AIProvider</code> interface.
                This ensures that the application never depends on a hardcoded vendor.
              </p>

              <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto border border-zinc-800">
{`export interface AIProvider {
  id: string;
  name: string;
  generate(request: GenerationRequest): Promise<GenerationResult>;
  validate(): Promise<{ valid: boolean; message?: string }>;
  getModelInfo(): ProviderModelInfo;
}`}
              </pre>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">2. Supported Providers</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">Local Mock Engine (`mock`)</span>
                    <Badge variant="teal" size="sm">Active Default</Badge>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Zero-cost offline engine that dynamically synthesizes domain-rich UX artifacts based on heuristic templates. Works out of the box without network calls or API keys.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">Anthropic Claude (`anthropic`)</span>
                    <Badge variant="neutral" size="sm">Claude 3.5 Sonnet</Badge>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Production-grade Anthropic Messages API integration. Activated securely server-side when <code className="text-teal-400 font-mono">ANTHROPIC_API_KEY</code> is provided.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">3. Zero-Key-Leakage Security Model</h2>
              <p>
                API keys are loaded only in server-side Next.js Route Handlers (<code className="text-teal-400 font-mono">/api/generate</code>).
                No API secrets are ever bundled into client-side JavaScript or transmitted across the browser network tab.
              </p>
            </div>
          </Card>
        )}

        {activeTab === 'roadmap' && (
          <Card className="p-6 md:p-8 bg-zinc-900/60 border-zinc-800 space-y-6 text-sm leading-relaxed text-zinc-300">
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Release Milestones</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-zinc-950 border border-emerald-900/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="success" size="sm">v0.1.0 MVP Completed</Badge>
                    <span className="font-semibold text-white">Core UX Toolkit & AI Engine</span>
                  </div>
                  <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                    <li>5 core UX artifact generators (User flows, UX audit, user stories, research, usability tests)</li>
                    <li>Pluggable AIProvider architecture with local mock fallback</li>
                    <li>Client-side localStorage project persistence with JSON backup</li>
                    <li>Notion & Linear formatted Markdown export and JSON schemas</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="warning" size="sm">v0.2.0 Planned</Badge>
                    <span className="font-semibold text-white">Visual Flowchart Canvas & Figma Sync</span>
                  </div>
                  <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                    <li>Interactive drag-and-drop node canvas with SVG export</li>
                    <li>Figma plugin integration for 1-click frame generation</li>
                    <li>Batch PRD PDF & Markdown file ingestion</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'setup' && (
          <Card className="p-6 md:p-8 bg-zinc-900/60 border-zinc-800 space-y-6 text-sm leading-relaxed text-zinc-300">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Quickstart Setup</h2>
              <p className="mb-3 text-xs text-zinc-400">
                Run the application locally in 3 commands:
              </p>
              <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto border border-zinc-800">
{`# 1. Install dependencies
npm install

# 2. Setup environment variables (optional, defaults to Local Mock Engine)
cp .env.example .env.local

# 3. Run development server
npm run dev`}
              </pre>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Configuring External Providers</h2>
              <p className="text-xs text-zinc-400 mb-2">
                To connect a real Anthropic Claude API key, edit <code className="text-teal-400 font-mono">.env.local</code>:
              </p>
              <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto border border-zinc-800">
{`AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-api03-your-real-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022`}
              </pre>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Professional Discovery-to-Build Workflow</h2>
              <p className="text-xs text-zinc-400">
                Before implementation, follow the market validation execution guide at{' '}
                <code className="text-teal-400 font-mono">docs/market-validation-playbook.md</code> to validate real user pain, define MVP scope, and set objective go/pivot criteria.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
