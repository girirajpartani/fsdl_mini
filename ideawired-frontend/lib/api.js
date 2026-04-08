const API_URL = "http://localhost:5000/api";

export const fetchAPI = async (endpoint, method = "GET", body, token) => {
  console.log(`Making ${method} request to: ${endpoint}`);
  
  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
  };

  // Only set Content-Type for requests that have a body
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  console.log("Request config:", config);

  const res = await fetch(`${API_URL}${endpoint}`, config);
  console.log("Response status:", res.status);
  
  const data = await res.json();
  console.log("Response data:", data);
  
  return data;
};