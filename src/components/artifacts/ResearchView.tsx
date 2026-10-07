'use client';

import React, { useState, useEffect } from 'react';
import { ResearchArtifact, ResearchQuestion } from '@/lib/types/project';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  HelpCircle,
  Sparkles,
  Copy,
  Check,
  Target,
  MessageSquareQuote,
  CheckCircle2,
  FileQuestion,
  Edit3,
  Save,
  Plus,
  Trash2,
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils/export';

interface ResearchViewProps {
  artifact?: ResearchArtifact;
  onRegenerate?: () => void;
  onUpdate?: (updated: ResearchArtifact) => void;
  isGenerating?: boolean;
}

export const ResearchView: React.FC<ResearchViewProps> = ({
  artifact,
  onRegenerate,
  onUpdate,
  isGenerating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableArtifact, setEditableArtifact] = useState<ResearchArtifact | null>(artifact || null);

  useEffect(() => {
    if (artifact) setEditableArtifact(artifact);
  }, [artifact]);

  if (!artifact || !editableArtifact || !editableArtifact.interviewQuestions || editableArtifact.interviewQuestions.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">No Research Plan Generated Yet</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mt-1 mb-6">
          Generate structured user research interview guides, hypotheses to validate, and survey prompt templates.
        </p>
        <Button
          onClick={onRegenerate}
          isLoading={isGenerating}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Generate Research Guide
        </Button>
      </Card>
    );
  }

  const handleCopy = async () => {
    let text = `Research Objective: ${editableArtifact.objective}\n\n`;
    text += `Hypotheses:\n`;
    editableArtifact.hypotheses.forEach((h) => {
      text += `- [Risk: ${h.riskLevel.toUpperCase()}] ${h.hypothesis} (Signal: ${h.metricOrSignal})\n`;
    });
    text += `\nInterview Questions:\n`;
    editableArtifact.interviewQuestions.forEach((q, idx) => {
      text += `${idx + 1}. ${q.question} (${q.category})\n   Probing: ${q.probingFollowUp}\n   Insight: ${q.targetInsight}\n\n`;
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

  const handleAddQuestion = () => {
    const newQ: ResearchQuestion = {
      id: `q-${Date.now()}`,
      category: 'behavior',
      question: 'New discovery question to explore during participant interviews?',
      probingFollowUp: 'What specifically caused that reaction?',
      targetInsight: 'Uncover user decision criteria.',
    };
    setEditableArtifact({
      ...editableArtifact,
      interviewQuestions: [...editableArtifact.interviewQuestions, newQ],
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setEditableArtifact({
      ...editableArtifact,
      interviewQuestions: editableArtifact.interviewQuestions.filter((q) => q.id !== id),
    });
  };

  const updateQuestion = (id: string, updates: Partial<ResearchQuestion>) => {
    setEditableArtifact({
      ...editableArtifact,
      interviewQuestions: editableArtifact.interviewQuestions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Objective Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1 block">
            Research Objective
          </span>
          {isEditing ? (
            <textarea
              rows={2}
              value={editableArtifact.objective}
              onChange={(e) =>
                setEditableArtifact({ ...editableArtifact, objective: e.target.value })
              }
              className="w-full text-xs p-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100"
            />
          ) : (
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{editableArtifact.objective}</p>
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
              Edit Research
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy Guide'}
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

      {/* Semi-Structured Interview Questions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>Interview Guide ({editableArtifact.interviewQuestions.length} Questions)</span>
          </h4>

          {isEditing && (
            <Button size="sm" variant="secondary" onClick={handleAddQuestion} leftIcon={<Plus className="w-3 h-3" />}>
              Add Question
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {editableArtifact.interviewQuestions.map((q, idx) => (
            <Card key={q.id || idx} className="p-4 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {isEditing ? (
                    <select
                      value={q.category}
                      onChange={(e) =>
                        updateQuestion(q.id, { category: e.target.value as ResearchQuestion['category'] })
                      }
                      className="text-xs p-1 bg-zinc-950 border border-zinc-700 rounded text-zinc-100"
                    >
                      <option value="behavior">Behavior</option>
                      <option value="pain-point">Pain Point</option>
                      <option value="mental-model">Mental Model</option>
                      <option value="validation">Validation</option>
                      <option value="pricing">Pricing</option>
                    </select>
                  ) : (
                    <Badge variant="teal" size="sm">
                      {q.category}
                    </Badge>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <textarea
                  rows={2}
                  value={q.question}
                  onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                  className="w-full text-sm font-semibold p-1.5 rounded bg-zinc-950 border border-zinc-700 text-white mb-2"
                />
              ) : (
                <h5 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  &ldquo;{q.question}&rdquo;
                </h5>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Probing Follow-up:</span>{' '}
                  {isEditing ? (
                    <input
                      type="text"
                      value={q.probingFollowUp}
                      onChange={(e) => updateQuestion(q.id, { probingFollowUp: e.target.value })}
                      className="w-full text-xs p-1 rounded bg-zinc-950 border border-zinc-700 text-zinc-100 mt-1"
                    />
                  ) : (
                    q.probingFollowUp
                  )}
                </div>
                <div className="text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Target Insight:</span>{' '}
                  {isEditing ? (
                    <input
                      type="text"
                      value={q.targetInsight}
                      onChange={(e) => updateQuestion(q.id, { targetInsight: e.target.value })}
                      className="w-full text-xs p-1 rounded bg-zinc-950 border border-zinc-700 text-zinc-100 mt-1"
                    />
                  ) : (
                    q.targetInsight
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
