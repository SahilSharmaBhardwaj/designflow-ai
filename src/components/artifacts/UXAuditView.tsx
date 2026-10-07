'use client';

import React, { useState, useEffect } from 'react';
import { UXAuditArtifact, AuditFinding } from '@/lib/types/project';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  Filter,
  CheckSquare,
  Award,
  Edit3,
  Save,
  Plus,
  Trash2,
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils/export';

interface UXAuditViewProps {
  artifact?: UXAuditArtifact;
  onRegenerate?: () => void;
  onUpdate?: (updated: UXAuditArtifact) => void;
  isGenerating?: boolean;
}

export const UXAuditView: React.FC<UXAuditViewProps> = ({
  artifact,
  onRegenerate,
  onUpdate,
  isGenerating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableArtifact, setEditableArtifact] = useState<UXAuditArtifact | null>(artifact || null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  useEffect(() => {
    if (artifact) setEditableArtifact(artifact);
  }, [artifact]);

  if (!artifact || !editableArtifact || !editableArtifact.findings || editableArtifact.findings.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">No UX Audit Generated Yet</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mt-1 mb-6">
          Evaluate Nielsen Norman heuristics and WCAG 2.2 accessibility guidelines against your product requirements.
        </p>
        <Button
          onClick={onRegenerate}
          isLoading={isGenerating}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Generate UX Audit
        </Button>
      </Card>
    );
  }

  const handleCopy = async () => {
    let text = `UX Health Score: ${editableArtifact.overallScore}/100\n${editableArtifact.executiveSummary}\n\n`;
    editableArtifact.findings.forEach((f, idx) => {
      text += `${idx + 1}. [${f.severity.toUpperCase()}] ${f.title}\n- Heuristic: ${f.heuristic}\n- Description: ${f.description}\n- Recommendation: ${f.recommendation}\n\n`;
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

  const handleAddFinding = () => {
    const newFinding: AuditFinding = {
      id: `audit-${Date.now()}`,
      heuristic: 'Visibility of System Status (Heuristic #1)',
      title: 'New Usability Friction Finding',
      description: 'Describe the UX friction point or heuristic violation observed in the flow.',
      severity: 'major',
      wcagReference: 'WCAG 3.2.2',
      recommendation: 'Specify actionable UI pattern fix and design recommendation.',
    };
    setEditableArtifact({
      ...editableArtifact,
      findings: [newFinding, ...editableArtifact.findings],
    });
  };

  const handleDeleteFinding = (id: string) => {
    setEditableArtifact({
      ...editableArtifact,
      findings: editableArtifact.findings.filter((f) => f.id !== id),
    });
  };

  const updateFinding = (id: string, updates: Partial<AuditFinding>) => {
    setEditableArtifact({
      ...editableArtifact,
      findings: editableArtifact.findings.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    });
  };

  const filteredFindings = editableArtifact.findings.filter((f) => {
    if (selectedSeverity === 'all') return true;
    return f.severity === selectedSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Card */}
        <Card className="flex items-center gap-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex flex-col items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
            {isEditing ? (
              <input
                type="number"
                min={0}
                max={100}
                value={editableArtifact.overallScore}
                onChange={(e) =>
                  setEditableArtifact({ ...editableArtifact, overallScore: Number(e.target.value) })
                }
                className="w-12 text-center text-lg font-black bg-zinc-950 border border-zinc-700 rounded text-white"
              />
            ) : (
              <span className="text-2xl font-black tracking-tight">{editableArtifact.overallScore}</span>
            )}
            <span className="text-[10px] uppercase font-bold tracking-wider -mt-1 text-teal-600 dark:text-teal-400">/ 100</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <Award className="w-3.5 h-3.5 text-teal-600" />
              <span>UX Health Score</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Estimated benchmark based on NN/g 10 heuristics.
            </p>
          </div>
        </Card>

        {/* WCAG Summary Card */}
        <Card className="flex flex-col justify-center bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                WCAG 2.2 Compliance Tier
              </span>
              <Badge variant="success">Level {editableArtifact.wcagComplianceSummary.level}</Badge>
              <Badge variant="neutral">~{editableArtifact.wcagComplianceSummary.passRateEstimated} Target</Badge>
            </div>

            <div className="flex items-center gap-2">
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
                  Edit Audit
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copied ? 'Copied' : 'Copy'}
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

          {isEditing ? (
            <textarea
              rows={2}
              value={editableArtifact.executiveSummary}
              onChange={(e) =>
                setEditableArtifact({ ...editableArtifact, executiveSummary: e.target.value })
              }
              className="w-full text-xs p-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100"
            />
          ) : (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {editableArtifact.executiveSummary}
            </p>
          )}
        </Card>
      </div>

      {/* Findings List with Filters */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>Audit Findings ({editableArtifact.findings.length})</span>
            </h4>
            {isEditing && (
              <Button size="sm" variant="secondary" onClick={handleAddFinding} leftIcon={<Plus className="w-3 h-3" />}>
                Add Finding
              </Button>
            )}
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-zinc-400 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {['all', 'critical', 'major', 'minor', 'enhancement'].map((sev) => {
              const isActive = selectedSeverity === sev;
              const count =
                sev === 'all'
                  ? editableArtifact.findings.length
                  : editableArtifact.findings.filter((f) => f.severity === sev).length;
              return (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  {sev} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Findings Grid */}
        <div className="space-y-3">
          {filteredFindings.map((finding) => (
            <Card
              key={finding.id}
              className="border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {isEditing ? (
                      <select
                        value={finding.severity}
                        onChange={(e) =>
                          updateFinding(finding.id, { severity: e.target.value as AuditFinding['severity'] })
                        }
                        className="text-xs p-1 bg-zinc-950 border border-zinc-700 rounded text-zinc-100"
                      >
                        <option value="critical">Critical</option>
                        <option value="major">Major</option>
                        <option value="minor">Minor</option>
                        <option value="enhancement">Enhancement</option>
                      </select>
                    ) : (
                      <Badge
                        variant={
                          finding.severity === 'critical'
                            ? 'danger'
                            : finding.severity === 'major'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {finding.severity}
                      </Badge>
                    )}

                    {isEditing ? (
                      <input
                        type="text"
                        value={finding.heuristic}
                        onChange={(e) => updateFinding(finding.id, { heuristic: e.target.value })}
                        className="text-xs p-1 bg-zinc-950 border border-zinc-700 rounded text-zinc-100 flex-1"
                        placeholder="Heuristic name"
                      />
                    ) : (
                      <Badge variant="neutral">
                        <span className="text-zinc-400">Heuristic:</span> {finding.heuristic}
                      </Badge>
                    )}
                  </div>

                  {isEditing ? (
                    <input
                      type="text"
                      value={finding.title}
                      onChange={(e) => updateFinding(finding.id, { title: e.target.value })}
                      className="w-full text-sm font-semibold p-1 bg-zinc-950 border border-zinc-700 rounded text-white mt-1"
                    />
                  ) : (
                    <h5 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {finding.title}
                    </h5>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={() => handleDeleteFinding(finding.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800"
                    title="Delete Finding"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <textarea
                  rows={2}
                  value={finding.description}
                  onChange={(e) => updateFinding(finding.id, { description: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-zinc-950 border border-zinc-700 text-zinc-100 mb-3"
                  placeholder="Issue description"
                />
              ) : (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                  {finding.description}
                </p>
              )}

              {/* Recommendation Box */}
              <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed flex-1">
                  <span className="font-semibold text-emerald-950 dark:text-emerald-100 block mb-1">
                    Actionable UX Fix:
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={finding.recommendation}
                      onChange={(e) => updateFinding(finding.id, { recommendation: e.target.value })}
                      className="w-full text-xs p-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100"
                    />
                  ) : (
                    finding.recommendation
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
