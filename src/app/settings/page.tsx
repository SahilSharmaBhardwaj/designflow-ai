'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProjectStore } from '@/lib/storage/project-store';
import {
  Settings,
  Cpu,
  ShieldCheck,
  RefreshCw,
  Database,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { downloadFile } from '@/lib/utils/export';

interface HealthData {
  status: string;
  app: string;
  version: string;
  activeProvider: {
    id: string;
    name: string;
    info: {
      providerId: string;
      providerName: string;
      model: string;
      isLocal: boolean;
      description: string;
      configured: boolean;
    };
  };
  availableProviders: {
    providerId: string;
    providerName: string;
    model: string;
    isLocal: boolean;
    description: string;
    configured: boolean;
  }[];
}

export default function SettingsPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch (e) {
      console.error('Failed to fetch provider health', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleClearData = () => {
    if (confirm('Clear all local projects and reset to default starter templates?')) {
      ProjectStore.resetToDefaults();
      alert('Workspace reset successfully.');
    }
  };

  const handleExportWorkspace = () => {
    const jsonStr = ProjectStore.exportAllAsJSON();
    downloadFile(jsonStr, `designflow-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="teal">Configuration & Diagnostics</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          System Settings & AI Providers
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Inspect server-side AI provider configuration, diagnostics, and workspace storage.
        </p>
      </div>

      {/* Provider Diagnostic Panel */}
      <Card className="p-6 bg-zinc-900/60 border-zinc-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-950/80 border border-teal-800 text-teal-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Active AI Engine</h2>
              <p className="text-xs text-zinc-400">Server-side execution runtime</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchHealth}
            isLoading={loading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Status
          </Button>
        </div>

        {healthData && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {healthData.activeProvider.name}
                  </span>
                  <Badge variant={healthData.activeProvider.info.isLocal ? 'teal' : 'success'}>
                    {healthData.activeProvider.info.model}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  {healthData.activeProvider.info.description}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ready</span>
              </div>
            </div>

            {/* Provider Grid */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 pt-2">
              Registered Provider Connectors
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {healthData.availableProviders.map((prov) => (
                <div
                  key={prov.providerId}
                  className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{prov.providerName}</span>
                      <Badge variant={prov.configured ? 'success' : 'neutral'} size="sm">
                        {prov.configured ? 'Configured' : 'Not Set'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono mb-2">Model: {prov.model}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{prov.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Storage & Privacy Management */}
      <Card className="p-6 bg-zinc-900/60 border-zinc-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
          <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Local Storage & Privacy</h2>
            <p className="text-xs text-zinc-400">All projects and artifacts remain in your browser storage</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-zinc-400 max-w-md">
            Export a full JSON backup of your projects or reset your workspace to fresh starter templates.
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportWorkspace}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export JSON Backup
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearData}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Reset Workspace
            </Button>
          </div>
        </div>
      </Card>

      {/* Security Architecture Note */}
      <Card className="p-4 bg-zinc-900/40 border-zinc-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 leading-relaxed">
          <span className="font-semibold text-zinc-200">Security Architecture Guarantee:</span> DesignFlow AI never transmits or exposes API credentials to client bundles. All external model routing occurs in server-side Node.js environment variables.
        </div>
      </Card>
    </div>
  );
}
