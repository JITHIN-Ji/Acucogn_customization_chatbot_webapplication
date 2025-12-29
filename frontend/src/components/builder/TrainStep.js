import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { ingestUrl } from '../../services/apiService';


// It just focuses on training.
function TrainStep({ config, updateConfig, token }) {
  const [activeTab, setActiveTab] = useState('website');
  const [url, setUrl] = useState('https://example.com');
  const [isIngesting, setIsIngesting] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState(null);

  const handleUploadSuccess = (data) => {
    const msg = `Successfully trained with '${data.filename}'.`;
    setTrainingStatus({ type: 'success', message: msg });
    updateConfig('documentId', data.document_id);
  };

  const handleUploadError = (errMsg) => {
    const msg = `Error: ${errMsg}`;
    setTrainingStatus({ type: 'error', message: msg });
  };

  const handleUrlIngest = async () => {
    if (!url) return;
    setIsIngesting(true);
    setTrainingStatus({ type: 'info', message: 'Ingesting content from URL...' });
    try {
      const res = await ingestUrl(url, token);
      handleUploadSuccess(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to ingest from URL.";
      handleUploadError(msg);
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="form-step">
      <h2>Chatbot Training</h2>
      <p>Provide the knowledge for your chatbot. After training, save the bot to generate your embed code.</p>

      <div className="training-tabs">
        <button className={activeTab === 'website' ? 'active' : ''} onClick={() => setActiveTab('website')}>Website</button>
        <button className={activeTab === 'pdf' ? 'active' : ''} onClick={() => setActiveTab('pdf')}>PDF</button>
        <button className={activeTab === 'text' ? 'active' : ''} onClick={() => setActiveTab('text')}>Text</button>
      </div>

      <div className="training-content">
        {activeTab === 'website' && (
          <div className="form-group">
            <label htmlFor="url">Add URL</label>
            <div className="url-input-group">
              <input type="text" id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
              <button onClick={handleUrlIngest} disabled={isIngesting}>{isIngesting ? 'Fetching...' : 'Fetch'}</button>
            </div>
          </div>
        )}
        {activeTab === 'pdf' && (
           <FileUpload onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} token={token} />
        )}
        {activeTab === 'text' && <p>Text and Q&A training coming soon!</p>}
        {trainingStatus && (<div className={`training-status ${trainingStatus.type}`}>{trainingStatus.message}</div>)}
      </div>
      
      
      {/* --- This is the new instructional text --- */}
      {!config.documentId && (
          <div className="instruction-box">
              <p>Please train with a document or URL to continue.</p>
          </div>
      )}
    </div>
  );
}

export default TrainStep;