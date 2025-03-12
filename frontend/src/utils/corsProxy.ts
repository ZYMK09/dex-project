/**
 * Simple CORS proxy for API requests
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns The response data
 */
export const fetchWithProxy = async (url: string, options: RequestInit = {}): Promise<any> => {
  try {
    // Try direct fetch first
    try {
      const directResponse = await fetch(url, options);
      return await directResponse.json();
    } catch (error) {
      console.log('Direct fetch failed, trying with CORS proxy:', error);
    }
    
    // List of CORS proxies to try
    const corsProxies = [
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url=',
      'https://api.codetabs.com/v1/proxy?quest='
    ];
    
    // Try each proxy until one works
    for (const proxy of corsProxies) {
      try {
        const response = await fetch(`${proxy}${url}`, options);
        return await response.json();
      } catch (error) {
        console.log(`Proxy ${proxy} failed:`, error);
      }
    }
    
    throw new Error('All CORS proxies failed');
  } catch (error) {
    console.error('Error fetching with proxy:', error);
    throw error;
  }
};
