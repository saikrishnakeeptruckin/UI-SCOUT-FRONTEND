import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

function ResultsDisplay() {
  const { analysisResult, isLoading, error } = useContext(AppContext);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Analyzing..." />;
    }

    if (error && (!analysisResult || !analysisResult.error)) {
      return <p className="error-message center-text">Error: {error}</p>;
    }

    if (analysisResult) {
      if (analysisResult.error) {
        return <p className="error-message center-text">Analysis Error: {analysisResult.error}</p>;
      }
      if (analysisResult.message) {
        return <p className="center-text">{analysisResult.message}</p>;
      }
      if (analysisResult.name) {
        const summary = analysisResult.summary || "Summary not available.";
        const similarities = analysisResult.similarities || "Similarities not listed.";
        const differences = analysisResult.differences || "Differences not listed.";

        return (
          <div className="best-match-details">
            <h3 className="center-text">Best Match Found:</h3>
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
            
            <div className="analysis-details-container">
              <div className="analysis-section summary-section">
                <h4>Summary</h4>
                <div className="analysis-content">
                  <p>{summary}</p>
                </div>
              </div>
              
              <div className="analysis-section similarities-section">
                <h4>Similarities</h4>
                <div className="analysis-content">
                  {similarities.includes('\n-') || similarities.includes('\n*') ? (
                      <ul className="detail-list">
                          {similarities.split('\n').map((item, index) => 
                            item.trim() && (
                              <li key={index}>{item.trim().replace(/^-|^\*/,'').trim()}</li>
                            )
                          )}
                      </ul>
                  ) : <p>{similarities}</p>}
                </div>
              </div>
              
              <div className="analysis-section differences-section">
                <h4>Differences</h4>
                <div className="analysis-content">
                  {differences.includes('\n-') || differences.includes('\n*') ? (
                      <ul className="detail-list">
                        {differences.split('\n').map((item, index) => 
                          item.trim() && (
                            <li key={index}>{item.trim().replace(/^-|^\*/,'').trim()}</li>
                          )
                        )}
                      </ul>
                  ) : <p>{differences}</p>}
                </div>
              </div>
            </div>
            
            <hr />
            <div className="analysis-metadata center-text">
              <p><em>Input: {analysisResult.input_image}</em></p>
              <p><em>Analysis Duration: {analysisResult.analysis_duration_seconds}s</em></p>
            </div>
          </div>
        );
      }
    }

    if (!isLoading && !analysisResult && !error) {
      return <p className="center-text">Submit an analysis request to see results here.</p>;
    }

    return <p className="error-message center-text">Could not display results due to an unexpected issue.</p>;
  };

  return (
    <section className="card results-section">
      <h2 className="center-text">3. Analysis Results</h2>
      <div className="results-content">
        {renderContent()}
      </div>
    </section>
  );
}

export default ResultsDisplay;