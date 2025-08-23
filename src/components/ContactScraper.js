import axios from 'axios';

class ContactScraper {
  static CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  static FALLBACK_PROXY = 'https://api.allorigins.win/get?url=';
  
  static async scrapeWebsite(url) {
    const startTime = Date.now();
    
    try {
      const htmlContent = await this.fetchWebsiteContent(url);
      const contactData = this.extractContactInformation(htmlContent, url);
      
      contactData.scrapingTime = Date.now() - startTime;
      contactData.success = true;
      
      return contactData;
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  static async fetchWebsiteContent(url) {
    const maxRetries = 2;
    let lastError;

    // Try CORS Anywhere first
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await axios.get(`${this.CORS_PROXY}${url}`, {
          timeout: 15000,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (compatible; ContactScraper/1.0)'
          }
        });
        
        if (response.data && typeof response.data === 'string') {
          return response.data;
        }
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // Fallback to AllOrigins
    try {
      const response = await axios.get(`${this.FALLBACK_PROXY}${encodeURIComponent(url)}`, {
        timeout: 15000
      });
      
      if (response.data && response.data.contents) {
        return response.data.contents;
      }
    } catch (error) {
      lastError = error;
    }

    throw lastError || new Error('Failed to fetch website content');
  }

  static extractContactInformation(html, baseUrl) {
    const contactData = {
      url: baseUrl,
      timestamp: new Date().toISOString(),
      emails: this.extractEmails(html),
      phones: this.extractPhones(html),
      addresses: this.extractAddresses(html),
      socialMedia: this.extractSocialMedia(html),
      contactForms: this.extractContactForms(html, baseUrl),
      totalContactsFound: 0
    };

    // Calculate total contacts found
    contactData.totalContactsFound = 
      contactData.emails.length +
      contactData.phones.length +
      contactData.addresses.length +
      contactData.socialMedia.length +
      contactData.contactForms.length;

    return contactData;
  }

  static extractEmails(html) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = html.match(emailRegex) || [];
    
    // Filter out common false positives and duplicates
    const validEmails = [...new Set(emails)]
      .filter(email => 
        !email.includes('example.') &&
        !email.includes('test@') &&
        !email.includes('noreply@') &&
        !email.includes('no-reply@') &&
        !email.includes('.png') &&
        !email.includes('.jpg') &&
        email.length > 5
      )
      .slice(0, 20); // Limit to prevent spam

    return validEmails.map(email => ({
      value: email.toLowerCase(),
      context: this.getEmailContext(html, email)
    }));
  }

  static extractPhones(html) {
    const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const indianMobileRegex = /(\+91[-.\s]?)?[6-9]\d{9}/g;
    const indianLandlineRegex = /(\+91[-.\s]?)?0?[1-9]\d{2,4}[-.\s]?\d{6,8}/g;
    const indianTollFreeRegex = /(\+91[-.\s]?)?1800[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const internationalRegex = /\+[1-9]\d{1,14}/g;
    
    const phones = [
      ...(html.match(phoneRegex) || []),
      ...(html.match(indianMobileRegex) || []),
      ...(html.match(indianLandlineRegex) || []),
      ...(html.match(indianTollFreeRegex) || []),
      ...(html.match(internationalRegex) || [])
    ];

    const validPhones = [...new Set(phones)]
      .filter(phone => {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      })
      .slice(0, 10);

    return validPhones.map(phone => ({
      value: phone.trim(),
      formatted: this.formatPhoneNumber(phone),
      type: phone.includes('+91') || (phone.replace(/\D/g, '').length === 10 && phone.replace(/\D/g, '')[0] >= '6') ? 'Indian' : 'International'
    }));
  }

  static extractAddresses(html) {
    const addressRegex = /\d+\s+[A-Za-z0-9\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Way|Place|Pl|Court|Ct|Circle|Cir)\s*,?\s*[A-Za-z\s,.-]*\d{5}(?:-\d{4})?/gi;
    const addresses = html.match(addressRegex) || [];
    
    const validAddresses = [...new Set(addresses)]
      .filter(addr => addr.length > 20 && addr.length < 200)
      .slice(0, 5);

    return validAddresses.map(address => ({
      value: address.trim(),
      context: 'Physical Address'
    }));
  }

  static extractSocialMedia(html) {
    const socialPatterns = {
      facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.com\/[A-Za-z0-9._-]+/g,
      twitter: /(?:https?:\/\/)?(?:www\.)?twitter\.com\/[A-Za-z0-9._-]+/g,
      instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[A-Za-z0-9._-]+/g,
      linkedin: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|company)\/[A-Za-z0-9._-]+/g,
      youtube: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/[A-Za-z0-9._-]+/g,
      tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[A-Za-z0-9._-]+/g
    };

    const socialMedia = [];

    Object.entries(socialPatterns).forEach(([platform, regex]) => {
      const matches = html.match(regex) || [];
      matches.forEach(match => {
        const cleanUrl = match.startsWith('http') ? match : `https://${match}`;
        socialMedia.push({
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          url: cleanUrl,
          username: this.extractUsername(cleanUrl, platform)
        });
      });
    });

    return [...new Map(socialMedia.map(item => [item.url, item])).values()].slice(0, 15);
  }

  static extractContactForms(html, baseUrl) {
    const formRegex = /<form[^>]*>(.*?)<\/form>/gis;
    const forms = html.match(formRegex) || [];
    const contactForms = [];

    forms.forEach(form => {
      if (this.isContactForm(form)) {
        const actionMatch = form.match(/action\s*=\s*["']([^"']+)["']/i);
        let actionUrl = actionMatch ? actionMatch[1] : '';
        
        if (actionUrl && !actionUrl.startsWith('http')) {
          try {
            const base = new URL(baseUrl);
            actionUrl = new URL(actionUrl, base.origin).toString();
          } catch (e) {
            actionUrl = `${baseUrl}${actionUrl.startsWith('/') ? '' : '/'}${actionUrl}`;
          }
        }

        contactForms.push({
          url: actionUrl || baseUrl,
          method: (form.match(/method\s*=\s*["']([^"']+)["']/i) || [])[1] || 'GET',
          hasEmail: form.includes('email'),
          hasPhone: form.includes('phone'),
          hasMessage: form.includes('message') || form.includes('comment')
        });
      }
    });

    return contactForms.slice(0, 5);
  }

  static isContactForm(formHtml) {
    const contactKeywords = ['contact', 'email', 'message', 'inquiry', 'feedback', 'support'];
    const lowerForm = formHtml.toLowerCase();
    return contactKeywords.some(keyword => lowerForm.includes(keyword));
  }

  static getEmailContext(html, email) {
    const index = html.toLowerCase().indexOf(email.toLowerCase());
    if (index === -1) return 'Found in page';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(html.length, index + email.length + 50);
    const context = html.substring(start, end).replace(/<[^>]*>/g, '').trim();
    
    return context || 'Contact information';
  }

  static formatPhoneNumber(phone) {
    const digits = phone.replace(/\D/g, '');
    
    // Indian mobile number formatting
  }
  static extractUsername(url, platform) {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      if (platform === 'tiktok') {
        return path.replace('/@', '').split('/')[0];
      }
      
      return path.split('/').filter(segment => segment)[0] || '';
    } catch {
      return '';
    }
  }

  static getErrorMessage(error) {
    if (error.code === 'ENOTFOUND') {
      return 'Website not found. Please check the URL and try again.';
    } else if (error.response?.status === 403) {
      return 'Access denied. The website blocks scraping requests.';
    } else if (error.response?.status === 429) {
      return 'Rate limit exceeded. Please wait a moment before trying again.';
    } else if (error.code === 'ECONNABORTED') {
      return 'Request timeout. The website took too long to respond.';
    } else if (error.response?.status >= 500) {
      return 'The website appears to be down. Please try again later.';
    }
    
    return 'Failed to scrape the website. Please verify the URL and try again.';
  }
}

export default ContactScraper;