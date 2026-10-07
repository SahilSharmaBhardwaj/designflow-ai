'use client';

import React, { useState, useEffect } from 'react';
import { UserStoriesArtifact, UserStory } from '@/lib/types/project';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ListTodo,
  Sparkles,
  Copy,
  Check,
  User,
  CheckCircle2,
  AlertCircle,
  Hash,
  Edit3,
  Save,
  Plus,
  Trash2,
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils/export';

interface UserStoriesViewProps {
  artifact?: UserStoriesArtifact;
  onRegenerate?: () => void;
  onUpdate?: (updated: UserStoriesArtifact) => void;
  isGenerating?: boolean;
}

export const UserStoriesView: React.FC<UserStoriesViewProps> = ({
  artifact,
  onRegenerate,
  onUpdate,
  isGenerating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableArtifact, setEditableArtifact] = useState<UserStoriesArtifact | null>(artifact || null);

  useEffect(() => {
    if (artifact) setEditableArtifact(artifact);
  }, [artifact]);

  if (!artifact || !editableArtifact || !editableArtifact.stories || editableArtifact.stories.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
          <ListTodo className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">No User Stories Generated Yet</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mt-1 mb-6">
          Synthesize agile user stories with Gherkin acceptance criteria (Given-When-Then) and persona mapping.
        </p>
        <Button
          onClick={onRegenerate}
          isLoading={isGenerating}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Generate User Stories
        </Button>
      </Card>
    );
  }

  const handleCopy = async () => {
    let text = `User Stories Summary: ${editableArtifact.summary}\n\n`;
    editableArtifact.stories.forEach((s, idx) => {
      text += `Story ${idx + 1}: [${s.priority.toUpperCase()}] ${s.title}\n${s.story}\n\nAcceptance Criteria:\n`;
      s.acceptanceCriteria.forEach((ac) => {
        text += `Scenario: ${ac.scenario}\n  Given ${ac.given}\n  When ${ac.when}\n  Then ${ac.then}\n\n`;
      });
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

  const handleAddStory = () => {
    const newStory: UserStory = {
      id: `story-${Date.now()}`,
      persona: editableArtifact.personasIdentified?.[0] || 'User',
      title: 'New Agile Feature Story',
      story: 'As a user, I want to perform a task so that I achieve a clear outcome.',
      acceptanceCriteria: [
        {
          scenario: 'Successful task interaction',
          given: 'the user is on the screen',
          when: 'the user completes the action',
          then: 'the system provides immediate feedback',
        },
      ],
      edgeCases: ['Network delay during submit'],
      priority: 'must-have',
    };
    setEditableArtifact({
      ...editableArtifact,
      stories: [newStory, ...editableArtifact.stories],
    });
  };

  const handleDeleteStory = (id: string) => {
    setEditableArtifact({
      ...editableArtifact,
      stories: editableArtifact.stories.filter((s) => s.id !== id),
    });
  };

  const updateStory = (id: string, updates: Partial<UserStory>) => {
    setEditableArtifact({
      ...editableArtifact,
      stories: editableArtifact.stories.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Personas:
            </span>
            {editableArtifact.personasIdentified?.map((p, idx) => (
              <Badge key={idx} variant="teal" size="sm">
                <User className="w-3 h-3" /> {p}
              </Badge>
            ))}
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
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{editableArtifact.summary}</p>
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
              Edit Stories
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy All'}
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

      {isEditing && (
        <div className="flex justify-end">
          <Button size="sm" variant="secondary" onClick={handleAddStory} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add User Story
          </Button>
        </div>
      )}

      {/* Stories List */}
      <div className="space-y-4">
        {editableArtifact.stories.map((story, index) => (
          <Card key={story.id || index} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {isEditing ? (
                    <select
                      value={story.priority}
                      onChange={(e) =>
                        updateStory(story.id, { priority: e.target.value as UserStory['priority'] })
                      }
                      className="text-xs p-1 bg-zinc-950 border border-zinc-700 rounded text-zinc-100"
                    >
                      <option value="must-have">Must-Have</option>
                      <option value="should-have">Should-Have</option>
                      <option value="could-have">Could-Have</option>
                    </select>
                  ) : (
                    <Badge
                      variant={
                        story.priority === 'must-have'
                          ? 'danger'
                          : story.priority === 'should-have'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {story.priority}
                    </Badge>
                  )}

                  {isEditing ? (
                    <input
                      type="text"
                      value={story.persona}
                      onChange={(e) => updateStory(story.id, { persona: e.target.value })}
                      className="text-xs p-1 bg-zinc-950 border border-zinc-700 rounded text-zinc-100"
                      placeholder="Persona"
                    />
                  ) : (
                    <Badge variant="neutral" size="sm">
                      <User className="w-3 h-3" /> {story.persona}
                    </Badge>
                  )}
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={story.title}
                    onChange={(e) => updateStory(story.id, { title: e.target.value })}
                    className="w-full text-base font-semibold p-1 bg-zinc-950 border border-zinc-700 rounded text-white mt-1"
                  />
                ) : (
                  <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {story.title}
                  </h4>
                )}
              </div>

              {isEditing && (
                <button
                  onClick={() => handleDeleteStory(story.id)}
                  className="p-1.5 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800"
                  title="Delete Story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Story Statement */}
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800 mb-4">
              {isEditing ? (
                <textarea
                  rows={2}
                  value={story.story}
                  onChange={(e) => updateStory(story.id, { story: e.target.value })}
                  className="w-full text-sm p-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100"
                />
              ) : (
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 italic">
                  &ldquo;{story.story}&rdquo;
                </p>
              )}
            </div>

            {/* Gherkin Acceptance Criteria */}
            <div className="space-y-3 mb-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Acceptance Criteria (Gherkin Format)
              </h5>
              {story.acceptanceCriteria.map((ac, acIdx) => (
                <div
                  key={acIdx}
                  className="p-3.5 rounded-lg bg-zinc-900 dark:bg-zinc-950 text-zinc-100 font-mono text-xs border border-zinc-800"
                >
                  <div className="text-amber-400 font-bold mb-1.5">
                    Scenario: {ac.scenario}
                  </div>
                  <div className="space-y-1 text-zinc-300">
                    <div>
                      <span className="text-teal-400 font-bold">Given</span> {ac.given}
                    </div>
                    <div>
                      <span className="text-sky-400 font-bold">When</span> {ac.when}
                    </div>
                    <div>
                      <span className="text-emerald-400 font-bold">Then</span> {ac.then}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
