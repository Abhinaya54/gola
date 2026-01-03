// API utility functions for backend communication
export const fetchData = async (endpoint, options = {}) => {
  const response = await fetch(endpoint, options);
  if (!response.ok) throw new Error('API error');
  return response.json();
};
