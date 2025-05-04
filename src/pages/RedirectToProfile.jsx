import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  VStack,
  Spinner,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

const RedirectToProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        // Get the email from localStorage or your auth state
        const email = localStorage.getItem('mentorEmail');
        
        if (!email) {
          setError('Please log in first');
          return;
        }

        const response = await axios.get(`http://localhost:3001/api/mentors/profile-by-email/${email}`);
        const { mentorId } = response.data;
        
        // Redirect to the mentor profile page
        navigate(`/mentors/${mentorId}`);
      } catch (err) {
        console.error('Error:', err);
        setError(err.response?.data?.message || 'Error finding your profile');
      }
    };

    fetchMentorProfile();
  }, [navigate]);

  if (error) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <VStack spacing={4}>
        <Spinner size="xl" />
        <Text>Finding your profile...</Text>
      </VStack>
    </Box>
  );
};

export default RedirectToProfile; 