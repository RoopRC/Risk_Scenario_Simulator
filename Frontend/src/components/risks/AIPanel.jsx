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
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
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

  return (
    <div className="space-y-4">
      {/* Neural Advisor Card */}
      <div className="bg-[#222831] rounded-xl p-5 text-[#DFD0B8] relative overflow-hidden">
        <div className="absolute top-3 right-3 opacity-10">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#DFD0B8">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-2">AI Risk Advisor</h3>
        <p className="text-xs text-[#948979] leading-relaxed mb-4">
          Get intelligent recommendations and risk mitigation strategies powered by neural analysis.
        </p>
        <button
          onClick={handleGetRecommendations}
          disabled={loadingRecommend}
          className="w-full bg-[#DFD0B8] text-[#222831] py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#EDE4D3] transition-all disabled:opacity-50"
        >
          {loadingRecommend ? <LoadingSpinner size="sm" /> : 'Get Recommendations'}
        </button>
      </div>

      {/* Recommendations */}
      {recommendations && (
        <div className="card p-5">
          <h3 className="section-title mb-3">Recommendations</h3>
          <div className="space-y-2">
            {recommendations.recommendations?.map((rec, idx) => (
              <div key={idx} className="bg-slate-500/10 rounded-lg p-3 border border-slate-500/20">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-2xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
                    <span className="badge bg-slate-500/20 text-slate-300 mt-1.5">Priority: {rec.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {recommendations.meta && (
            <p className="text-2xs text-slate-300 mt-3">
              Confidence: {(recommendations.meta.confidence * 100).toFixed(0)}% •
              Model: {recommendations.meta.model_used}
              {recommendations.meta.cached ? ' • Cached' : ''}
            </p>
          )}
        </div>
      )}

      {/* Ask AI */}
      <div className="card p-5">
        <h3 className="section-title mb-3">Ask AI</h3>
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
            className="px-4 bg-[#222831] text-[#DFD0B8] rounded-lg text-xs font-bold hover:bg-[#393E46] transition-all disabled:opacity-50 flex-shrink-0"
          >
            {loadingQuery ? <LoadingSpinner size="sm" color="white" /> : 'Ask'}
          </button>
        </div>
        {aiResponse && (
          <div className="mt-3 p-3 bg-slate-500/10 rounded-lg border border-slate-500/20">
            <p className="text-xs text-slate-300 leading-relaxed">{aiResponse.answer}</p>
            {aiResponse.sources && (
              <p className="text-2xs text-slate-300 mt-2">Sources: {aiResponse.sources.join(', ')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;