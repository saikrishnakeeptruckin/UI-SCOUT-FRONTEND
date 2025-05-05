// src/components/ResultsDisplay.js (Updated rendering logic)

import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

function ResultsDisplay() {
  const { analysisResult, isLoading, error } = useContext(AppContext);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Analyzing..." />;
    }

    // Handle top-level context errors (e.g., API call failed network-wise)
    // Only show if analysisResult isn't set or doesn't have its own error
    if (error && (!analysisResult || !analysisResult.error)) {
        return <p className="error-message">Error: {error}</p>;
    }

    // Handle results received from the backend
    if (analysisResult) {
      // Check for backend-specific error first
      if (analysisResult.error) {
        return <p className="error-message">Analysis Error: {analysisResult.error}</p>;
      }
      // Check for backend messages (e.g., "No images found")
      if (analysisResult.message) {
        return <p>{analysisResult.message}</p>;
      }
      // --- Render the successful best match ---
      if (analysisResult.name) { // Check for a key field from the expected success structure
         // Basic check for potentially missing details from parsing
         const summary = analysisResult.summary || "Summary not available.";
         const similarities = analysisResult.similarities || "Similarities not listed.";
         const differences = analysisResult.differences || "Differences not listed.";

         return (
            <div className="best-match-details">
              <h3>Best Match Found:</h3>
              <div className="match-header">
                <p><strong>Image:</strong> {analysisResult.name}</p>
                <p><strong>Score:</strong> {analysisResult.score?.toFixed(2) ?? 'N/A'}</p>
              </div>
              {analysisResult.imageUrl && (
                <div className="match-image-container">
                    <img
                        src={analysisResult.imageUrl}
                        alt={`Best match: ${analysisResult.name}`}
                        className="match-image"
                     />
                </div>
              )}
              <div className="match-text">
                <h4>Summary:</h4>
                <p>{summary}</p>
                <h4>Similarities:</h4>
                {/* Render as list if contains typical list markers */}
                {similarities.includes('\n-') || similarities.includes('\n*') ? (
                    <ul className="detail-list">
                        {similarities.split('\n').map((item, index) => item.trim() && <li key={index}>{item.trim().replace(/^-|^\*/,'').trim()}</li>)}
                    </ul>
                ) : <p>{similarities}</p>}

                <h4>Differences:</h4>
                {differences.includes('\n-') || differences.includes('\n*') ? (
                     <ul className="detail-list">
                        {differences.split('\n').map((item, index) => item.trim() && <li key={index}>{item.trim().replace(/^-|^\*/,'').trim()}</li>)}
                    </ul>
                ) : <p>{differences}</p>}
              </div>
              <hr />
              <p><em>(Input: {analysisResult.input_image}, Prompt: "{analysisResult.prompt}")</em></p>
              <p><em>(Analysis Duration: {analysisResult.analysis_duration_seconds}s)</em></p>
            </div>
          );
      }
    }

    // Default placeholder if idle and no result/error yet
    if (!isLoading && !analysisResult && !error) {
      return <p>Submit an analysis request to see results here.</p>;
    }

    // Fallback for unexpected state
    return <p className="error-message">Could not display results due to an unexpected issue.</p>;
  };

  return (
    <section className="card results-section">
      <h2>3. Analysis Results</h2>
      <div className="results-content">
        {renderContent()}
      </div>
    </section>
  );
}

export default ResultsDisplay;