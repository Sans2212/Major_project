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