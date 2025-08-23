# Contact Information Scraper

A React-based web application that extracts contact details from any website URL. This tool helps you quickly gather contact information including emails, phone numbers, addresses, social media profiles, and contact forms.

## 🚀 Features

- **Multi-type Contact Extraction**: Emails, phone numbers, physical addresses, social media links, and contact forms
- **Smart Validation**: URL format validation and contact information filtering
- **Cross-Origin Support**: Uses CORS proxies to handle website scraping restrictions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Feedback**: Loading states, error handling, and success notifications
- **Copy & Share**: One-click copying and external link opening for all contact information
- **Rate Limiting**: Respects website policies and implements appropriate delays

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

## 🚨 Limitations

- Some websites may block scraping attempts due to security policies
- Dynamic content loaded via JavaScript may not be captured
- Contact information embedded in images cannot be extracted
- Rate limiting may slow down requests for large-scale usage

## 🌐 CORS Proxy Information

The application uses public CORS proxy services to handle cross-origin requests:
- Primary: `cors-anywhere.herokuapp.com`
- Fallback: `api.allorigins.win`

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

## 🎨 Customization

### Styling
- Modify color schemes in CSS files
- Adjust responsive breakpoints in media queries
- Customize animations and transitions

### Functionality
- Add new contact information patterns in `ContactScraper.js`
- Extend social media platform support
- Implement additional validation rules

### CORS Proxies
- Replace proxy URLs in `ContactScraper.js` with your own services
- Add authentication for private proxy services
- Implement proxy rotation for better reliability

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across different websites
5. Submit a pull request

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

## 📞 Support

For issues, feature requests, or questions, please create an issue in the project repository or contact the development team.