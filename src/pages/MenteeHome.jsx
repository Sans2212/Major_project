import React from "react";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/main_logo.png";

const MenteeHome = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <Box minH="100vh" bg="gray.50">
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
            onClick={() => navigate("/mentors")}
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
            <Text>Explore top mentors based on your interest.</Text>
            {/* You can map recommended mentors here */}
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default MenteeHome;
