'use client';

import React, { useState } from 'react';
import { Project, UXArtifacts } from '@/lib/types/project';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { exportArtifactsToMarkdown, downloadFile, copyToClipboard } from '@/lib/utils/export';
import { FileText, Download, Copy, Check, Code, Share2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  artifacts: UXArtifacts;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  artifacts,
}) => {
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  const markdownContent = exportArtifactsToMarkdown(project, artifacts);
  const jsonContent = JSON.stringify({ project, artifacts }, null, 2);

  const activeContent = format === 'markdown' ? markdownContent : jsonContent;

  const handleCopy = async () => {
    const success = await copyToClipboard(activeContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const filename = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-spec.${
      format === 'markdown' ? 'md' : 'json'
    }`;
    const mime = format === 'markdown' ? 'text/markdown' : 'application/json';
    downloadFile(activeContent, filename, mime);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export UX Artifacts"
      description="Download formatted design specifications for Notion, Linear, GitHub, or developer handoff."
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Format Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <button
              onClick={() => setFormat('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                format === 'markdown'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown (.md)</span>
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                format === 'json'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Structured JSON (.json)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied to Clipboard' : 'Copy All'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download File
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="relative">
          <pre className="p-4 rounded-xl bg-zinc-900 dark:bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto max-h-[50vh] leading-relaxed border border-zinc-800">
            {activeContent}
          </pre>
        </div>
      </div>
    </Modal>
  );
};
