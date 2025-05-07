import React, { useState, useContext, useCallback, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageDescription, setImageDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [tempFilename, setTempFilename] = useState('');
  
  const { 
    isLoading, 
    handleUploadAnalyzedFile, 
    handleTempAnalyze,
    analysisResult,
    uploadError, 
    uploadSuccess, 
    clearUploadStatus, 
    clearAnalysisStatus,
    discardTempImage
  } = useContext(AppContext);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    clearUploadStatus();
    clearAnalysisStatus();
    setShowUploadForm(false);
  };

  const onAnalyzeClick = useCallback(() => {
    if (selectedFile && prompt.trim()) {
      handleTempAnalyze(selectedFile, prompt.trim())
        .catch((err) => {
          console.error('Analysis failed:', err?.message || 'Unknown error');
        });
    }
  }, [selectedFile, prompt, handleTempAnalyze]);

  const onUploadClick = useCallback(() => {
    if (selectedFile && imageDescription.trim() && tempFilename) {
      handleUploadAnalyzedFile(selectedFile, imageDescription.trim(), tempFilename)
        .then(() => {
          setShowUploadForm(false);
          setSelectedFile(null);
          setImageDescription('');
          setPrompt('');
          setTempFilename('');
          if (document.getElementById('fileInput')) {
            document.getElementById('fileInput').value = null;
          }
        })
        .catch(() => {
          console.error('Upload failed');
        });
    }
  }, [selectedFile, imageDescription, tempFilename, handleUploadAnalyzedFile]);

  useEffect(() => {
    if (selectedFile) {
      clearAnalysisStatus();
    }
  }, [selectedFile, clearAnalysisStatus]);

  useEffect(() => {
    if (analysisResult?.temp_filename) {
      setTempFilename(analysisResult.temp_filename);
    }
  }, [analysisResult]);

  return (
    <section className="card">
      <h2>Analyze & Upload</h2>
      <div className="centered-form-container">
        {!analysisResult ? (
          <>
            <div className="form-group">
              <label htmlFor="fileInput">Select Image:</label>
              <input
                type="file"
                id="fileInput"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                disabled={isLoading}
                className="file-input"
              />
            </div>

            {selectedFile && (
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
            )}

            <div className="form-button-container">
              <button 
                onClick={onAnalyzeClick} 
                disabled={isLoading || !selectedFile || !prompt.trim()}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Image'}
              </button>
            </div>
          </>
        ) : (
          <>
            {!showUploadForm ? (
              <div className="form-button-container">
                <button 
                  onClick={() => setShowUploadForm(true)}
                  className="secondary-button"
                >
                  Add This Image To Database
                </button>
                <button 
                  onClick={async () => {
                    await discardTempImage(tempFilename);
                    clearAnalysisStatus();
                    setSelectedFile(null);
                    setPrompt('');
                    if (document.getElementById('fileInput')) {
                      document.getElementById('fileInput').value = null;
                    }
                  }}
                  className="secondary-button"
                >
                  Try Another Image
                </button>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="imageDescription">Image Description (required):</label>
                  <textarea
                    id="imageDescription"
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    placeholder="Enter detailed description of this image..."
                    rows={4}
                    disabled={isLoading}
                    className="form-textarea"
                  />
                </div>
                
                <div className="form-button-container">
                  <button 
                    onClick={onUploadClick} 
                    disabled={isLoading || !imageDescription.trim()}
                  >
                    {isLoading ? 'Uploading...' : 'Save To Database'}
                  </button>
                  <button 
                    onClick={() => setShowUploadForm(false)}
                    className="secondary-button"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </>
        )}
        
        {uploadError && <p className="error-message center-text">{uploadError}</p>}
        {uploadSuccess && <p className="success-message center-text">{uploadSuccess}</p>}

        {isLoading && <LoadingSpinner message={showUploadForm ? "Uploading..." : "Analyzing..."} />}
      </div>
    </section>
  );
}

export default ImageUploader;

// ORIGINAL APPROACH
// import React, { useState, useContext, useCallback, useEffect } from 'react';
// import { AppContext } from '../context/AppContext';
// import LoadingSpinner from './LoadingSpinner';

// function ImageUploader() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imageDescription, setImageDescription] = useState('');
//   const [prompt, setPrompt] = useState('');
//   const [showAnalysisForm, setShowAnalysisForm] = useState(false);
//   const [queryFilename, setQueryFilename] = useState('');
  
//   const { 
//     uploadedFiles, 
//     isLoading, 
//     handleUpload, 
//     handleAnalyze,
//     uploadError, 
//     uploadSuccess, 
//     clearUploadStatus, 
//   } = useContext(AppContext);

//   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     clearUploadStatus();
//     setShowAnalysisForm(false);
//   };

//   const onUploadClick = useCallback(() => {
//     if (selectedFile && imageDescription.trim()) {
//       handleUpload(selectedFile, imageDescription.trim()).then(() => {
//         setQueryFilename('');
//         setShowAnalysisForm(true);
//       }).catch(() => {
//         console.error('Upload failed');
//       });
//     }
//   }, [selectedFile, imageDescription, handleUpload]);

//   // When upload succeeds, automatically set the queryFilename to the just uploaded file
//   useEffect(() => {
//     if (uploadSuccess && selectedFile) {
//       // Extract filename from success message
//       const filenameMatch = uploadSuccess.match(/Successfully uploaded: (.+)/);
//       if (filenameMatch && filenameMatch[1]) {
//         setQueryFilename(filenameMatch[1]);
//       }
//     }
//   }, [uploadSuccess, selectedFile]);

//   const onAnalyzeClick = () => {
//     if (queryFilename && prompt.trim()) {
//       // Don't reset form fields or hide the form until we know analysis succeeded
//       handleAnalyze(queryFilename, prompt.trim())
//         .then(() => {
//           setSelectedFile(null);
//           setImageDescription('');
//           setPrompt('');
//           setShowAnalysisForm(false);
//           clearUploadStatus();
//           if (document.getElementById('fileInput')) {
//             document.getElementById('fileInput').value = null;
//           }
//         })
//         .catch((err) => {
//           console.error('Analysis failed:', err?.message || 'Unknown error');
//         });
//     }
//   };

//   return (
//     <section className="card">
//       <h2>Upload & Analyze</h2>
//       <div className="centered-form-container">
//         {!showAnalysisForm ? (
//           <>
//             <div className="form-group">
//               <label htmlFor="fileInput">Select Image:</label>
//               <input
//                 type="file"
//                 id="fileInput"
//                 accept="image/png, image/jpeg"
//                 onChange={handleFileChange}
//                 disabled={isLoading}
//                 className="file-input"
//               />
//             </div>

//             {selectedFile && (
//               <div className="form-group">
//                 <label htmlFor="imageDescription">Image Description (required):</label>
//                 <textarea
//                   id="imageDescription"
//                   value={imageDescription}
//                   onChange={(e) => setImageDescription(e.target.value)}
//                   placeholder="Enter detailed description of this image..."
//                   rows={4}
//                   disabled={isLoading}
//                   className="form-textarea"
//                 />
//               </div>
//             )}

//             <div className="form-button-container">
//               <button 
//                 onClick={onUploadClick} 
//                 disabled={isLoading || !selectedFile || !imageDescription.trim()}
//               >
//                 {isLoading ? 'Uploading...' : 'Upload Image'}
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="form-group">
//               <label htmlFor="queryImageSelect">Selected Image:</label>
//               <select
//                 id="queryImageSelect"
//                 value={queryFilename}
//                 onChange={(e) => setQueryFilename(e.target.value)}
//                 disabled={isLoading}
//               >
//                 <option value="">-- Select an image --</option>
//                 {uploadedFiles.map(filename => (
//                   <option key={filename} value={filename}>{filename}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Display the selected image */}
//             {queryFilename && (
//               <div className="selected-image-container">
//                 <h4>Selected Image:</h4>
//                 <div className="selected-image-wrapper">
//                   <img
//                     src={`${API_BASE_URL}/uploads/${queryFilename}`}
//                     alt={`Selected: ${queryFilename}`}
//                     className="selected-query-image"
//                   />
//                   <div className="selected-image-filename">{queryFilename}</div>
//                 </div>
//               </div>
//             )}

//             <div className="form-group">
//               <label htmlFor="promptInput">Enter Prompt:</label>
//               <input
//                 type="text"
//                 id="promptInput"
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 placeholder="e.g., Find similar login forms"
//                 disabled={isLoading}
//               />
//             </div>

//             <div className="form-button-container">
//               <button onClick={onAnalyzeClick} disabled={isLoading || !queryFilename || !prompt.trim()}>
//                 {isLoading ? 'Analyzing...' : 'Analyze & Find Best Match'}
//               </button>
//               <button 
//                 className="secondary-button" 
//                 onClick={() => {
//                   setShowAnalysisForm(false);
//                   setSelectedFile(null);
//                   setImageDescription('');
//                   setPrompt('');
//                   setQueryFilename('');
//                   clearUploadStatus();
//                 }}
//                 disabled={isLoading}
//               >
//                 Upload Another Image
//               </button>
//             </div>
//           </>
//         )}
        
//         {uploadError && <p className="error-message center-text">{uploadError}</p>}
//         {uploadSuccess && <p className="success-message center-text">{uploadSuccess}</p>}

//         {isLoading && <LoadingSpinner message={showAnalysisForm ? "Analyzing..." : "Uploading..."} />}
//       </div>
//     </section>
//   );
// }

// export default ImageUploader;