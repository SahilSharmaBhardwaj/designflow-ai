'use client';

import React, { useState, useEffect } from 'react';
import { UsabilityTestArtifact, UsabilityTask } from '@/lib/types/project';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FlaskConical,
  Sparkles,
  Copy,
  Check,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BarChart2,
  Edit3,
  Save,
  Plus,
  Trash2,
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils/export';

interface UsabilityTestViewProps {
  artifact?: UsabilityTestArtifact;
  onRegenerate?: () => void;
  onUpdate?: (updated: UsabilityTestArtifact) => void;
  isGenerating?: boolean;
}

export const UsabilityTestView: React.FC<UsabilityTestViewProps> = ({
  artifact,
  onRegenerate,
  onUpdate,
  isGenerating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableArtifact, setEditableArtifact] = useState<UsabilityTestArtifact | null>(artifact || null);

  useEffect(() => {
    if (artifact) setEditableArtifact(artifact);
  }, [artifact]);

  if (!artifact || !editableArtifact || !editableArtifact.tasks || editableArtifact.tasks.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
          <FlaskConical className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">No Usability Test Plan Generated</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mt-1 mb-6">
          Generate participant task scenarios, success criteria, and quantitative UX metrics (SUS, SEQ, completion rate).
        </p>
        <Button
          onClick={onRegenerate}
          isLoading={isGenerating}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Generate Usability Test Plan
        </Button>
      </Card>
    );
  }

  const handleCopy = async () => {
    let text = `Usability Test Plan\nGoal: ${editableArtifact.testGoal}\nProfile: ${editableArtifact.targetParticipantProfile}\nSample Size: ${editableArtifact.recommendedSampleSize} users\n\nTasks:\n`;
    editableArtifact.tasks.forEach((t) => {
      text += `Task ${t.taskNumber}: ${t.scenario}\nPrompt: "${t.participantPrompt}"\nSuccess Criteria: ${t.successCriteria}\nMax Duration: ~${t.maxExpectedDurationMinutes} min\n\n`;
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

  const handleAddTask = () => {
    const nextNum = editableArtifact.tasks.length + 1;
    const newTask: UsabilityTask = {
      id: `task-${Date.now()}`,
      taskNumber: nextNum,
      scenario: `Task ${nextNum} Scenario`,
      participantPrompt: 'Please try to accomplish the specified user goal.',
      successCriteria: 'User reaches the confirmation state without moderator intervention.',
      maxExpectedDurationMinutes: 3,
      potentialFrictionPoints: ['Confusion locating button'],
    };
    setEditableArtifact({
      ...editableArtifact,
      tasks: [...editableArtifact.tasks, newTask],
    });
  };

  const handleDeleteTask = (id: string) => {
    const filtered = editableArtifact.tasks
      .filter((t) => t.id !== id)
      .map((t, idx) => ({ ...t, taskNumber: idx + 1 }));
    setEditableArtifact({
      ...editableArtifact,
      tasks: filtered,
    });
  };

  const updateTask = (id: string, updates: Partial<UsabilityTask>) => {
    setEditableArtifact({
      ...editableArtifact,
      tasks: editableArtifact.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Protocol Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="teal" size="sm">
              <Users className="w-3 h-3" /> Sample: {editableArtifact.recommendedSampleSize} Participants
            </Badge>
            <Badge variant="neutral" size="sm">
              <Clock className="w-3 h-3" /> ~15-20 Min Session
            </Badge>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editableArtifact.testGoal}
              onChange={(e) =>
                setEditableArtifact({ ...editableArtifact, testGoal: e.target.value })
              }
              className="w-full text-xs p-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100 mb-1"
            />
          ) : (
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{editableArtifact.testGoal}</p>
          )}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Profile: {editableArtifact.targetParticipantProfile}
          </p>
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
              Edit Plan
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy Plan'}
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

      {/* Usability Tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>Participant Task Scenarios ({editableArtifact.tasks.length})</span>
          </h4>

          {isEditing && (
            <Button size="sm" variant="secondary" onClick={handleAddTask} leftIcon={<Plus className="w-3 h-3" />}>
              Add Task
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {editableArtifact.tasks.map((task) => (
            <Card key={task.id} className="p-5">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center">
                    T{task.taskNumber}
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={task.scenario}
                      onChange={(e) => updateTask(task.id, { scenario: e.target.value })}
                      className="text-sm font-semibold p-1 bg-zinc-950 border border-zinc-700 rounded text-white flex-1"
                    />
                  ) : (
                    <h5 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {task.scenario}
                    </h5>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800 ml-2"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Participant Prompt Callout */}
              <div className="p-3.5 rounded-lg bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/60 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 block mb-1">
                  Participant Instructions / Script:
                </span>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={task.participantPrompt}
                    onChange={(e) => updateTask(task.id, { participantPrompt: e.target.value })}
                    className="w-full text-xs p-1.5 rounded bg-zinc-950 border border-zinc-700 text-teal-100"
                  />
                ) : (
                  <p className="text-xs text-teal-950 dark:text-teal-100 italic font-medium leading-relaxed">
                    &ldquo;{task.participantPrompt}&rdquo;
                  </p>
                )}
              </div>

              {/* Success Criteria */}
              <div className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Success Criteria:</span>{' '}
                  {isEditing ? (
                    <input
                      type="text"
                      value={task.successCriteria}
                      onChange={(e) => updateTask(task.id, { successCriteria: e.target.value })}
                      className="w-full text-xs p-1 rounded bg-zinc-950 border border-zinc-700 text-zinc-100 mt-1"
                    />
                  ) : (
                    task.successCriteria
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
