import React, { useState, useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const { isLoading, handleUpload, uploadError, uploadSuccess, clearUploadStatus } = useContext(AppContext);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    clearUploadStatus(); // Clear previous messages on new selection
  };

  const onUploadClick = useCallback(() => {
    if (selectedFile) {
      handleUpload(selectedFile).then(() => {
         // Only clear selection on successful context handling (optional)
         setSelectedFile(null);
         document.getElementById('fileInput').value = null; // Reset file input visually
      }).catch(() => {
          // Error already handled in context, maybe add specific UI feedback here if needed
      });
    }
  }, [selectedFile, handleUpload]);

  return (
    <section className="card">
      <h2>1. Upload Reference/Query Images</h2>
      <input
        type="file"
        id="fileInput"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <button onClick={onUploadClick} disabled={isLoading || !selectedFile}>
        {isLoading ? 'Uploading...' : 'Upload Image'}
      </button>
      {uploadError && <p className="error-message">Upload Error: {uploadError}</p>}
      {uploadSuccess && <p className="success-message">{uploadSuccess}</p>}
    </section>
  );
}

export default ImageUploader;