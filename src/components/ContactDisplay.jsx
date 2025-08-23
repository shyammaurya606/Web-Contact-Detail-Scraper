import React, { useState } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaShareAlt, 
  FaWpforms,
  FaCopy,
  FaCheck,
  FaTimes,
  FaExternalLinkAlt,
  FaClock,
  FaGlobe,
  FaDownload
} from 'react-icons/fa';
import './ContactDisplay.css';

const ContactDisplay = ({ data, url, onClear }) => {
  const [copiedItem, setCopiedItem] = useState(null);

  const copyToClipboard = (text, itemId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    });
  };

  const openUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const downloadData = (format) => {
    let content, filename, mimeType;
    
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = `contacts-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    } else if (format === 'csv') {
      content = generateCSV(data);
      filename = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSV = (data) => {
    const rows = [];
    rows.push(['Type', 'Value', 'Context/Platform', 'Additional Info']);
    
    // Add emails
    data.emails.forEach(email => {
      rows.push(['Email', email.value, email.context, '']);
    });
    
    // Add phones
    data.phones.forEach(phone => {
      rows.push(['Phone', phone.value, phone.formatted || '', '']);
    });
    
    // Add addresses
    data.addresses.forEach(address => {
      rows.push(['Address', address.value, address.context, '']);
    });
    
    // Add social media
    data.socialMedia.forEach(social => {
      rows.push(['Social Media', social.url, social.platform, social.username]);
    });
    
    // Add contact forms
    data.contactForms.forEach((form, index) => {
      const features = [];
      if (form.hasEmail) features.push('Email');
      if (form.hasPhone) features.push('Phone');
      if (form.hasMessage) features.push('Message');
      rows.push(['Contact Form', form.url, form.method, features.join(', ')]);
    });
    
    return rows.map(row => 
      row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  };
  const formatScrapingTime = (time) => {
    return time > 1000 ? `${(time / 1000).toFixed(1)}s` : `${time}ms`;
  };

  const getSocialIcon = (platform) => {
    const icons = {
      'Facebook': '📘',
      'Twitter': '🐦',
      'Instagram': '📷',
      'Linkedin': '💼',
      'Youtube': '📺',
      'Tiktok': '🎵'
    };
    return icons[platform] || '🔗';
  };

  if (!data) return null;

  return (
    <div className="contact-display">
      <div className="results-header">
        <div className="results-info">
          <div className="results-title">
            <FaGlobe className="globe-icon" />
            <h2>Contact Information Found</h2>
          </div>
          <div className="results-meta">
            <span className="scraped-url">{url}</span>
            <div className="scraping-stats">
              <FaClock className="clock-icon" />
              <span>Scraped in {formatScrapingTime(data.scrapingTime)}</span>
              <span className="divider">•</span>
              <span className="total-found">{data.totalContactsFound} contacts found</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <div className="download-buttons">
            <button onClick={() => downloadData('json')} className="download-button json">
              <FaDownload />
              JSON
            </button>
            <button onClick={() => downloadData('csv')} className="download-button csv">
              <FaDownload />
              CSV
            </button>
          </div>
          <button onClick={onClear} className="clear-button">
            <FaTimes />
            Clear Results
          </button>
        </div>
      </div>

      <div className="contact-grid">
        {/* Emails Section */}
        <div className="contact-section">
          <div className="section-header">
            <FaEnvelope className="section-icon" />
            <h3>Email Addresses</h3>
            <span className="count-badge">{data.emails.length}</span>
          </div>
          <div className="contact-items">
            {data.emails.length > 0 ? (
              data.emails.map((email, index) => (
                <div key={index} className="contact-item">
                  <div className="item-content">
                    <span className="item-value">{email.value}</span>
                    <span className="item-context">{email.context}</span>
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => copyToClipboard(email.value, `email-${index}`)}
                      className="action-button"
                      title="Copy email"
                    >
                      {copiedItem === `email-${index}` ? <FaCheck /> : <FaCopy />}
                    </button>
                    <button
                      onClick={() => openUrl(`mailto:${email.value}`)}
                      className="action-button"
                      title="Send email"
                    >
                      <FaExternalLinkAlt />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No email addresses found</div>
            )}
          </div>
        </div>

        {/* Phone Numbers Section */}
        <div className="contact-section">
          <div className="section-header">
            <FaPhone className="section-icon" />
            <h3>Phone Numbers</h3>
            <span className="count-badge">{data.phones.length}</span>
          </div>
          <div className="contact-items">
            {data.phones.length > 0 ? (
              data.phones.map((phone, index) => (
                <div key={index} className="contact-item">
                  <div className="item-content">
                    <span className="item-value">{phone.formatted || phone.value}</span>
                    {phone.type && <span className="item-context">{phone.type}</span>}
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => copyToClipboard(phone.value, `phone-${index}`)}
                      className="action-button"
                      title="Copy phone"
                    >
                      {copiedItem === `phone-${index}` ? <FaCheck /> : <FaCopy />}
                    </button>
                    <button
                      onClick={() => openUrl(`tel:${phone.value}`)}
                      className="action-button"
                      title="Call number"
                    >
                      <FaExternalLinkAlt />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No phone numbers found</div>
            )}
          </div>
        </div>

        {/* Addresses Section */}
        <div className="contact-section">
          <div className="section-header">
            <FaMapMarkerAlt className="section-icon" />
            <h3>Physical Addresses</h3>
            <span className="count-badge">{data.addresses.length}</span>
          </div>
          <div className="contact-items">
            {data.addresses.length > 0 ? (
              data.addresses.map((address, index) => (
                <div key={index} className="contact-item">
                  <div className="item-content">
                    <span className="item-value">{address.value}</span>
                    <span className="item-context">{address.context}</span>
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => copyToClipboard(address.value, `address-${index}`)}
                      className="action-button"
                      title="Copy address"
                    >
                      {copiedItem === `address-${index}` ? <FaCheck /> : <FaCopy />}
                    </button>
                    <button
                      onClick={() => openUrl(`https://maps.google.com/?q=${encodeURIComponent(address.value)}`)}
                      className="action-button"
                      title="View on map"
                    >
                      <FaExternalLinkAlt />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No addresses found</div>
            )}
          </div>
        </div>

        {/* Social Media Section */}
        <div className="contact-section">
          <div className="section-header">
            <FaShareAlt className="section-icon" />
            <h3>Social Media</h3>
            <span className="count-badge">{data.socialMedia.length}</span>
          </div>
          <div className="contact-items">
            {data.socialMedia.length > 0 ? (
              data.socialMedia.map((social, index) => (
                <div key={index} className="contact-item">
                  <div className="item-content">
                    <div className="social-info">
                      <span className="social-icon">{getSocialIcon(social.platform)}</span>
                      <div>
                        <span className="item-value">{social.platform}</span>
                        <span className="item-context">@{social.username}</span>
                      </div>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => copyToClipboard(social.url, `social-${index}`)}
                      className="action-button"
                      title="Copy URL"
                    >
                      {copiedItem === `social-${index}` ? <FaCheck /> : <FaCopy />}
                    </button>
                    <button
                      onClick={() => openUrl(social.url)}
                      className="action-button"
                      title="Visit profile"
                    >
                      <FaExternalLinkAlt />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No social media profiles found</div>
            )}
          </div>
        </div>

        {/* Contact Forms Section */}
        <div className="contact-section full-width">
          <div className="section-header">
            <FaWpforms className="section-icon" />
            <h3>Contact Forms</h3>
            <span className="count-badge">{data.contactForms.length}</span>
          </div>
          <div className="contact-items">
            {data.contactForms.length > 0 ? (
              data.contactForms.map((form, index) => (
                <div key={index} className="contact-item form-item">
                  <div className="item-content">
                    <span className="item-value">Contact Form #{index + 1}</span>
                    <div className="form-features">
                      {form.hasEmail && <span className="feature-tag">📧 Email</span>}
                      {form.hasPhone && <span className="feature-tag">📞 Phone</span>}
                      {form.hasMessage && <span className="feature-tag">💬 Message</span>}
                    </div>
                    <span className="item-context">Method: {form.method}</span>
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => copyToClipboard(form.url, `form-${index}`)}
                      className="action-button"
                      title="Copy form URL"
                    >
                      {copiedItem === `form-${index}` ? <FaCheck /> : <FaCopy />}
                    </button>
                    {form.url && (
                      <button
                        onClick={() => openUrl(form.url)}
                        className="action-button"
                        title="Visit form"
                      >
                        <FaExternalLinkAlt />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No contact forms found</div>
            )}
          </div>
        </div>
      </div>

      {data.totalContactsFound === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No Contact Information Found</h3>
          <p>
            We couldn't find any contact information on this website. 
            This could be because:
          </p>
          <ul>
            <li>The website doesn't have publicly visible contact information</li>
            <li>The contact details are embedded in images or JavaScript</li>
            <li>The website blocks automated scraping requests</li>
            <li>The content is loaded dynamically after page load</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContactDisplay;