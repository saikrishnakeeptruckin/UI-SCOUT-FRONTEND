import React from 'react';
import './LoadingSpinner.css'; // Create this CSS file

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;