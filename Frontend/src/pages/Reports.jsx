import React, { useState, useRef } from 'react';
import { exportCSV } from '../services/api';
import { generateComplianceAuditPDF, generateTrendAnalysisPDF } from '../utils/pdfGenerators';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Reports = () => {
  const [generating, setGenerating] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [streaming, setStreaming] = useState(false);
  const streamRef = useRef(null);

  const handleExportCSV = async () => {
    setGenerating(true);
    try {
      const blob = await exportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `risks_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Report exported successfully');
    } catch { toast.error('Failed to export report'); }
    finally { setGenerating(false); }
  };

  const handleStreamReport = () => {
    setStreamContent('');
    setStreaming(true);
    const token = localStorage.getItem('token');
    const es = new EventSource(`${API_BASE_URL}/api/reports/stream?token=${token}`);
    streamRef.current = es;

    es.onmessage = (event) => {
      if (event.data === '[DONE]') {
        es.close();
        setStreaming(false);
        toast.success('Report generated successfully');
        return;
      }
      try {
        const parsed = JSON.parse(event.data);
        setStreamContent(prev => prev + (parsed.token || ''));
      } catch {
        setStreamContent(prev => prev + event.data);
      }
    };

    es.onerror = () => {
      es.close();
      setStreaming(false);
      if (!streamContent) toast.error('Failed to generate report');
    };
  };

  const stopStream = () => {
    streamRef.current?.close();
    setStreaming(false);
  };

  const handleComplianceAudit = async () => {
    setGenerating(true);
    try {
      await generateComplianceAuditPDF();
      toast.success('Compliance Audit PDF downloaded');
    } catch { toast.error('Failed to generate Compliance Audit'); }
    finally { setGenerating(false); }
  };

  const handleTrendAnalysis = async () => {
    setGenerating(true);
    try {
      await generateTrendAnalysisPDF();
      toast.success('Trend Analysis PDF downloaded');
    } catch { toast.error('Failed to generate Trend Analysis'); }
    finally { setGenerating(false); }
  };

  const reportTypes = [
    {
      title: 'AI Executive Summary',
      description: 'AI-generated comprehensive analysis with strategic recommendations powered by LLaMA 3.3.',
      format: 'SSE Stream',
      action: handleStreamReport,
      isAI: true,
      color: '#a855f7',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
          <path d="M8.56 13.44A4 4 0 0 0 12 22a4 4 0 0 0 3.44-6.06" />
          <path d="M19.44 8.56A4 4 0 0 0 12 6a4 4 0 0 0-3.06 8.44" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      title: 'Risk Data Export',
      description: 'Complete dataset of all risk entries with full metadata and scoring parameters.',
      format: 'CSV',
      action: handleExportCSV,
      color: '#10b981',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      ),
    },
    {
      title: 'Compliance Audit',
      description: 'Regulatory compliance report with risk classification and mitigation adherence metrics.',
      format: 'PDF',
      action: handleComplianceAudit,
      color: '#06b6d4',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: 'Trend Analysis',
      description: 'Historical trend data and predictive modeling output for risk evolution patterns.',
      format: 'PDF',
      action: handleTrendAnalysis,
      color: '#f59e0b',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-sm text-slate-300 mt-1">Generate and download reports for compliance, audits, and strategic review.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow"></span>
          System Online
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg opacity-0 animate-fade-in-up stagger-${idx + 1}`}
            style={{
              background: 'linear-gradient(135deg, #162d47, #1e3a5f)',
              border: `1px solid ${report.isAI ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {/* Subtle corner glow */}
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500"
              style={{ background: `radial-gradient(circle, ${report.color}, transparent)` }}
            ></div>

            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${report.color}15`,
                  color: report.color,
                  border: `1px solid ${report.color}30`,
                }}
              >
                {report.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-2">
                  <h3 className="text-sm font-bold text-white">{report.title}</h3>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      background: `${report.color}15`,
                      color: report.color,
                      border: `1px solid ${report.color}25`,
                    }}
                  >
                    {report.format}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{report.description}</p>

                <button
                  onClick={report.action || (() => toast('Coming soon'))}
                  disabled={generating || streaming}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: `${report.color}15`,
                    color: report.color,
                    border: `1px solid ${report.color}30`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = report.color;
                    e.currentTarget.style.color = '#050a15';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${report.color}15`;
                    e.currentTarget.style.color = report.color;
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {generating ? 'Generating...' : report.action ? 'Generate Report' : 'Coming Soon'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Streaming Report Display */}
      {(streamContent || streaming) && (
        <div className="card p-6 opacity-0 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${streaming ? 'bg-[#a855f7] animate-pulse' : 'bg-[#10b981]'}`}></span>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                {streaming ? 'Generating Report...' : 'Report Generated'}
              </h3>
              {streaming && (
                <span className="text-[10px] text-purple-400 font-medium bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  LIVE
                </span>
              )}
            </div>
            {streaming && (
              <button
                onClick={stopStream}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all"
              >
                Stop
              </button>
            )}
          </div>
          <div className="bg-[#050a15] rounded-xl p-5 max-h-[500px] overflow-y-auto" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <pre className="text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
              {streamContent}
              {streaming && <span className="inline-block w-2 h-4 bg-[#a855f7] animate-pulse ml-0.5"></span>}
            </pre>
          </div>
        </div>
      )}

      {/* Recent Reports */}
      {!streamContent && !streaming && (
        <div className="card p-6 opacity-0 animate-fade-in-up stagger-5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-5">Recent Exports</h3>
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <svg className="text-slate-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-300">No recent exports</p>
            <p className="text-xs text-slate-500 mt-1.5">Generated reports will appear here for quick access.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
