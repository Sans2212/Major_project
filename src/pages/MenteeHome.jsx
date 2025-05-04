import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  SimpleGrid,
  useColorModeValue,
  Avatar,
  Icon,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { mentors as staticMentors } from "../data/mentors";
import { useState, useEffect } from "react";
import axios from 'axios';
import RatingModal from '../components/comp/RatingModal';

const MenteeHome = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.700");
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        // Fetch user profile
        const profileResponse = await axios.get('http://localhost:30011/api/mentees/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const first = profileResponse.data.fullName.split(' ')[0];
        setFirstName(first);

        // Fetch mentors from database
        const mentorsResponse = await axios.get('http://localhost:30011/api/mentors/browse');
        const dbMentors = mentorsResponse.data.map(mentor => ({
          id: mentor._id,
          name: `${mentor.firstName} ${mentor.lastName}`,
          role: mentor.jobTitle || "Mentor",
          rating: mentor.rating || 4.5,
          reviews: mentor.reviews || 0,
          expertise: mentor.skills ? mentor.skills.split(',').map(skill => skill.trim()) : [],
          image: mentor.profilePhoto ? `http://localhost:30011/uploads/mentors/${mentor.profilePhoto}` : null,
          isFromDB: true
        }));

        // Combine with static mentors
        const allMentors = [...dbMentors, ...staticMentors];
        
        // Get 3 random mentors for recommendations
        const shuffled = [...allMentors].sort(() => 0.5 - Math.random());
        setRecommendedMentors(shuffled.slice(0, 3));
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to static mentors if database fetch fails
        const shuffled = [...staticMentors].sort(() => 0.5 - Math.random());
        setRecommendedMentors(shuffled.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMentorClick = (mentor) => {
    if (mentor.isFromDB) {
      navigate(`/mentors/${mentor.id}`);
    } else {
      navigate(`/mentors/static/${mentor.id}`);
    }
  };

  const handleRateClick = (e, mentor) => {
    e.stopPropagation(); // Prevent navigation when clicking rate button
    setSelectedMentor(mentor);
    onOpen();
  };

  const handleRatingSubmit = (newRating) => {
    // Update the local state with the new rating
    setRecommendedMentors(prevMentors =>
      prevMentors.map(mentor =>
        mentor.id === selectedMentor.id
          ? {
              ...mentor,
              rating: ((mentor.rating * mentor.reviews) + newRating) / (mentor.reviews + 1),
              reviews: mentor.reviews + 1
            }
          : mentor
      )
    );
  };

  if (isLoading) {
    return (
      <Box minH="100vh" p={8}>
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" color="teal.500" thickness="4px" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box minH="100vh" p={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Welcome back, {firstName}! 👋
          </Heading>
          <Text color="gray.600">
            Ready to connect with your next mentor?
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Quick Actions */}
          <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="md">
            <Heading size="md" mb={4} color="teal.600">
              Quick Actions
            </Heading>
            <VStack spacing={4} align="stretch">
              <Button
                colorScheme="teal"
                size="lg"
                onClick={() => navigate("/browse")}
              >
                Browse All Mentors
              </Button>
              <Button
                variant="outline"
                colorScheme="teal"
                size="lg"
                onClick={() => navigate("/browse/technology")}
              >
                Explore Technology Mentors
              </Button>
            </VStack>
          </Box>

          {/* Recommended Mentors */}
          <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="md">
            <Heading size="md" mb={4} color="teal.600">
              Recommended Mentors
            </Heading>
            <VStack spacing={4} align="stretch">
              {recommendedMentors.map((mentor) => (
                <Box
                  key={mentor.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  cursor="pointer"
                  onClick={() => handleMentorClick(mentor)}
                  _hover={{ bg: "gray.50" }}
                >
                  <Flex gap={3} align="center">
                    <Avatar
                      size="md"
                      name={mentor.name}
                      src={mentor.image}
                    />
                    <Box flex="1">
                      <Text fontWeight="bold">{mentor.name}</Text>
                      <Text fontSize="sm" color="gray.600">{mentor.role}</Text>
                      <Flex align="center" mt={1}>
                        <Icon as={FaStar} color="yellow.400" mr={1} />
                        <Text fontSize="sm" fontWeight="bold" mr={1}>{mentor.rating.toFixed(1)}</Text>
                        <Text fontSize="sm" color="gray.500">({mentor.reviews} reviews)</Text>
                      </Flex>
                    </Box>
                    <Button
                      size="sm"
                      colorScheme="yellow"
                      leftIcon={<Icon as={FaStar} />}
                      onClick={(e) => handleRateClick(e, mentor)}
                    >
                      Rate
                    </Button>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>

      {selectedMentor && (
        <RatingModal
          isOpen={isOpen}
          onClose={onClose}
          mentorId={selectedMentor.id}
          mentorName={selectedMentor.name}
          onRatingSubmit={handleRatingSubmit}
        />
      )}
    </Box>
  );
};

export default MenteeHome;
