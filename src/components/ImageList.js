import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

function ImageList() {
  const { uploadedFiles, error } = useContext(AppContext);
  
  const [previewImage, setPreviewImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';

  const handleImageClick = (filename) => {
    if (previewImage === filename) {
      setPreviewImage(null);
      return;
    }
    
    setPreviewImage(filename);
    
    const img = new Image();
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      });
    };
    img.src = `${API_BASE_URL}/uploads/${filename}`;
  };

  if (error && uploadedFiles.length === 0) {
      return (
          <section className="card">
            <h2>Available Images</h2>
            <p className="error-message">Error loading image list: {error}</p>
          </section>
      )
  }

  return (
    <section className="card image-list-card">
      <h2>Available Images ({uploadedFiles.length})</h2>
      
      {previewImage && (
        <div className={`preview-container ${imageDimensions && imageDimensions.aspectRatio > 2 ? 'wide-image' : ''}`}>
          <div className="preview-box">
            <img 
              src={`${API_BASE_URL}/uploads/${previewImage}`} 
              alt={previewImage}
              className="full-size-preview" 
            />
          </div>
          <button className="close-preview" onClick={() => setPreviewImage(null)}>
            Close Preview
          </button>
        </div>
      )}
      
      {!previewImage && uploadedFiles.length > 0 && (
        <p className="preview-hint">Click on any image to see a larger preview</p>
      )}
      
      {uploadedFiles.length === 0 ? (
        <p>No images uploaded yet. Use the uploader above.</p>
      ) : (
        <div className="image-gallery">
          <div className="image-scroll-container">
            {uploadedFiles.map((filename) => (
              <div 
                key={filename} 
                className={`image-item ${previewImage === filename ? 'selected' : ''}`}
                onClick={() => handleImageClick(filename)}
              >
                <img 
                  src={`${API_BASE_URL}/uploads/${filename}`} 
                  alt={filename} 
                  className="thumbnail-image"
                />
                <div className="image-filename">{filename}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ImageList;