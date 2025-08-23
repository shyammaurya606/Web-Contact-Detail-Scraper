import React, { useState } from 'react';
import { FaGlobe, FaSpinner } from 'react-icons/fa';
import ContactScraper from './components/ContactScraper';
import ContactDisplay from './components/ContactDisplay';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactData, setContactData] = useState(null);
  const [error, setError] = useState('');

  const validateUrl = (inputUrl) => {
    try {
      new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., example.com or https://example.com)');
      return;
    }

    setIsLoading(true);
    setError('');
    setContactData(null);

    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      const data = await ContactScraper.scrapeWebsite(normalizedUrl);
      setContactData(data);
    } catch (err) {
      setError(err.message || 'Failed to scrape website. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setContactData(null);
    setError('');
    setUrl('');
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-icon">
            <FaGlobe />
          </div>
          <h1>Contact Information Scraper</h1>
          <p>Extract contact details from any website</p>
        </header>

        <div className="scraper-form">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., example.com)"
                className="url-input"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="scrape-button"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Scraping...
                  </>
                ) : (
                  'Extract Contacts'
                )}
              </button>
            </div>
          </form>

          {error && <ErrorMessage message={error} />}
        </div>

        {contactData && (
          <ContactDisplay 
            data={contactData} 
            url={url}
            onClear={clearResults}
          />
        )}

        <footer className="footer">
          <p>
            <strong>Note:</strong> This tool respects website policies and implements rate limiting. 
            Some websites may block scraping attempts for security reasons.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;