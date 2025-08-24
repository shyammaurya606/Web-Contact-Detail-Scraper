# Contact Information Scraper (for Demo Link visit on Portfolio)

A React-based web application that extracts contact details from any website URL. This tool helps you quickly gather contact information including emails, phone numbers, addresses, social media profiles, and contact forms.

# 🚨 Limitations ( maybe dont work for some websites)

- Some websites may block scraping attempts due to security policies
- Dynamic content loaded via JavaScript may not be captured
- Contact information embedded in images cannot be extracted
- Rate limiting may slow down requests for large-scale usage

  
## 🛠️ Tech Stack

- **React 18** with hooks for state management
- **Axios** for HTTP requests and CORS proxy communication
- **React Icons** for beautiful, consistent iconography
- **Vanilla CSS** with modern design patterns and animations
- **Vite** for fast development and optimized builds

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## 💡 Usage

1. **Enter a website URL** in the input field (e.g., `example.com` or `https://example.com`)
2. **Click "Extract Contacts"** to start the scraping process
3. **View results** organized by contact type:
   - 📧 Email addresses with context
   - 📞 Phone numbers (formatted automatically)
   - 📍 Physical addresses
   - 🔗 Social media profiles
   - 📝 Contact forms
4. **Interact with results**:
   - Copy any contact information to clipboard
   - Open email clients, dialers, or maps directly
   - Visit social media profiles and contact forms

## 🔒 Privacy & Ethics

This tool is designed for legitimate business purposes and respects website policies:

- **Respects robots.txt** when possible
- **Implements rate limiting** to avoid overwhelming servers
- **Handles blocked requests** gracefully with appropriate error messages
- **No data storage**: All extracted information remains local to your browser
- **Transparent operation**: All requests are made through public CORS proxies



## 🌐 CORS Proxy Information

The application uses public CORS proxy services to handle cross-origin requests:
- Primary: `cors-anywhere.herokuapp.com`
- Fallback: `api.allorigins.win`
- 

**Note**: Public CORS proxies may have usage limitations. For production use, consider setting up your own proxy server.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ContactScraper.js       # Main scraping logic and data extraction
│   ├── ContactDisplay.jsx      # Results display with interactive features
│   ├── ContactDisplay.css      # Styling for results interface
│   ├── ErrorMessage.jsx        # Error handling component
│   └── ErrorMessage.css        # Error message styling
├── App.jsx                     # Main application component
├── App.css                     # Global application styles
├── main.jsx                    # React application entry point
└── index.css                   # Base styles and CSS reset
```





## 📜 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

This tool is intended for legitimate business and research purposes only. Users are responsible for ensuring their use complies with website terms of service, applicable laws, and ethical guidelines. The developers assume no responsibility for misuse of this tool.

## 🆘 Troubleshooting

### Common Issues

**"CORS policy" errors**:
- Try using a different URL format (with or without https://)
- The target website may have strict CORS policies
- Try again later as proxy services may be temporarily unavailable

**No contact information found**:
- The website may not have publicly visible contact information
- Contact details might be in images or JavaScript-generated content
- Some websites use anti-scraping measures

**Slow response times**:
- CORS proxies may introduce delays
- Large websites take longer to process
- Rate limiting may slow consecutive requests

### Performance Tips

- Use specific pages (like contact or about pages) for better results
- Avoid scraping large e-commerce or complex web applications
- Wait between requests to respect rate limits
