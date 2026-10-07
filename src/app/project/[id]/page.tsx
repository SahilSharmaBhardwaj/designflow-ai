'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Project, UXArtifacts } from '@/lib/types/project';
import { ArtifactType, GenerationRequest, GenerationResult } from '@/lib/ai/types';
import { ProjectStore } from '@/lib/storage/project-store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { UserFlowView } from '@/components/artifacts/UserFlowView';
import { UXAuditView } from '@/components/artifacts/UXAuditView';
import { UserStoriesView } from '@/components/artifacts/UserStoriesView';
import { ResearchView } from '@/components/artifacts/ResearchView';
import { UsabilityTestView } from '@/components/artifacts/UsabilityTestView';
import { DesignBriefView } from '@/components/artifacts/DesignBriefView';
import { ExportModal } from '@/components/artifacts/ExportModal';
import {
  GitFork,
  ShieldCheck,
  ListTodo,
  HelpCircle,
  FlaskConical,
  FileText,
  Sparkles,
  Download,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<string>('userFlow');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingArtifact, setGeneratingArtifact] = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [lastExecutionInfo, setLastExecutionInfo] = useState<{
    provider: string;
    model: string;
    timeMs: number;
  } | null>(null);

  useEffect(() => {
    if (projectId) {
      const found = ProjectStore.getProjectById(projectId);
      if (found) {
        setProject(found);
      }
    }
  }, [projectId]);

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-200">Project Not Found</h2>
        <p className="text-sm text-zinc-400 mt-2 mb-6">The requested project does not exist in your workspace.</p>
        <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleUpdateArtifacts = (partialArtifacts: Partial<UXArtifacts>) => {
    setSaveStatus('saving');
    const updatedArtifacts = {
      ...project.artifacts,
      ...partialArtifacts,
    };
    const updatedProj = ProjectStore.updateProject(project.id, {
      artifacts: updatedArtifacts,
    });
    if (updatedProj) {
      setProject(updatedProj);
    }
    setTimeout(() => setSaveStatus('saved'), 300);
  };

  const handleGenerate = async (artifactType: ArtifactType) => {
    setIsGenerating(true);
    setGeneratingArtifact(artifactType);

    try {
      const requestPayload: GenerationRequest = {
        requirements: project.requirements,
        artifactType,
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorJson = await response.json();
        throw new Error(errorJson.error || `HTTP error ${response.status}`);
      }

      const result = (await response.json()) as GenerationResult;

      if (result.success && result.artifacts) {
        const updatedArtifacts: UXArtifacts = {
          ...project.artifacts,
          ...result.artifacts,
        };

        const updatedProj = ProjectStore.updateProject(project.id, {
          artifacts: updatedArtifacts,
          activeProviderUsed: `${result.provider} (${result.model})`,
        });

        if (updatedProj) {
          setProject(updatedProj);
        }

        setLastExecutionInfo({
          provider: result.provider,
          model: result.model,
          timeMs: result.executionTimeMs,
        });
      } else {
        alert(`Generation failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to generate UX artifact', err);
      alert(`Generation failed: ${(err as Error).message}`);
    } finally {
      setIsGenerating(false);
      setGeneratingArtifact(null);
    }
  };

  const tabs = [
    {
      id: 'userFlow',
      label: 'User Flow',
      icon: <GitFork className="w-4 h-4" />,
      badge: project.artifacts.userFlow ? (
        <span className="w-2 h-2 rounded-full bg-teal-400" />
      ) : undefined,
    },
    {
      id: 'uxAudit',
      label: 'UX & A11y Audit',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: project.artifacts.uxAudit ? (
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
      ) : undefined,
    },
    {
      id: 'userStories',
      label: 'User Stories',
      icon: <ListTodo className="w-4 h-4" />,
      badge: project.artifacts.userStories ? (
        <span className="w-2 h-2 rounded-full bg-sky-400" />
      ) : undefined,
    },
    {
      id: 'researchPlan',
      label: 'UX Research',
      icon: <HelpCircle className="w-4 h-4" />,
      badge: project.artifacts.researchPlan ? (
        <span className="w-2 h-2 rounded-full bg-amber-400" />
      ) : undefined,
    },
    {
      id: 'usabilityTesting',
      label: 'Usability Testing',
      icon: <FlaskConical className="w-4 h-4" />,
      badge: project.artifacts.usabilityTesting ? (
        <span className="w-2 h-2 rounded-full bg-purple-400" />
      ) : undefined,
    },
    {
      id: 'designBrief',
      label: 'Design Brief',
      icon: <FileText className="w-4 h-4" />,
      badge: project.artifacts.designBrief ? (
        <span className="w-2 h-2 rounded-full bg-rose-400" />
      ) : undefined,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-900 border border-zinc-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                {project.name}
              </h1>
              <Badge variant="teal" size="sm">
                {project.requirements.productType}
              </Badge>
              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {saveStatus === 'saved' ? 'Saved' : 'Saving...'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Audience: <span className="text-zinc-300 font-medium">{project.requirements.targetAudience}</span>
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {lastExecutionInfo && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-zinc-400 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              <Clock className="w-3 h-3 text-teal-400" />
              <span>{lastExecutionInfo.timeMs}ms ({lastExecutionInfo.provider})</span>
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Specs
          </Button>

          <Button
            size="sm"
            onClick={() => handleGenerate('all')}
            isLoading={isGenerating && generatingArtifact === 'all'}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Generate All 6 Artifacts
          </Button>
        </div>
      </div>

      {/* Collapsible Requirements Drawer */}
      <Card className="p-4 bg-zinc-900/50 border-zinc-800">
        <button
          onClick={() => setShowRequirements(!showRequirements)}
          className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-200"
        >
          <div className="flex items-center gap-2">
            <span>Project Requirements & Context</span>
            <span className="text-[11px] font-normal normal-case text-zinc-500">
              ({project.requirements.keyFeatures?.length || 0} features listed)
            </span>
          </div>
          {showRequirements ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRequirements && (
          <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 text-xs">
            <div>
              <span className="font-semibold text-zinc-400 block mb-1">Problem Statement:</span>
              <p className="text-zinc-300 leading-relaxed">{project.requirements.problemStatement}</p>
            </div>

            {project.requirements.keyFeatures && (
              <div>
                <span className="font-semibold text-zinc-400 block mb-1">Key Features:</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.requirements.keyFeatures.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.requirements.businessGoals && (
              <div>
                <span className="font-semibold text-zinc-400 block mb-0.5">Business Goals:</span>
                <p className="text-zinc-300">{project.requirements.businessGoals}</p>
              </div>
            )}

            {project.requirements.complianceOrA11yNotes && (
              <div>
                <span className="font-semibold text-zinc-400 block mb-0.5">Compliance & A11y:</span>
                <p className="text-zinc-300">{project.requirements.complianceOrA11yNotes}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Artifact View Tabs */}
      <div>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'userFlow' && (
          <UserFlowView
            artifact={project.artifacts.userFlow}
            onRegenerate={() => handleGenerate('userFlow')}
            onUpdate={(updated) => handleUpdateArtifacts({ userFlow: updated })}
            isGenerating={isGenerating && generatingArtifact === 'userFlow'}
          />
        )}

        {activeTab === 'uxAudit' && (
          <UXAuditView
            artifact={project.artifacts.uxAudit}
            onRegenerate={() => handleGenerate('uxAudit')}
            isGenerating={isGenerating && generatingArtifact === 'uxAudit'}
          />
        )}

        {activeTab === 'userStories' && (
          <UserStoriesView
            artifact={project.artifacts.userStories}
            onRegenerate={() => handleGenerate('userStories')}
            isGenerating={isGenerating && generatingArtifact === 'userStories'}
          />
        )}

        {activeTab === 'researchPlan' && (
          <ResearchView
            artifact={project.artifacts.researchPlan}
            onRegenerate={() => handleGenerate('researchPlan')}
            isGenerating={isGenerating && generatingArtifact === 'researchPlan'}
          />
        )}

        {activeTab === 'usabilityTesting' && (
          <UsabilityTestView
            artifact={project.artifacts.usabilityTesting}
            onRegenerate={() => handleGenerate('usabilityTesting')}
            isGenerating={isGenerating && generatingArtifact === 'usabilityTesting'}
          />
        )}

        {activeTab === 'designBrief' && (
          <DesignBriefView
            artifact={project.artifacts.designBrief}
            onRegenerate={() => handleGenerate('designBrief')}
            onUpdate={(updated) => handleUpdateArtifacts({ designBrief: updated })}
            isGenerating={isGenerating && generatingArtifact === 'designBrief'}
          />
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        project={project}
        artifacts={project.artifacts}
      />
    </div>
  );
}
