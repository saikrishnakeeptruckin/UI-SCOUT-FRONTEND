import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";

function ResultsDisplay() {
  const { analysisResult, isLoading, error } = useContext(AppContext);

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Analyzing..." />;
    }

    if (error && (!analysisResult || !analysisResult.error)) {
      return <p className="error-message center-text">Error: {error}</p>;
    }

    if (analysisResult) {
      if (analysisResult.error) {
        return (
          <p className="error-message center-text">
            Analysis Error: {analysisResult.error}
          </p>
        );
      }
      if (analysisResult.message) {
        return <p className="center-text">{analysisResult.message}</p>;
      }
      if (analysisResult.name) {
        // Handle arrays or strings for similarities and differences
        const summary = analysisResult.summary || "Summary not available.";

        let similarities =
          analysisResult.similarities || "Similarities not listed.";
        if (Array.isArray(similarities)) {
          similarities = similarities.join("\n");
        }

        let differences =
          analysisResult.differences || "Differences not listed.";
        if (Array.isArray(differences)) {
          differences = differences.join("\n");
        }

        const queryImageUrl = analysisResult.temp_filename
          ? `${API_BASE_URL}/temp-uploads/${analysisResult.temp_filename}`
          : `${API_BASE_URL}/uploads/${analysisResult.input_image}`;

        return (
          <div className="best-match-details">
            <h3 className="center-text">Best Match Found:</h3>

            <div className="images-comparison-container">
              <div className="comparison-image-box">
                <h4>Query Image</h4>
                <div className="image-container">
                  <img
                    src={queryImageUrl}
                    alt={`Query: ${
                      analysisResult.original_filename ||
                      analysisResult.input_image
                    }`}
                    className="comparison-image"
                  />
                </div>
                <p className="image-filename">
                  {analysisResult.original_filename ||
                    analysisResult.input_image}
                </p>
              </div>

              <div className="comparison-image-box">
                <h4>Best Match</h4>
                <div className="image-container">
                  <img
                    src={analysisResult.imageUrl}
                    alt={`Best match: ${analysisResult.name}`}
                    className="comparison-image"
                  />
                </div>
                <p className="image-filename">{analysisResult.name}</p>
                <p className="score-badge">
                  Score: {analysisResult.score?.toFixed(2) ?? "N/A"}
                </p>
              </div>
            </div>

            <div className="analysis-details-container">
              <div className="analysis-section similarities-section">
                <h4>Image Details</h4>
                {analysisResult.description && (
                  <p>
                    <strong>Description:</strong> {analysisResult.description}
                  </p>
                )}
              </div>

              <div className="analysis-section summary-section">
                <h4>Summary</h4>
                <div className="analysis-content">
                  <p>{summary}</p>
                </div>
              </div>

              <div className="analysis-section similarities-section">
                <h4>Similarities</h4>
                <div className="analysis-content">
                  {similarities.includes("\n-") ||
                  similarities.includes("\n*") ? (
                    <ul className="detail-list">
                      {similarities.split("\n").map(
                        (item, index) =>
                          item.trim() && (
                            <li key={index}>
                              {item
                                .trim()
                                .replace(/^-|^\*/, "")
                                .trim()}
                            </li>
                          )
                      )}
                    </ul>
                  ) : (
                    <p>{similarities}</p>
                  )}
                </div>
              </div>

              <div className="analysis-section differences-section">
                <h4>Differences</h4>
                <div className="analysis-content">
                  {differences.includes("\n-") ||
                  differences.includes("\n*") ? (
                    <ul className="detail-list">
                      {differences.split("\n").map(
                        (item, index) =>
                          item.trim() && (
                            <li key={index}>
                              {item
                                .trim()
                                .replace(/^-|^\*/, "")
                                .trim()}
                            </li>
                          )
                      )}
                    </ul>
                  ) : (
                    <p>{differences}</p>
                  )}
                </div>
              </div>
            </div>

            <hr />
            <div className="analysis-metadata center-text">
              <p>
                <em>
                  Input:{" "}
                  {analysisResult.original_filename ||
                    analysisResult.input_image}
                </em>
                {analysisResult.temp_filename && <span> (temporary)</span>}
              </p>
              {analysisResult.analysis_method && (
                <p>
                  <em>Method: {analysisResult.analysis_method}</em>
                </p>
              )}
              {analysisResult.analysis_duration_seconds !== undefined && (
                <p>
                  <em>
                    Time taken: {analysisResult.analysis_duration_seconds}
                    &nbsp;sec
                  </em>
                </p>
              )}
            </div>
          </div>
        );
      }
    }

    if (!isLoading && !analysisResult && !error) {
      return (
        <p className="center-text">
          Submit an analysis request to see results here.
        </p>
      );
    }

    return (
      <p className="error-message center-text">
        Could not display results due to an unexpected issue.
      </p>
    );
  };

  return (
    <section className="card results-section">
      <h2 className="center-text">Analysis Results</h2>
      <div className="results-content">{renderContent()}</div>
    </section>
  );
}

export default ResultsDisplay;
