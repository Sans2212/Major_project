// src/pages/BrowseMentors.jsx (or FindMentors.jsx)

// import React from "react";
import { Box, Heading, Text, SimpleGrid, VStack, useColorModeValue } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// Dummy mentors data (replace with API data later)
const dummyMentors = [
  {
    id: "engineering-mentors",
    name: "John Doe",
    title: "Senior Software Engineer",
    expertise: ["JavaScript", "React", "Node.js"],
    image: "https://static.vecteezy.com/system/resources/previews/012/177/622/original/man-avatar-isolated-png.png"
  },
  {
    id: "design-mentors",
    name: "Jane Smith",
    title: "UX/UI Designer",
    expertise: ["Figma", "UI Design", "User Research"],
    image: "https://static.vecteezy.com/system/resources/previews/012/177/622/original/man-avatar-isolated-png.png"
  },
  // Add more dummy mentors as needed
];

const BrowseMentors = () => {
  const { category } = useParams();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Format the category name for display
  const formattedCategory = category
    ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'All Mentors';

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        <Heading size="xl">{formattedCategory}</Heading>
        <Text fontSize="lg" color="gray.600">
          Find the perfect mentor to guide you in your journey
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {dummyMentors.map((mentor) => (
            <Box
              key={mentor.id}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg={bgColor}
              borderColor={borderColor}
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              <VStack spacing={4} align="stretch">
                <Box
                  w="100%"
                  h="200px"
                  bg="gray.100"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Heading size="md">{mentor.name}</Heading>
                <Text color="gray.600">{mentor.title}</Text>
                <Box>
                  {mentor.expertise.map((skill, index) => (
                    <Text
                      key={index}
                      as="span"
                      mr={2}
                      mb={2}
                      display="inline-block"
                      color="teal.500"
                    >
                      #{skill}
                    </Text>
                  ))}
                </Box>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default BrowseMentors;
