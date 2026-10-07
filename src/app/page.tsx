'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  ArrowRight,
  GitFork,
  ShieldCheck,
  ListTodo,
  HelpCircle,
  FlaskConical,
  FileText,
  Sparkles,
  CheckCircle2,
  Terminal,
  BookOpen,
  Split,
  Target,
  ArrowUpRight,
  Eye,
  Check,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function LandingPage() {
  const [activeDemoTab, setActiveDemoTab] = useState<'userFlow' | 'uxAudit' | 'userStories' | 'brief'>('userFlow');

  const artifacts = [
    {
      id: 'userFlow',
      title: 'Interactive User Flows',
      icon: <GitFork className="w-5 h-5 text-teal-400" />,
      description: 'Step-by-step critical path mapping with decision forks, UI touchpoints, and error recovery sequences.',
      tag: 'Discovery & IA',
    },
    {
      id: 'uxAudit',
      title: 'Heuristic UX & A11y Audits',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      description: 'Nielsen Norman 10 Heuristics and WCAG 2.2 AA accessibility evaluations with severity scoring.',
      tag: 'Evaluation',
    },
    {
      id: 'userStories',
      title: 'Agile Stories & Gherkin Criteria',
      icon: <ListTodo className="w-5 h-5 text-sky-400" />,
      description: 'Standardized Given-When-Then criteria, persona mapping, and technical edge case considerations.',
      tag: 'Specification',
    },
    {
      id: 'researchPlan',
      title: 'User Research Guides',
      icon: <HelpCircle className="w-5 h-5 text-amber-400" />,
      description: 'Semi-structured interview questions, behavioral probing prompts, and hypothesis risk matrices.',
      tag: 'Research',
    },
    {
      id: 'usabilityTesting',
      title: 'Usability Testing Plans',
      icon: <FlaskConical className="w-5 h-5 text-purple-400" />,
      description: 'Realistic participant prompts, success benchmarks, time-on-task, and SUS evaluation templates.',
      tag: 'Testing',
    },
    {
      id: 'designBrief',
      title: 'Design Specifications & Briefs',
      icon: <FileText className="w-5 h-5 text-rose-400" />,
      description: 'User mental models, core design principles, spatial token rules, and milestone execution schedules.',
      tag: 'Design System',
    },
  ];

  return (
    <div className="flex flex-col bg-zinc-950 text-zinc-100">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-28 overflow-hidden border-b border-zinc-800/80 bg-grid-pattern">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 mb-8 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-medium text-zinc-200">Open-Source AI Product-Design Toolkit</span>
            <span className="text-zinc-600">•</span>
            <Badge variant="teal" size="sm" dot>v0.1.0 MVP</Badge>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Turn requirements into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-sky-400">
              structured UX artifacts
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            DesignFlow AI transforms unstructured product requirements into verifiable user flows, heuristic audits, agile user stories, and usability test protocols.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/project/new">
              <Button size="lg" variant="teal" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Create New Project
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Explore Dashboard
              </Button>
            </Link>
          </div>

          {/* Value Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Offline Mock AI Engine included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Anthropic Claude & OpenAI provider ready</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Zero client API key leakage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Workbench Preview */}
      <section className="py-20 border-b border-zinc-800/80 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
              Interactive Workbench Preview
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Six Comprehensive UX Deliverables in One Workflow
            </h3>
            <p className="text-sm text-zinc-400 mt-2">
              Explore how DesignFlow AI structures discovery deliverables for a real FinTech bond trading scenario.
            </p>
          </div>

          {/* Interactive Preview Container */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-md shadow-2xl overflow-hidden">
            {/* Mock Workbench Topbar */}
            <div className="px-5 py-3.5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-zinc-500 ml-2">
                  BondsPe — Secondary Bond Purchase & 2FA Flow
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="teal" size="sm">Mock AI Engine</Badge>
                <Badge variant="neutral" size="sm">FinTech</Badge>
              </div>
            </div>

            {/* Preview Navigation Tabs */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-zinc-800/80 bg-zinc-950/40 overflow-x-auto">
              {[
                { id: 'userFlow', label: '1. User Flow', icon: <GitFork className="w-3.5 h-3.5" /> },
                { id: 'uxAudit', label: '2. UX Audit', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                { id: 'userStories', label: '3. User Stories', icon: <ListTodo className="w-3.5 h-3.5" /> },
                { id: 'brief', label: '4. Design Brief', icon: <FileText className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDemoTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${
                    activeDemoTab === tab.id
                      ? 'border-teal-400 text-teal-300 font-semibold'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Preview Body */}
            <div className="p-6">
              {activeDemoTab === 'userFlow' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] font-bold text-teal-400 uppercase">Step 1</span>
                      <h4 className="text-xs font-bold text-white mt-0.5">YTM & Price Calculation</h4>
                      <p className="text-[11px] text-zinc-400 mt-1">User inputs investment amount; system renders live dirty price breakdown.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] font-bold text-teal-400 uppercase">Step 2</span>
                      <h4 className="text-xs font-bold text-white mt-0.5">Quote Lock & Risk Disclosure</h4>
                      <p className="text-[11px] text-zinc-400 mt-1">Locks rate for 60 seconds; displays mandatory SEBI risk notice.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] font-bold text-teal-400 uppercase">Step 3</span>
                      <h4 className="text-xs font-bold text-white mt-0.5">2FA Settlement & Receipt</h4>
                      <p className="text-[11px] text-zinc-400 mt-1">Aadhaar/Bank OTP validation and instant downloadable bond receipt.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeDemoTab === 'uxAudit' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 shrink-0 mt-0.5 font-bold">
                      Critical
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Irreversible Settlement Friction</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Financial trades must have mandatory itemized review modal before final submit (WCAG 3.3.4).</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 shrink-0 mt-0.5 font-bold">
                      Major
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Secondary Helper Text Contrast</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Yield calculation footnotes must achieve minimum 4.5:1 contrast against surface background.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeDemoTab === 'userStories' && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs">
                  <div className="text-amber-400 font-bold mb-1.5">Scenario: Valid Bond Purchase with Rate Lock</div>
                  <div className="space-y-1 text-zinc-300">
                    <div><span className="text-teal-400 font-bold">Given</span> a retail investor is on the bond checkout page with active quote</div>
                    <div><span className="text-sky-400 font-bold">When</span> they confirm the 6-digit OTP within the 60-second timer</div>
                    <div><span className="text-emerald-400 font-bold">Then</span> the trade executes idempotently and renders the PDF receipt</div>
                  </div>
                </div>
              )}

              {activeDemoTab === 'brief' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-xs font-bold text-white block mb-1">Clarity Over Cleverness</span>
                    <p className="text-[11px] text-zinc-400">Explicit fee breakdowns and plain-language helper copy must triumph over ambiguous icons.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-xs font-bold text-white block mb-1">Spatial & Touch Standards</span>
                    <p className="text-[11px] text-zinc-400">Minimum 48x48px hit targets for mobile order buttons with 8px clearance (WCAG 2.5.8).</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Artifact Matrix Showcase */}
      <section className="py-20 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
              Deliverables Matrix
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Standardized Deliverables for Product Teams
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {artifacts.map((art, idx) => (
              <Card
                key={idx}
                className="bg-zinc-900/60 border-zinc-800 hover-glow transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      {art.icon}
                    </div>
                    <Badge variant="neutral" size="sm">
                      {art.tag}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">{art.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{art.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture & Security Section */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2 block">
                Pluggable AI Architecture
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Decoupled Provider Layer & Local-First Storage
              </h3>
              <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                DesignFlow AI operates with zero external dependencies via the local Mock AI engine. Connect an Anthropic Claude 3.5 Sonnet or OpenAI API key server-side when ready.
              </p>

              <div className="mt-6 space-y-2.5">
                {[
                  'Zero API key leakage: credentials evaluated strictly server-side',
                  'Client-side privacy: projects stored in browser localStorage with JSON export',
                  'Nielsen Norman 10 Usability Heuristics & WCAG 2.2 standards',
                  'Agile Gherkin acceptance criteria formatted for QA & frontend engineers',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-2 shadow-2xl">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-zinc-500">
                <Terminal className="w-3.5 h-3.5" />
                <span>designflow-ai / provider-engine</span>
              </div>
              <div className="text-teal-400">{'// AI Provider Interface'}</div>
              <div className="text-zinc-400">{'const provider = AIProviderFactory.getProvider();'}</div>
              <div className="text-teal-400">{'// Synthesizes 6 Structured UX Artifacts'}</div>
              <div className="text-emerald-400">{'const { userFlow, uxAudit, stories, brief } = await provider.generate(req);'}</div>
              <div className="text-zinc-500">{'// Result: Verified Gherkin & Heuristic Specifications'}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
