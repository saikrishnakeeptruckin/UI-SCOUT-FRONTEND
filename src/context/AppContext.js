import React, { createContext, useState, useCallback, useEffect } from "react";
import {
  uploadImageApi,
  analyzeImageApi,
  listImagesApi,
  getImageDescriptionsApi,
  uploadImageApiAnalyzed,
  analyzeTemporaryImageApi,
  deleteTempImageApi
} from "../api/analysisAPI";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [imageDescriptions, setImageDescriptions] = useState({});
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const fetchUploadedFiles = useCallback(async () => {
    setError("");
    try {
      const responseData = await listImagesApi();
      setUploadedFiles(responseData.files || []);

      try {
        const descriptionsData = await getImageDescriptionsApi();
        if (descriptionsData && descriptionsData.descriptions) {
          setImageDescriptions(descriptionsData.descriptions);
        }
      } catch (descErr) {
        console.warn("Could not fetch image descriptions:", descErr);
      }
    } catch (err) {
      console.error("Error fetching image list:", err);
      setError(`Failed to load image list: ${err.message}`);
      setUploadedFiles([]);
    }
  }, []);

  useEffect(() => {
    fetchUploadedFiles();
  }, [fetchUploadedFiles]);

  const handleUpload = useCallback(async (file, description) => {
    if (!file) {
      setUploadError("No file selected.");
      return;
    }
    setUploadError("");
    setUploadSuccess("");
    setError("");
    setIsLoading(true);

    try {
      const responseData = await uploadImageApi(file, description);
      setUploadSuccess(`Successfully uploaded: ${responseData.filename}`);
      setUploadedFiles((prevFiles) =>
        [...new Set([...prevFiles, responseData.filename])].sort()
      );

      if (description) {
        setImageDescriptions((prev) => ({
          ...prev,
          [responseData.filename]: description,
        }));
      }
    } catch (err) {
      console.error("Upload error in context:", err);
      setUploadError(err.message || "Upload failed.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAnalyze = useCallback(async (filename, prompt) => {
    if (!filename || !prompt) {
      setError("Filename and prompt are required for analysis.");
      return;
    }
    setError("");
    setAnalysisResult(null);
    setIsLoading(true);

    try {
      const responseData = await analyzeImageApi(filename, prompt);
      setAnalysisResult(responseData);

      if (responseData.error) {
        console.error("Backend returned an error:", responseData.error);
        setError(responseData.error);
      } else if (responseData.message) {
        console.info("Backend returned a message:", responseData.message);
      }
    } catch (err) {
      console.error("Analysis API call error in context:", err);
      const errorMsg = err.message || "Analysis failed during API call.";
      setAnalysisResult({ error: errorMsg });
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearUploadStatus = useCallback(() => {
    setUploadError("");
    setUploadSuccess("");
  }, []);

  const clearAnalysisStatus = useCallback(() => {
    setError("");
    setAnalysisResult(null);
  }, []);

  const handleTempAnalyze = useCallback(async (file, prompt) => {
    if (!file || !prompt) {
      setError("File and prompt are required for analysis.");
      return;
    }
    setError("");
    setAnalysisResult(null);
    setIsLoading(true);

    try {
      const responseData = await analyzeTemporaryImageApi(file, prompt);
      setAnalysisResult(responseData);

      if (responseData.error) {
        console.error("Backend returned an error:", responseData.error);
        setError(responseData.error);
      }
    } catch (err) {
      console.error("Analysis API call error:", err);
      const errorMsg = err.message || "Analysis failed during API call.";
      setAnalysisResult({ error: errorMsg });
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUploadAnalyzedFile = useCallback(async (file, description, tempFilename = null) => {
    if (!file) {
      setUploadError("No file selected.");
      return;
    }
    setUploadError("");
    setUploadSuccess("");
    setError("");
    setIsLoading(true);

    try {
      const responseData = await uploadImageApiAnalyzed(file, description, tempFilename);
      setUploadSuccess(`Successfully uploaded: ${responseData.filename}`);
      setUploadedFiles((prevFiles) =>
        [...new Set([...prevFiles, responseData.filename])].sort()
      );

      if (description) {
        setImageDescriptions((prev) => ({
          ...prev,
          [responseData.filename]: description,
        }));
      }
      
      setAnalysisResult(null);
    } catch (err) {
      console.error("Upload error in context:", err);
      setUploadError(err.message || "Upload failed.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const discardTempImage = useCallback(async (tempFilename) => {
    await deleteTempImageApi(tempFilename);
  }, []);

  const contextValue = {
    uploadedFiles,
    imageDescriptions,
    analysisResult,
    isLoading,
    error,
    uploadError,
    uploadSuccess,
    handleUpload,
    handleAnalyze,
    clearUploadStatus,
    clearAnalysisStatus,
    handleTempAnalyze,
    handleUploadAnalyzedFile,
    discardTempImage
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};