import axios from "axios";

export const fetchMenteeProfile = async (token) => {
  const response = await axios.get("http://localhost:3001/api/mentees/profile", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateMenteeProfile = async (token, formData) => {
  await axios.put(
    "http://localhost:3001/api/mentees/profile",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      }
    }
  );};


export const updateMentorProfile = async (token, formData) => {
    await axios.put(
      "http://localhost:3001/api/mentors/profile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      }
    );
  };