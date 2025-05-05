import axios from "axios";

const API_URL = 'http://localhost:3001/api';

export const fetchUserSettings = async (user, token) => {
  try {
    const response = await axios.get(`${API_URL}/mentors/profile/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return {
      fullName: `${response.data.firstName} ${response.data.lastName}`,
      email: response.data.email,
      phone: response.data.phone || '',
      calendlyUrl: response.data.calendlyUrl || '',
      notifications: {
        email: true,
        messages: true,
        updates: true
      },
      privacy: {
        showProfile: true,
        showEmail: false,
        showPhone: false
      }
    };
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch user settings');
  }
};

export const saveUserSettings = async (user, settings, token) => {
  try {
    // Validate Calendly URL if provided
    if (settings.calendlyUrl && !settings.calendlyUrl.startsWith('https://calendly.com/')) {
      throw new Error('Invalid Calendly URL format. URL must start with https://calendly.com/');
    }

    // Update basic profile info
    const nameParts = settings.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';
    await axios.put(
      `${API_URL}/mentors/profile/${user.id}`,
      {
        firstName,
        lastName,
        phone: settings.phone
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Update Calendly URL if it's changed
    if (settings.calendlyUrl) {
      await axios.put(
        `${API_URL}/mentors/calendly-url`,
        { calendlyUrl: settings.calendlyUrl },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || 'Failed to save settings');
  }
}; 