import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';

export const uploadImageApi = async (file, description) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('description', description || '');

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message || 'Failed to upload image.');
  }
};

export const analyzeImageApi = async (filename, prompt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-clip`, {
      filename: filename,
      prompt: prompt,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to analyze image.');
  }
};

export const listImagesApi = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list-images`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message || 'Failed to fetch image list.');
  }
};
export const getImageDescriptionsApi = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/image-descriptions`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message || 'Failed to fetch image descriptions.');
  }
};


export const uploadImageApiAnalyzed = async (file, description, tempFilename = null) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('description', description || '');
  
  if (tempFilename) {
    formData.append('temp_filename', tempFilename);
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/upload-analyzed`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message || 'Failed to upload image.');
  }
};

export const analyzeTemporaryImageApi = async (file, prompt) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('prompt', prompt || '');

  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-temp`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message || 'Failed to analyze image.');
  }
};

export const deleteTempImageApi = async (tempFilename) => {
  if (!tempFilename) return;
  try {
    await axios.delete(`${API_BASE_URL}/temp-delete/${encodeURIComponent(tempFilename)}`);
  } catch (err) {
    console.warn('Temp‑delete failed:', err.response?.data?.error || err.message);
  }
};