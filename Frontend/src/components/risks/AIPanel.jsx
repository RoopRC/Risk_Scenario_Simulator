import React, { useState } from 'react';
import { getAIRecommendations, askAIQuery } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const AIPanel = ({ riskId, riskTitle }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecommend, setLoadingRecommend] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingQuery, setLoadingQuery] = useState(false);

  const handleGetRecommendations = async () => {
    setLoadingRecommend(true);
    try {
      const data = await getAIRecommendations(riskId);
      setRecommendations(data);
      toast.success('AI recommendations generated');
    } catch (error) {
      toast.error('Failed to get recommendations');
    } finally {
      setLoadingRecommend(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) { toast.error('Please enter a question'); return; }
    setLoadingQuery(true);
    try {
      const data = await askAIQuery(riskId, question);
      setAiResponse(data);
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setLoadingQuery(false);
    }
  };

  const PRIORITY_COLORS = {
    HIGH: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
    MEDIUM: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)', text: '#fb923c' },
    LOW: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
  };

  return (
    <div className="space-y-5">
      {/* Neural Advisor Header Card */}
      <div className="card relative overflow-hidden">
        {/* Gradient top accent */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4, #a855f7)' }} />
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#050a15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" /><path d="M8.24 9.93A4 4 0 0 1 12 2" />
                <path d="M5 11a2 2 0 0 0 0 4" /><path d="M19 11a2 2 0 0 1 0 4" />
                <path d="M12 18v4" /><path d="M8 22h8" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">AI Risk Advisor</h3>
              <p className="text-2xs text-slate-500">Neural-powered analysis engine</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Generate intelligent mitigation strategies and deep risk analysis powered by advanced AI models.
          </p>

          <button
            onClick={handleGetRecommendations}
            disabled={loadingRecommend}
            className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: loadingRecommend ? '#162d47' : 'linear-gradient(135deg, #10b981, #06b6d4)',
              color: loadingRecommend ? '#94a3b8' : '#050a15',
              boxShadow: loadingRecommend ? 'none' : '0 4px 16px rgba(16,185,129,0.3)',
            }}
          >
            {loadingRecommend ? (
              <><LoadingSpinner size="sm" /> <span>Analyzing...</span></>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                Generate Recommendations
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recommendations Results */}
      {recommendations && (
        <div className="card overflow-hidden opacity-0 animate-fade-in-up">
          <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }} />
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">AI Recommendations</h3>
            </div>
            <div className="space-y-3">
              {recommendations.recommendations?.map((rec, idx) => {
                const pc = PRIORITY_COLORS[rec.priority?.toUpperCase()] || PRIORITY_COLORS.MEDIUM;
                return (
                  <div key={idx} className="rounded-xl p-4 transition-all duration-200 hover:translate-x-0.5" style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-lg text-2xs font-bold flex items-center justify-center mt-0.5" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
                        <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider" style={{ background: pc.bg, border: `1px solid ${pc.border}`, color: pc.text }}>
                          {rec.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {recommendations.meta && (
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                <span className="text-2xs text-slate-500 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Confidence: {(recommendations.meta.confidence * 100).toFixed(0)}%
                </span>
                <span className="text-2xs text-slate-500">•</span>
                <span className="text-2xs text-slate-500">{recommendations.meta.model_used}</span>
                {recommendations.meta.cached && (
                  <><span className="text-2xs text-slate-500">•</span><span className="text-2xs text-emerald-500">Cached</span></>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ask AI Card */}
      <div className="card overflow-hidden">
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #a855f7, #06b6d4)' }} />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#c084fc' }}>Ask AI</h3>
          </div>
          <p className="text-2xs text-slate-500 mb-3">Ask specific questions about this risk scenario</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What are the main concerns?"
              className="input text-xs"
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
            />
            <button
              onClick={handleAskQuestion}
              disabled={loadingQuery}
              className="px-4 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex-shrink-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', color: '#050a15', minWidth: 44 }}
            >
              {loadingQuery ? <LoadingSpinner size="sm" /> : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              )}
            </button>
          </div>
          {aiResponse && (
            <div className="mt-4 rounded-xl p-4 opacity-0 animate-fade-in-up" style={{ background: '#0a0e1a', border: '1px solid rgba(168,85,247,0.15)' }}>
              <p className="text-xs text-slate-300 leading-relaxed">{aiResponse.answer}</p>
              {aiResponse.sources && (
                <p className="text-2xs text-slate-500 mt-2 pt-2 border-t border-white/5">Sources: {aiResponse.sources.join(', ')}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPanel;