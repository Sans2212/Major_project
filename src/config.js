// Function to get the API URL
export const getApiUrl = () => {
  // Default port
  const defaultPort = 3001;
  
  // Try to get the port from localStorage (will be set when server starts)
  const serverPort = localStorage.getItem('serverPort') || defaultPort;
  
  return `http://localhost:${serverPort}`;
};

// Function to update the server port
export const updateServerPort = (port) => {
  localStorage.setItem('serverPort', port);
};

// Function to fetch the current server port
export const fetchServerPort = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/server-info');
    const data = await response.json();
    if (data.port) {
      updateServerPort(data.port);
      return data.port;
    }
    return 3001;
  } catch (error) {
    console.error('Failed to fetch server port:', error);
    return 3001;
  }
}; 