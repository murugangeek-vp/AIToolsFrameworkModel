import React, { useState, useRef } from 'react';
import { csvService } from '@services/CSVService';
import { useToolStore } from '@store/useToolStore';

interface DatasetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatasetUploadModal: React.FC<DatasetUploadModalProps> = ({ isOpen, onClose }) => {
  const { addCustomTools } = useToolStore();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Invalid file format. Please upload a valid CSV dataset file.');
      return;
    }

    setParsing(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await csvService.parseFile(file);
      
      // Perform simple validation check
      const validTools = result.data.filter((t) => {
        return t.name && t.category;
      });

      if (validTools.length === 0) {
        setError('Schema Error: No valid tool records found. Check header keys (e.g. name, category).');
        setParsing(false);
        return;
      }

      // Add to store
      addCustomTools(validTools);
      setSuccess(`Successfully uploaded and validated ${validTools.length} custom AI tools into the local platform runtime!`);
      
      if (result.errors.length > 0) {
        console.warn('CSV parsing had minor warnings:', result.errors);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse the custom CSV dataset.');
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className="glass rounded-2xl w-full max-w-lg p-6 space-y-4 relative z-10 border border-[var(--border-color)] animate-[fade-in-up_0.25s_ease-out]"
        style={{ background: 'var(--modal-bg)' }}
      >
        <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="text-base font-black t-text">Upload Custom AI Dataset</h3>
            <p className="text-[10px] t-text-secondary mt-0.5">Inject custom records matching the platform schema in real-time.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-xs font-black cursor-pointer p-1 transition-colors text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Drag and drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            dragActive ? 'border-[var(--accent-indigo)] bg-[var(--selected-bg)]' : 'border-[var(--border-subtle)] hover:border-[var(--accent-indigo)] bg-[var(--surface-bg)]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
          />
          <span className="text-3xl">📤</span>
          <div>
            <p className="text-xs font-bold t-text">Drag & drop your CSV file here, or click to browse</p>
            <p className="text-[9px] t-text-muted mt-1">Requires headers matching the platform schema (name, category, subcategory, overall_rating, etc.)</p>
          </div>
        </div>

        {/* Status Alerts */}
        {parsing && (
          <p className="text-xs t-text-secondary text-center animate-pulse">Parsing and validating dataset headers...</p>
        )}

        {error && (
          <div className="p-3 rounded-lg text-xs font-medium bg-red-950/20 text-rose-450 border border-red-500/25">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg text-xs font-medium bg-emerald-950/20 text-emerald-400 border border-emerald-500/25">
            ✓ {success}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex justify-end gap-2.5 pt-2 border-t border-[var(--border-subtle)]">
          <button
            onClick={onClose}
            className="t-btn-secondary text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
