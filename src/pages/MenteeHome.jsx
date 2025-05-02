import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  SimpleGrid,
  useColorModeValue,
  Avatar,
  Icon,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import logo from "../assets/main_logo.png";
import { mentors } from "../data/mentors";
import { useState } from "react";
import ProfileDropdown from '../components/comp/ProfileDropdown';

const MenteeHome = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.700");
  const [recommendedMentors] = useState(() => {
    // Get 3 random mentors for recommendations
    const shuffled = [...mentors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  });

  const handleMentorClick = (mentorId) => {
    navigate(`/mentors/${mentorId}`);
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Flex p={4} align="center">
        <Spacer />
        <ProfileDropdown />
      </Flex>
      {/* Header */}
      <Flex
        bgGradient="linear(to-r, teal.600, green.600)"
        color="white"
        px={6}
        py={4}
        align="center"
        justify="space-between"
      >
        <Image
          src={logo}
          alt="Mentor Connect Logo"
          boxSize="60px"
          cursor="pointer"
          onClick={() => navigate("/")}
        />
        <Heading size="md">Welcome, Mentee!</Heading>
      </Flex>

      {/* Main Content */}
      <VStack spacing={10} px={{ base: 4, md: 16 }} py={10} align="stretch">
        {/* Quick Actions */}
        <HStack spacing={6} justify="center" wrap="wrap">
          <Button colorScheme="teal" onClick={() => navigate("/book-session")}>
            Book a Session
          </Button>
          <Button
            variant="outline"
            colorScheme="teal"
            onClick={() => navigate("/browse")}
          >
            Explore Mentors
          </Button>
        </HStack>

        {/* Cards Section */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Upcoming Sessions */}
          <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="md">
            <Heading size="md" mb={4} color="teal.600">
              Upcoming Sessions
            </Heading>
            <Text>No sessions scheduled yet.</Text>
            {/* You can map upcoming sessions here */}
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
                  onClick={() => handleMentorClick(mentor.id)}
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
                        <Text fontSize="sm" fontWeight="bold" mr={1}>{mentor.rating}</Text>
                        <Text fontSize="sm" color="gray.500">({mentor.reviews} reviews)</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default MenteeHome;
