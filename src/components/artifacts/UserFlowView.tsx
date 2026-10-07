'use client';

import React, { useState, useEffect } from 'react';
import { UserFlowArtifact, UserFlowStep } from '@/lib/types/project';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Split,
  Layers,
  Edit3,
  Save,
  Plus,
  Trash2,
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils/export';

interface UserFlowViewProps {
  artifact?: UserFlowArtifact;
  onRegenerate?: () => void;
  onUpdate?: (updated: UserFlowArtifact) => void;
  isGenerating?: boolean;
}

export const UserFlowView: React.FC<UserFlowViewProps> = ({
  artifact,
  onRegenerate,
  onUpdate,
  isGenerating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableArtifact, setEditableArtifact] = useState<UserFlowArtifact | null>(artifact || null);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(
    artifact?.happyPathSteps?.[0]?.id || null
  );

  useEffect(() => {
    if (artifact) {
      setEditableArtifact(artifact);
      if (!selectedStepId && artifact.happyPathSteps?.length > 0) {
        setSelectedStepId(artifact.happyPathSteps[0].id);
      }
    }
  }, [artifact, selectedStepId]);

  if (!artifact || !editableArtifact || !editableArtifact.happyPathSteps || editableArtifact.happyPathSteps.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
          <GitFork className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">No User Flow Generated Yet</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mt-1 mb-6">
          Generate a structured step-by-step user flow, complete with happy paths, branch logic, and edge-case handling.
        </p>
        <Button
          onClick={onRegenerate}
          isLoading={isGenerating}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Generate User Flow
        </Button>
      </Card>
    );
  }

  const handleCopy = async () => {
    let text = `User Flow: ${editableArtifact.summary}\nPrimary Actor: ${editableArtifact.primaryActor}\n\n`;
    editableArtifact.happyPathSteps.forEach((s) => {
      text += `Step ${s.stepNumber}: ${s.title}\n- User Action: ${s.userAction}\n- System Response: ${s.systemResponse}\n- UI Component: ${s.uiComponent}\n\n`;
    });
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    if (editableArtifact && onUpdate) {
      onUpdate(editableArtifact);
    }
    setIsEditing(false);
  };

  const handleAddStep = () => {
    const nextNum = editableArtifact.happyPathSteps.length + 1;
    const newStep: UserFlowStep = {
      id: `step-${Date.now()}`,
      stepNumber: nextNum,
      title: `Step ${nextNum}: New Action`,
      userAction: 'User interacts with the element',
      systemResponse: 'System validates and updates view',
      uiComponent: 'Interactive Component',
    };
    const updated = {
      ...editableArtifact,
      happyPathSteps: [...editableArtifact.happyPathSteps, newStep],
    };
    setEditableArtifact(updated);
    setSelectedStepId(newStep.id);
  };

  const handleDeleteStep = (stepId: string) => {
    const filtered = editableArtifact.happyPathSteps
      .filter((s) => s.id !== stepId)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setEditableArtifact({
      ...editableArtifact,
      happyPathSteps: filtered,
    });
    if (filtered.length > 0) {
      setSelectedStepId(filtered[0].id);
    }
  };

  const selectedStep =
    editableArtifact.happyPathSteps.find((s) => s.id === selectedStepId) ||
    editableArtifact.happyPathSteps[0];

  const updateSelectedStep = (fields: Partial<UserFlowStep>) => {
    if (!selectedStep) return;
    const updatedSteps = editableArtifact.happyPathSteps.map((s) =>
      s.id === selectedStep.id ? { ...s, ...fields } : s
    );
    setEditableArtifact({ ...editableArtifact, happyPathSteps: updatedSteps });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Primary Actor:
            </span>
            <Badge variant="teal">{editableArtifact.primaryActor}</Badge>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editableArtifact.summary}
              onChange={(e) =>
                setEditableArtifact({ ...editableArtifact, summary: e.target.value })
              }
              className="w-full text-xs p-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100"
            />
          ) : (
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{editableArtifact.summary}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isEditing ? (
            <Button
              size="sm"
              onClick={handleSave}
              leftIcon={<Save className="w-3.5 h-3.5" />}
              className="bg-teal-600 hover:bg-teal-500 text-white"
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit Flow
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy Flow'}
          </Button>

          {onRegenerate && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRegenerate}
              isLoading={isGenerating}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Regenerate
            </Button>
          )}
        </div>
      </div>

      {/* Visual Step-by-Step Flow Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>Interactive Happy Path ({editableArtifact.happyPathSteps.length} Steps)</span>
          </h4>

          {isEditing && (
            <Button size="sm" variant="secondary" onClick={handleAddStep} leftIcon={<Plus className="w-3 h-3" />}>
              Add Step
            </Button>
          )}
        </div>

        {/* Step Nodes Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {editableArtifact.happyPathSteps.map((step, idx) => {
            const isSelected = selectedStep?.id === step.id;
            return (
              <button
                key={step.id || idx}
                onClick={() => setSelectedStepId(step.id)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-150 relative ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/20'
                    : 'bg-white/60 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                  {step.isDecisionPoint && (
                    <Badge variant="warning" size="sm">
                      <Split className="w-3 h-3" /> Branch
                    </Badge>
                  )}
                </div>
                <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                  {step.title}
                </h5>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                  {step.userAction}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Inspector / Editor */}
      {selectedStep && (
        <Card className="border-l-4 border-l-teal-600 dark:border-l-teal-400 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold border border-teal-200 dark:border-teal-800">
                {selectedStep.stepNumber}
              </span>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedStep.title}
                    onChange={(e) => updateSelectedStep({ title: e.target.value })}
                    className="text-sm font-semibold bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-white"
                  />
                ) : (
                  <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Step {selectedStep.stepNumber}: {selectedStep.title}
                  </h4>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing && editableArtifact.happyPathSteps.length > 1 && (
                <button
                  onClick={() => handleDeleteStep(selectedStep.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-zinc-800"
                  title="Delete Step"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                User Action
              </span>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={selectedStep.userAction}
                  onChange={(e) => updateSelectedStep({ userAction: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-zinc-950 border border-zinc-700 text-zinc-100"
                />
              ) : (
                <p className="text-sm text-zinc-800 dark:text-zinc-200">{selectedStep.userAction}</p>
              )}
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                System Response
              </span>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={selectedStep.systemResponse}
                  onChange={(e) => updateSelectedStep({ systemResponse: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-zinc-950 border border-zinc-700 text-zinc-100"
                />
              ) : (
                <p className="text-sm text-zinc-800 dark:text-zinc-200">{selectedStep.systemResponse}</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500">UI Touchpoint:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={selectedStep.uiComponent}
                  onChange={(e) => updateSelectedStep({ uiComponent: e.target.value })}
                  className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-200 font-mono text-xs"
                />
              ) : (
                <code className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-xs border border-zinc-200 dark:border-zinc-700">
                  {selectedStep.uiComponent}
                </code>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
