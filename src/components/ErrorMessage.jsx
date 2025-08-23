import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import './ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <div className="error-icon">
        <FaExclamationTriangle />
      </div>
      <div className="error-content">
        <h4>Error</h4>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;