import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

function AnalysisForm() {
  const { uploadedFiles, isLoading, handleAnalyze, clearAnalysisStatus } = useContext(AppContext);
  const [queryFilename, setQueryFilename] = useState('');
  const [prompt, setPrompt] = useState('');

  // Clear previous results when form inputs change
  useEffect(() => {
    clearAnalysisStatus();
  }, [queryFilename, prompt, clearAnalysisStatus]);


  const onAnalyzeClick = () => {
    if (queryFilename && prompt.trim()) {
      handleAnalyze(queryFilename, prompt.trim());
    }
  };

  // Reset selection if the selected file is somehow removed (e.g., future delete feature)
  useEffect(() => {
    if (queryFilename && !uploadedFiles.includes(queryFilename)) {
        setQueryFilename('');
    }
  }, [uploadedFiles, queryFilename]);


  if (uploadedFiles.length === 0) {
      return (
        <section className="card">
            <h2>2. Analyze for Best Match</h2>
            <p>Upload some images first to enable analysis.</p>
        </section>
      );
  }

  return (
    <section className="card">
      <h2>2. Analyze for Best Match</h2>
      <div className="form-group">
        <label htmlFor="queryImageSelect">Select Query Image:</label>
        <select
          id="queryImageSelect"
          value={queryFilename}
          onChange={(e) => setQueryFilename(e.target.value)}
          disabled={isLoading}
        >
          <option value="">-- Select an uploaded image --</option>
          {uploadedFiles.map(filename => (
            <option key={filename} value={filename}>{filename}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="promptInput">Enter Prompt:</label>
        <input
          type="text"
          id="promptInput"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Find similar login forms"
          disabled={isLoading}
        />
      </div>

      <button onClick={onAnalyzeClick} disabled={isLoading || !queryFilename || !prompt.trim()}>
        {isLoading ? 'Analyzing...' : 'Analyze & Find Best Match'}
      </button>
    </section>
  );
}

export default AnalysisForm;