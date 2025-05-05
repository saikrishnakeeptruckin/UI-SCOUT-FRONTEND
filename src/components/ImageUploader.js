import React, { useState, useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const { isLoading, handleUpload, uploadError, uploadSuccess, clearUploadStatus } = useContext(AppContext);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    clearUploadStatus(); 
  };

  const onUploadClick = useCallback(() => {
    if (selectedFile) {
      handleUpload(selectedFile).then(() => {
          setSelectedFile(null);
          document.getElementById('fileInput').value = null;
      }).catch(() => {
          console.error('Upload failed');
      });
    }
  }, [selectedFile, handleUpload]);

  return (
    <section className="card">
      <h2>1. Upload Reference/Query Images</h2>
      <div className="centered-form-container">
        <div className="upload-form-group">
          <input
            type="file"
            id="fileInput"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            disabled={isLoading}
            className="file-input"
          />
          <div className="form-button-container">
            <button onClick={onUploadClick} disabled={isLoading || !selectedFile}>
              {isLoading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>
        {uploadError && <p className="error-message center-text">{uploadError}</p>}
        {uploadSuccess && <p className="success-message center-text">{uploadSuccess}</p>}
      </div>
    </section>
  );
}

export default ImageUploader;