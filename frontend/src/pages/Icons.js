import React from 'react';
import './Icons.css'; 

function Icons() {
  return (
    // Use the same container class for consistent styling
    <div className="icons-page-container">
      
      {/* The main title of the page */}
      <h1 className="page-title">Icons</h1>
      
      {/* The descriptive paragraph */}
      <p className="page-description">
        This page allows you to customize the chatbot's icon and branding.
      </p>

    </div>
  );
}

export default Icons;