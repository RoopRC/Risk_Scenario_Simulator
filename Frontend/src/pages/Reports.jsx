import React, { useState, useRef } from 'react';
import { exportCSV } from '../services/api';
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

  const reportTypes = [
    {
      title: 'AI Executive Summary', description: 'AI-generated comprehensive analysis with strategic recommendations powered by LLaMA 3.3.', format: 'SSE Stream', action: handleStreamReport, isAI: true,
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>),
    },
    {
      title: 'Risk Data Export', description: 'Complete dataset of all risk entries with full metadata and scoring parameters.', format: 'CSV', action: handleExportCSV,
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>),
    },
    {
      title: 'Compliance Audit', description: 'Regulatory compliance report with risk classification and mitigation adherence metrics.', format: 'PDF',
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
    },
    {
      title: 'Trend Analysis', description: 'Historical trend data and predictive modeling output for risk evolution patterns.', format: 'PDF',
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download reports for compliance, audits, and strategic review.</p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report, idx) => (
          <div key={idx} className={`card p-6 group opacity-0 animate-fade-in-up stagger-${idx + 1} ${report.isAI ? 'ring-1 ring-accent/20' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${report.isAI ? 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white' : 'bg-navy-900/5 text-navy-900 group-hover:bg-navy-900 group-hover:text-white'}`}>
                {report.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-gray-900">{report.title}</h3>
                  <span className={`badge ${report.isAI ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-500'}`}>{report.format}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{report.description}</p>
                <button
                  onClick={report.action || (() => toast('Coming soon'))}
                  disabled={generating || streaming}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors uppercase tracking-wider ${report.isAI ? 'text-accent hover:text-accent-dark' : 'text-navy-900 hover:text-navy-700'}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  {generating ? 'Generating...' : 'Generate Report'}
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
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${streaming ? 'bg-[#948979] animate-pulse' : 'bg-[#6B8F71]'}`}></span>
              <h3 className="section-title">{streaming ? 'Generating Report...' : 'Report Generated'}</h3>
            </div>
            {streaming && (
              <button onClick={stopStream} className="text-xs text-danger font-bold uppercase tracking-wider hover:text-red-600 transition-colors">Stop</button>
            )}
          </div>
          <div className="bg-[#222831] rounded-xl p-5 max-h-[500px] overflow-y-auto">
            <pre className="text-sm text-[#DFD0B8] whitespace-pre-wrap font-sans leading-relaxed">
              {streamContent}
              {streaming && <span className="inline-block w-2 h-4 bg-[#948979] animate-pulse ml-0.5"></span>}
            </pre>
          </div>
        </div>
      )}

      {/* Recent Reports */}
      {!streamContent && !streaming && (
        <div className="card p-5 opacity-0 animate-fade-in-up stagger-5">
          <h3 className="section-title mb-4">Recent Exports</h3>
          <div className="text-center py-8">
            <svg className="mx-auto mb-3 text-gray-300" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-sm font-medium text-gray-500">No recent exports</p>
            <p className="text-xs text-gray-400 mt-1">Generated reports will appear here for quick access.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
