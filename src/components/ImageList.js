import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext'; // Import the context

function ImageList() {
  // Consume the context to get the list of uploaded files
  const { uploadedFiles, error } = useContext(AppContext);

  // Optionally display error related to fetching the list
  // This assumes the error state in context might be set by fetchUploadedFiles
  if (error && uploadedFiles.length === 0) {
      return (
          <section className="card">
            <h2>Available Images</h2>
            <p className="error-message">Error loading image list: {error}</p>
          </section>
      )
  }

  return (
    <section className="card image-list-card"> {/* Added a class for potential specific styling */}
      <h2>Available Images ({uploadedFiles.length})</h2>
      {uploadedFiles.length === 0 ? (
        <p>No images uploaded yet. Use the uploader above.</p>
      ) : (
        <ul className="image-list">
          {uploadedFiles.map((filename) => (
            <li key={filename}>{filename}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ImageList;