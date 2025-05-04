import axios from "axios";

export const fetchUserSettings = async (user, token) => {
  const endpoint = user.role === "mentor"
    ? "http://localhost:3001/api/mentors/settings"
    : "http://localhost:3001/api/mentees/settings";

  const response = await axios.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const saveUserSettings = async (user, settings, token) => {
  const endpoint = user.role === "mentor"
    ? "http://localhost:3001/api/mentors/settings"
    : "http://localhost:3001/api/mentees/settings";

  await axios.put(endpoint, settings, {
    headers: { Authorization: `Bearer ${token}` }
  });
}; 