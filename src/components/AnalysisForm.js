import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

function AnalysisForm() {
  const { uploadedFiles, isLoading, handleAnalyze, clearAnalysisStatus } = useContext(AppContext);
  const [queryFilename, setQueryFilename] = useState('');
  const [prompt, setPrompt] = useState('');
  
  // Base URL for images
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    clearAnalysisStatus();
  }, [queryFilename, prompt, clearAnalysisStatus]);

  const onAnalyzeClick = () => {
    if (queryFilename && prompt.trim()) {
      handleAnalyze(queryFilename, prompt.trim());
    }
  };

  useEffect(() => {
    if (queryFilename && !uploadedFiles.includes(queryFilename)) {
        setQueryFilename('');
    }
  }, [uploadedFiles, queryFilename]);

  if (uploadedFiles.length === 0) {
      return (
        <section className="card">
            <h2>2. Analyze for Best Match</h2>
            <p className="center-text">Upload some images first to enable analysis.</p>
        </section>
      );
  }

  return (
    <section className="card">
      <h2>2. Analyze for Best Match</h2>
      
      <div className="centered-form-container">
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

        {/* Display the selected image */}
        {queryFilename && (
          <div className="selected-image-container">
            <h4>Selected Query Image:</h4>
            <div className="selected-image-wrapper">
              <img
                src={`${API_BASE_URL}/uploads/${queryFilename}`}
                alt={`Selected: ${queryFilename}`}
                className="selected-query-image"
              />
              <div className="selected-image-filename">{queryFilename}</div>
            </div>
          </div>
        )}

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

        <div className="form-button-container">
          <button onClick={onAnalyzeClick} disabled={isLoading || !queryFilename || !prompt.trim()}>
            {isLoading ? 'Analyzing...' : 'Analyze & Find Best Match'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AnalysisForm;