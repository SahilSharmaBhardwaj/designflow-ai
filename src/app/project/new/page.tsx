'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductType, ProjectRequirements } from '@/lib/types/project';
import { ArtifactType } from '@/lib/ai/types';
import { ProjectStore } from '@/lib/storage/project-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  Plus,
  X,
  Zap,
  GitFork,
  ShieldCheck,
  ListTodo,
  HelpCircle,
  FlaskConical,
  FileText,
} from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [productType, setProductType] = useState<ProductType>('fintech');
  const [problemStatement, setProblemStatement] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [businessGoals, setBusinessGoals] = useState('');
  const [complianceOrA11yNotes, setComplianceOrA11yNotes] = useState('');
  const [selectedInitialArtifact, setSelectedInitialArtifact] = useState<ArtifactType>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setKeyFeatures([...keyFeatures, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
  };

  const applyPreset = (preset: {
    title: string;
    productType: ProductType;
    problemStatement: string;
    targetAudience: string;
    keyFeatures: string[];
    businessGoals: string;
    complianceOrA11yNotes: string;
  }) => {
    setTitle(preset.title);
    setProductType(preset.productType);
    setProblemStatement(preset.problemStatement);
    setTargetAudience(preset.targetAudience);
    setKeyFeatures(preset.keyFeatures);
    setBusinessGoals(preset.businessGoals);
    setComplianceOrA11yNotes(preset.complianceOrA11yNotes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problemStatement.trim() || !targetAudience.trim()) {
      alert('Please fill in the project title, target audience, and problem statement.');
      return;
    }

    setIsSubmitting(true);

    const requirements: ProjectRequirements = {
      title,
      productType,
      problemStatement,
      targetAudience,
      keyFeatures: keyFeatures.length > 0 ? keyFeatures : [title],
      businessGoals: businessGoals || undefined,
      complianceOrA11yNotes: complianceOrA11yNotes || undefined,
    };

    const newProject = ProjectStore.createProject(requirements);

    setTimeout(() => {
      router.push(`/project/${newProject.id}`);
    }, 250);
  };

  const artifactOptions = [
    { id: 'all', label: 'All 6 Artifacts', icon: <Sparkles className="w-4 h-4 text-teal-400" /> },
    { id: 'userFlow', label: 'User Flow', icon: <GitFork className="w-4 h-4 text-teal-400" /> },
    { id: 'uxAudit', label: 'UX & A11y Audit', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { id: 'userStories', label: 'User Stories', icon: <ListTodo className="w-4 h-4 text-sky-400" /> },
    { id: 'researchPlan', label: 'UX Research', icon: <HelpCircle className="w-4 h-4 text-amber-400" /> },
    { id: 'usabilityTesting', label: 'Usability Test', icon: <FlaskConical className="w-4 h-4 text-purple-400" /> },
    { id: 'designBrief', label: 'Design Brief', icon: <FileText className="w-4 h-4 text-rose-400" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="teal">Create Project</Badge>
          <span className="text-xs text-zinc-500">Requirements & Artifact Scope</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
          New UX Design Project
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Provide your product requirements to synthesize structured user flows, audits, user stories, and testing plans.
        </p>
      </div>

      {/* Quick Presets Bar */}
      <Card className="p-4 bg-zinc-900/60 border-zinc-800">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Quick Start Presets
          </span>
          <span className="text-[11px] text-zinc-500">1-click populate sample context</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              applyPreset({
                title: 'BondsPe — Retail Bond Purchase & 2FA Flow',
                productType: 'fintech',
                problemStatement:
                  'Retail investors find yield-to-maturity calculations, coupon dates, and dirty price terminology confusing during checkout.',
                targetAudience: 'Retail Indian investors aged 25-45 looking for fixed income yields higher than FDs.',
                keyFeatures: [
                  'Real-time Yield-to-Maturity calculator',
                  'Cashflow schedule preview table',
                  '2FA OTP authentication and SEBI mandatory risk disclosure',
                ],
                businessGoals: 'Increase checkout conversion by 25%.',
                complianceOrA11yNotes: 'SEBI investor charter compliance; WCAG 2.2 AA contrast standards.',
              })
            }
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700/80 transition-colors"
          >
            🇮🇳 FinTech Bond Order (BondsPe)
          </button>

          <button
            type="button"
            onClick={() =>
              applyPreset({
                title: 'CloudOps — Scoped API Key Management',
                productType: 'b2b-saas',
                problemStatement:
                  'Developers need safe API key provisioning with granular permission scopes and automated budget alerts.',
                targetAudience: 'Software Engineers and DevOps Leads.',
                keyFeatures: [
                  'One-click key generation with copy protection',
                  'Granular permission scopes',
                  'Quota threshold email/Slack webhooks',
                ],
                businessGoals: 'Reduce unexpected quota overages by 50%.',
                complianceOrA11yNotes: 'Full keyboard navigation shortcuts.',
              })
            }
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700/80 transition-colors"
          >
            ⚡ B2B SaaS API Provisioning
          </button>

          <button
            type="button"
            onClick={() =>
              applyPreset({
                title: 'FitTrack — Health Habit Onboarding Flow',
                productType: 'healthtech',
                problemStatement:
                  'New users drop off during health profile onboarding due to too many medical data questions upfront without value demonstration.',
                targetAudience: 'Fitness enthusiasts and individuals tracking recovery habits.',
                keyFeatures: [
                  'Progressive disclosure question wizard',
                  'Instant personalized goal preview',
                  'Apple Health / Google Fit permissions screen',
                ],
                businessGoals: 'Boost Day-1 retention by 30%.',
                complianceOrA11yNotes: 'HIPAA & GDPR health data consent checkboxes.',
              })
            }
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700/80 transition-colors"
          >
            🩺 HealthTech Progressive Onboarding
          </button>
        </div>
      </Card>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 bg-zinc-900/60 border-zinc-800 space-y-6">
          {/* Title and Product Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Project / Feature Title <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Retail Bond Purchase & 2FA Flow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Product Domain
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value as ProductType)}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 focus:outline-none focus:border-teal-500"
              >
                <option value="fintech">FinTech / Wealth</option>
                <option value="b2b-saas">B2B SaaS</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="healthtech">HealthTech</option>
                <option value="marketplace">Marketplace</option>
                <option value="mobile-app">Mobile App</option>
                <option value="consumer-web">Consumer Web</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Target Audience / Persona <span className="text-teal-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Retail investors aged 25-45 looking for fixed income yields"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Problem Statement */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Core UX Problem Statement & Context <span className="text-teal-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the current user pain points, friction in the flow, drop-off reasons, or requirements..."
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500 leading-relaxed"
            />
          </div>

          {/* Key Features List */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Key Features & Flow Touchpoints
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Real-time Yield-to-Maturity calculator"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500"
              />
              <Button type="button" variant="secondary" onClick={handleAddFeature}>
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>

            {keyFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keyFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-200"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-zinc-400 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Initial Artifact Scope Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Target Artifact Scope
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {artifactOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedInitialArtifact(opt.id as ArtifactType)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-colors text-left ${
                    selectedInitialArtifact === opt.id
                      ? 'bg-zinc-800 border-teal-500 text-white shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create & Open Workspace
          </Button>
        </div>
      </form>
    </div>
  );
}
