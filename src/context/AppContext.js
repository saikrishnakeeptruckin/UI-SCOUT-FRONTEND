import React, { createContext, useState, useCallback, useEffect } from 'react';
import { uploadImageApi, analyzeImageApi, listImagesApi } from '../api/analysisAPI'; // We'll create this file next

// Create the context
export const AppContext = createContext();

// Create the Provider component
export const AppProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // General/Analysis errors
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const fetchUploadedFiles = useCallback(async () => {
    // Optionally set loading state if you want visual feedback for list refresh
    // setIsLoading(true); // Uncomment if loading state needed for list fetch
    setError(''); // Clear previous general errors
    try {
        const responseData = await listImagesApi();
        setUploadedFiles(responseData.files || []); // Update state with fetched list
        console.log("Fetched image list:", responseData.files);
    } catch (err) {
        console.error("Error fetching image list:", err);
        setError(`Failed to load image list: ${err.message}`); // Set error state
        setUploadedFiles([]); // Clear list on error
    } finally {
        // setIsLoading(false); // Uncomment if loading state needed for list fetch
    }
}, []); // Empty dependency array means this function is memoized


  // --- Add this useEffect to fetch the list on initial mount ---
  useEffect(() => {
    fetchUploadedFiles();
}, [fetchUploadedFiles]); // Dependency array includes the memoized function

 // Modify handleUpload to optionally refresh list OR rely on manual addition + initial fetch
 const handleUpload = useCallback(async (file) => {
  if (!file) {
    setUploadError('No file selected.');
    return;
  }
  setUploadError('');
  setUploadSuccess('');
  setError('');
  setIsLoading(true);

  try {
    const responseData = await uploadImageApi(file);
    setUploadSuccess(`Successfully uploaded: ${responseData.filename}`);
    // OPTION 1 (Current): Manually add for instant feedback (relies on initial fetch for full sync)
    setUploadedFiles(prevFiles => [...new Set([...prevFiles, responseData.filename])].sort());

    // OPTION 2: Refresh list from backend after upload (more robust, slight delay)
    // await fetchUploadedFiles(); // Uncomment this line and remove the line above for Option 2

  } catch (err) {
    console.error("Upload error in context:", err);
    setUploadError(err.message || 'Upload failed.');
  } finally {
    setIsLoading(false);
  }
}, [fetchUploadedFiles]); // Add fetchUploadedFiles to dependency if using Option 2

  // Modify the handleAnalyze function (only the success part changes)
const handleAnalyze = useCallback(async (filename, prompt) => {
  if (!filename || !prompt) {
    setError('Filename and prompt are required for analysis.');
    return;
  }
  setError('');
  setAnalysisResult(null);
  setIsLoading(true);

  try {
    const responseData = await analyzeImageApi(filename, prompt);
    // analysisResult now directly holds the single best match object OR an error/message object
    setAnalysisResult(responseData);
    console.log("Analysis Response in Context:", responseData);

    // Check if the response itself indicates a backend-handled error or message
    if (responseData.error) {
        console.error("Backend returned an error:", responseData.error);
        setError(responseData.error); // Set context error state as well
    } else if (responseData.message) {
         console.info("Backend returned a message:", responseData.message);
         // Keep message in analysisResult, don't set top-level error
    }

  } catch (err) {
    console.error("Analysis API call error in context:", err);
    const errorMsg = err.message || 'Analysis failed during API call.';
    // Store error structure consistent with backend error format
    setAnalysisResult({ error: errorMsg });
    setError(errorMsg); // Also set top-level error
  } finally {
    setIsLoading(false);
  }
}, []); // Empty dependency array

  // Clear errors/success messages
  const clearUploadStatus = useCallback(() => {
      setUploadError('');
      setUploadSuccess('');
  }, []);

  const clearAnalysisStatus = useCallback(() => {
      setError('');
      setAnalysisResult(null);
  }, []);

 // Context value now provides the fetched list implicitly via uploadedFiles state
 const contextValue = {
  uploadedFiles, // This list is now populated by fetchUploadedFiles
  analysisResult,
  isLoading,
  error, // General error now includes list fetch errors
  uploadError,
  uploadSuccess,
  handleUpload,
  handleAnalyze,
  clearUploadStatus,
  clearAnalysisStatus,
  // fetchUploadedFiles, // Optionally expose if manual refresh is needed
};

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};