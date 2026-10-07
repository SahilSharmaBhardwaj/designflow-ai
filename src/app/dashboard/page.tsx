'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types/project';
import { ProjectStore } from '@/lib/storage/project-store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Plus,
  Layers,
  Search,
  ArrowUpRight,
  Copy,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  GitFork,
  ShieldAlert,
  ListTodo,
  CheckCircle2,
} from 'lucide-react';
import { downloadFile } from '@/lib/utils/export';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProjects(ProjectStore.getProjects());
    setMounted(true);
  }, []);

  const handleDuplicate = (id: string) => {
    ProjectStore.duplicateProject(id);
    setProjects(ProjectStore.getProjects());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      ProjectStore.deleteProject(id);
      setProjects(ProjectStore.getProjects());
    }
  };

  const handleReset = () => {
    if (confirm('Reset workspace to default sample projects?')) {
      ProjectStore.resetToDefaults();
      setProjects(ProjectStore.getProjects());
    }
  };

  const handleExportWorkspace = () => {
    const jsonStr = ProjectStore.exportAllAsJSON();
    downloadFile(jsonStr, `designflow-workspace-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  };

  const handleImportWorkspace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = ProjectStore.importFromJSON(content);
      if (res.success) {
        alert(`Successfully imported ${res.count} projects!`);
        setProjects(ProjectStore.getProjects());
      } else {
        alert(`Import failed: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        <div className="text-zinc-400 text-sm">Loading workspace...</div>
      </div>
    );
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.requirements.problemStatement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || p.requirements.productType === selectedType;
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const totalArtifactsCount = projects.reduce((acc, p) => {
    let count = 0;
    if (p.artifacts.userFlow) count++;
    if (p.artifacts.uxAudit) count++;
    if (p.artifacts.userStories) count++;
    if (p.artifacts.researchPlan) count++;
    if (p.artifacts.usabilityTesting) count++;
    return acc + count;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header with Title and Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Design Workspace
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your UX requirement projects and generated design specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/project/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Create Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Total Projects
          </span>
          <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
        </Card>

        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            UX Artifacts Synthesized
          </span>
          <div className="text-2xl font-bold text-teal-400 mt-1">{totalArtifactsCount}</div>
        </Card>

        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Active Provider Engine
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge variant="teal">Local Mock Engine</Badge>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1">
            {['all', 'fintech', 'b2b-saas', 'ecommerce'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  selectedType === type
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportWorkspace}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export JSON
            </Button>

            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImportWorkspace}
                className="hidden"
              />
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Import
              </span>
            </label>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              title="Reset to sample projects"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="py-16 text-center bg-zinc-900/40 border-zinc-800">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 mx-auto mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-zinc-200">No Projects Found</h3>
          <p className="text-sm text-zinc-500 mt-1 mb-6">
            Create a new product design project or adjust your search filter.
          </p>
          <Link href="/project/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Create New Project
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const hasFlow = Boolean(project.artifacts.userFlow);
            const hasAudit = Boolean(project.artifacts.uxAudit);
            const hasStories = Boolean(project.artifacts.userStories);

            return (
              <Card
                key={project.id}
                className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between p-5 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="teal" size="sm">
                      {project.requirements.productType}
                    </Badge>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {new Date(project.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <Link href={`/project/${project.id}`}>
                    <h3 className="text-base font-semibold text-zinc-100 group-hover:text-teal-400 transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {project.requirements.problemStatement}
                  </p>

                  {/* Artifact Indicators */}
                  <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-500">
                    <span className="text-[11px] uppercase font-semibold tracking-wider text-zinc-500">
                      Artifacts:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {hasFlow && (
                        <span className="w-5 h-5 rounded bg-teal-950/80 text-teal-400 border border-teal-800/60 flex items-center justify-center text-[10px] font-bold" title="User Flow">
                          UF
                        </span>
                      )}
                      {hasAudit && (
                        <span className="w-5 h-5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center justify-center text-[10px] font-bold" title="UX Audit">
                          UX
                        </span>
                      )}
                      {hasStories && (
                        <span className="w-5 h-5 rounded bg-sky-950/80 text-sky-400 border border-sky-800/60 flex items-center justify-center text-[10px] font-bold" title="User Stories">
                          US
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(project.id)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-md hover:bg-zinc-800 transition-colors"
                      title="Duplicate Project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-md hover:bg-zinc-800 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link href={`/project/${project.id}`}>
                    <span className="text-xs font-medium text-teal-400 hover:text-teal-300 flex items-center gap-1">
                      Open Workspace <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
