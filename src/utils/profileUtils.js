import axios from "axios";

export const fetchMenteeProfile = async (token) => {
  const response = await axios.get("http://localhost:30011/api/mentees/profile", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateMenteeProfile = async (token, formData) => {
  await axios.put(
    "http://localhost:30011/api/mentees/profile",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      }
    }
  );
}; 