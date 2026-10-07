'use client';

import React, { useState } from 'react';
import { DesignBriefArtifact, DesignPrinciple } from '@/lib/types/project';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Edit3,
  Save,
  CheckCircle2,
  Compass,
  Palette,
  ShieldCheck,
  Calendar,
  User,
  Plus,
  Trash2,
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils/export';

interface DesignBriefViewProps {
  artifact?: DesignBriefArtifact;
  onRegenerate?: () => void;
  onUpdate?: (updated: DesignBriefArtifact) => void;
  isGenerating?: boolean;
}

export const DesignBriefView: React.FC<DesignBriefViewProps> = ({
  artifact,
  onRegenerate,
  onUpdate,
  isGenerating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableArtifact, setEditableArtifact] = useState<DesignBriefArtifact | null>(
    artifact || null
  );

  React.useEffect(() => {
    if (artifact) setEditableArtifact(artifact);
  }, [artifact]);

  if (!artifact || !editableArtifact) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">No Design Brief Generated Yet</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mt-1 mb-6">
          Synthesize a comprehensive design specification, user psychology profile, design principles, and token guidelines.
        </p>
        <Button
          onClick={onRegenerate}
          isLoading={isGenerating}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Generate Design Brief
        </Button>
      </Card>
    );
  }

  const handleCopy = async () => {
    let text = `# Design Brief\n\n${editableArtifact.executiveSummary}\n\n`;
    text += `## Target Audience Profile\nPersona: ${editableArtifact.targetAudienceProfile.primaryPersona}\nMental Model: ${editableArtifact.targetAudienceProfile.mentalModel}\n\n`;
    text += `## Design Principles\n`;
    editableArtifact.designPrinciples.forEach((p, idx) => {
      text += `${idx + 1}. ${p.title}\n   Rationale: ${p.rationale}\n`;
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

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="teal" size="sm">
              <Compass className="w-3 h-3" /> Design Specification
            </Badge>
            <Badge variant="neutral" size="sm">
              <User className="w-3 h-3" /> {editableArtifact.targetAudienceProfile.primaryPersona}
            </Badge>
          </div>
          {isEditing ? (
            <textarea
              rows={2}
              value={editableArtifact.executiveSummary}
              onChange={(e) =>
                setEditableArtifact({ ...editableArtifact, executiveSummary: e.target.value })
              }
              className="w-full p-2 text-xs bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100"
            />
          ) : (
            <p className="text-xs text-zinc-700 dark:text-zinc-300">{editableArtifact.executiveSummary}</p>
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
              Edit Brief
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy Brief'}
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

      {/* Persona Psychology Profile */}
      <Card className="p-5 bg-zinc-900/60 border-zinc-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-teal-400" />
          Target Audience & Mental Model
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="font-semibold text-zinc-300 block mb-1">Core Pain Points to Mitigate:</span>
            <ul className="space-y-1 text-zinc-400 list-disc list-inside">
              {editableArtifact.targetAudienceProfile.corePainPoints.map((pt, idx) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="font-semibold text-zinc-300 block mb-1">User Mental Model:</span>
            <p className="text-zinc-400 leading-relaxed">
              {editableArtifact.targetAudienceProfile.mentalModel}
            </p>
          </div>
        </div>
      </Card>

      {/* Core Design Principles */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Compass className="w-4 h-4 text-zinc-300" />
          Core Design Principles ({editableArtifact.designPrinciples.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {editableArtifact.designPrinciples.map((principle, idx) => (
            <Card key={idx} className="p-4 bg-zinc-900/60 border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-md bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <h5 className="text-sm font-semibold text-white">{principle.title}</h5>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">{principle.rationale}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80">
                <span className="text-[11px] uppercase font-bold text-zinc-500 block mb-1">
                  Tactical Guidelines:
                </span>
                <ul className="space-y-1 text-xs text-zinc-300">
                  {principle.tacticalGuidelines.map((tg, tgIdx) => (
                    <li key={tgIdx} className="flex items-start gap-1.5">
                      <span className="text-teal-400">•</span>
                      <span>{tg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Visual & Spatial System Directives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-teal-400" />
            Visual & Spatial Directives
          </h4>
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-zinc-500 font-semibold block">Density & Layout:</span>
              <span className="text-zinc-300">{editableArtifact.visualAndSpatialGuidelines.layoutDensity}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-semibold block">Typography Hierarchy:</span>
              <span className="text-zinc-300">{editableArtifact.visualAndSpatialGuidelines.typographyHierarchy}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-semibold block">Color System:</span>
              <span className="text-zinc-300">{editableArtifact.visualAndSpatialGuidelines.colorSystemGuidance}</span>
            </div>
          </div>
        </Card>

        {/* Accessibility & Deliverables */}
        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Accessibility Mandates (WCAG 2.2)
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300">
            {editableArtifact.accessibilityDirectives.map((dir, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{dir}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Scope & Milestones */}
      {editableArtifact.scopeAndMilestones && (
        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-teal-400" />
            Execution Phases & Deliverables
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {editableArtifact.scopeAndMilestones.map((ms, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{ms.phase}</span>
                  <Badge variant="neutral" size="sm">{ms.targetDuration}</Badge>
                </div>
                <ul className="space-y-1 text-xs text-zinc-400 list-disc list-inside mt-2">
                  {ms.deliverables.map((del, dIdx) => (
                    <li key={dIdx}>{del}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
