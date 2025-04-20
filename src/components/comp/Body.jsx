import React from "react";
import { Box, Flex, Heading, Text, Stack, Image, Button } from "@chakra-ui/react";
import Cards from "./Cards"; // Import the new component

const Body = () => {
  return (
    <Flex direction="row" align="center" justify="space-between" position="relative" minHeight="80vh">
      {/* Left 70% - Hero Section */}
      {/* <Box w="70%" p={10}>
        <Heading as="h2" size="2xl" mb={4} color="teal.600">
          Unlock Your Potential with Expert Guidance
        </Heading>
        <Text fontSize="xl" mb={6} color="gray.600">
          Connect with top mentors to navigate your career and personal growth.
        </Text>
        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
          <Button colorScheme="teal" variant="solid" size="lg">
            Find a Mentor
          </Button>
          <Button colorScheme="green" variant="outline" size="lg">
            Become a Mentor
          </Button>
        </Stack>
        <Image
          src="https://via.placeholder.com/500x400.png?text=Mentor+Connect"
          alt="Mentor Connect Illustration"
          borderRadius="md"
          shadow="lg"
          mt={6}
        />
      </Box> */}

      {/* Right 30% - Scrolling Mentors */}
      <Cards />
    </Flex>
  );
};

export default Body;
