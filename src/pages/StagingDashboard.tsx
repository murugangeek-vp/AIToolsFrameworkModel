import React, { useEffect, useState } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';

interface StagingRecord {
  id: number;
  category: string;
  original_id: string | null;
  proposed_data: Record<string, any>;
  status: string;
  agent_reasoning: string;
  created_at: string;
}

export const StagingDashboard: React.FC = () => {
  const [records, setRecords] = useState<StagingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/staging');
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (e) {
      console.error('Failed to fetch staging records', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/staging/${id}/approve`, { method: 'POST' });
      fetchRecords();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/staging/${id}/reject`, { method: 'POST' });
      fetchRecords();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading staging records...</div>;

  return (
    <div className="p-8 h-full overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-indigo-400" />
          Pending AI Updates
        </h1>
        <button onClick={fetchRecords} className="t-btn-secondary px-4 py-2 rounded-lg text-sm">
          Refresh List
        </button>
      </div>

      {records.length === 0 ? (
        <div className="text-center p-12 bg-white/5 rounded-xl border border-white/10 text-gray-400">
          No pending records to review. The AI agents are all caught up!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {records.map(r => (
            <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {r.proposed_data?.name || r.original_id || 'New Record'}
                  </h3>
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded mt-1 inline-block">
                    {r.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApprove(r.id)}
                    className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button 
                    onClick={() => handleReject(r.id)}
                    className="flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-300 mb-4 bg-black/20 p-3 rounded-lg">
                <strong>Agent Reasoning:</strong> {r.agent_reasoning || 'No reasoning provided.'}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(r.proposed_data).map(([key, value]) => (
                  <div key={key} className="flex flex-col border-b border-white/5 pb-2">
                    <span className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-sm text-white truncate" title={String(value)}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
