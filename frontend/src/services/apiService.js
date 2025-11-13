import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.response.use(
  
  (response) => response,

  
  (error) => {
    
    if (error.response && error.response.status === 401) {
      console.error("Authentication Error: Token is expired or invalid. Logging out.");

      
      localStorage.removeItem('app_token');

      
      window.location.href = '/';
      
      
      return Promise.reject(new Error("Token expired. Redirecting to login."));
    }

    
    return Promise.reject(error);
  }
);


export function ingestUrl(url, token = null) {
  return apiClient.post(
    "/ingest-url/", // This endpoint must exist on your backend
    { url },
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
}


export function uploadDocument(file, token = null) {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post("/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }), 
    },
  });
}



export function sendMessage(query, history, documentId, token, language = "auto") {
  return apiClient.post(
    "/chat/",
    {
      query,
      chat_history: history,         
      document_ids: [documentId], 
      language, // 
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
}


