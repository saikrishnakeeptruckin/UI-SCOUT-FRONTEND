import axios from 'axios';

// Use environment variable or default
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';

export const uploadImageApi = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // e.g., { message: '...', filename: '...' }
  } catch (err) {
    // Throw a more specific error message
    throw new Error(err.response?.data?.error || err.message || 'Failed to upload image.');
  }
};

export const analyzeImageApi = async (filename, prompt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-combined`, {
      filename: filename,
      prompt: prompt,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // e.g., { best_match: {...}, ... } or { message: '...', ... } or { error: '...' }
  } catch (err) {
     // Throw a more specific error message from the response if possible
    throw new Error(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to analyze image.');
  }
};

export const analyzeTagsImageApi = async (filename, prompt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-tags`, {
      filename: filename,
      prompt: prompt,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // e.g., { best_match: {...}, ... } or { message: '...', ... } or { error: '...' }
  } catch (err) {
     // Throw a more specific error message from the response if possible
    throw new Error(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to analyze image.');
  }
};

export const listImagesApi = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list-images`);
    // Expecting { files: [...] } from the backend
    return response.data;
  } catch (err) {
     // Throw a more specific error message
    throw new Error(err.response?.data?.error || err.message || 'Failed to fetch image list.');
  }
};

// Optional: Add a function to list images if you implement that endpoint
// export const listImagesApi = async () => { ... };