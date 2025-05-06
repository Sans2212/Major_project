import axios from "axios";

const API_URL = 'http://localhost:3001/api';

export const fetchUserSettings = async (user, token) => {
  try {
    if (!user || !user.role) {
      throw new Error('User or role is missing');
    }

    const endpoint = user.role === 'mentor' ? '/mentors/profile' : '/mentees/profile';
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const userData = response.data;
    // Always set user.id from _id and preserve role
    const prevUser = JSON.parse(localStorage.getItem('user')) || {};
    localStorage.setItem('user', JSON.stringify({ ...userData, id: userData._id, role: prevUser.role }));

    return {
      fullName: userData.fullName || `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      phone: userData.phone || '',
      calendlyUrl: userData.calendlyUrl || '',
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
    if (!user || !user.role) {
      throw new Error('User or role is missing');
    }

    const userId = user.id || user._id;
    if (!userId) throw new Error('User ID is missing.');

    // Validate Calendly URL if provided
    if (settings.calendlyUrl && !settings.calendlyUrl.startsWith('https://calendly.com/')) {
      throw new Error('Invalid Calendly URL format. URL must start with https://calendly.com/');
    }

    if (user.role === 'mentor') {
      // Update mentor profile
      const nameParts = settings.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';
      
      await axios.put(
        `${API_URL}/mentors/profile/${userId}`,
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
    } else {
      // Update mentee profile
      await axios.put(
        `${API_URL}/mentees/profile`,
        {
          fullName: settings.fullName,
          phone: settings.phone
        },
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