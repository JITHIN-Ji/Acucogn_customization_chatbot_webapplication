import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://normal-globally-gannet.ngrok-free.app";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
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
    "/ingest-url/",
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



export function sendMessage(query, history, id, token, type = 'document', system_prompt = null) {
  
  let payload = {
    query,
    chat_history: history,
  };

  
  let endpoint = "/chat/"; 

  if (type === 'document') {
    
    payload.document_ids = [id];
    payload.system_prompt = system_prompt;
  } else if (type === 'chatbot') {
    // This is for a saved chatbot.
    payload.chatbot_id = id;
    
    
    if (token === null) {
      endpoint = "/chat/public";
    }
  }

  
  return apiClient.post(endpoint, payload, {
    headers: {
      
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}


export function uploadIcon(file, token) {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient.post("/upload-icon", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
}


export function getChatbots(token) {
  return apiClient.get("/chatbots/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function saveChatbot(config, token) {
  return apiClient.post("/chatbots/", config, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getPublicChatbotConfig(chatbotId) {
  return apiClient.get(`/chatbots/${chatbotId}/public`);
}
