import React from "react";
import { Box, Flex, Heading, Text, Stack, Image, Button } from "@chakra-ui/react";

const Body = () => {
  return (
    <Flex
      align="center"
      justify="center"
      direction={{ base: "column", md: "row" }}
      bgGradient="linear(to-r, teal.500, green.500)"
      py={20}
      px={6}
    >
      {/* Text & Call-to-Action */}
      <Box flex="1" color="white">
        <Heading as="h2" size="2xl" mb={4}>
          Unlock Your Potential with Expert Guidance
        </Heading>
        <Text fontSize="xl" mb={6}>
          Connect with top mentors to navigate your career and personal growth.
        </Text>
        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
          <Button colorScheme="teal" variant="solid" size="lg">
            Find a Mentor
          </Button>
          <Button colorScheme="whiteAlpha" variant="outline" size="lg">
            Become a Mentor
          </Button>
        </Stack>
      </Box>

      {/* Hero Image */}
      <Box flex="1" mt={{ base: 10, md: 0 }} ml={{ md: 10 }}>
        <Image
          src="https://via.placeholder.com/500x400.png?text=Mentor+Connect"
          alt="Mentor Connect Illustration"
          borderRadius="md"
          shadow="lg"
        />
      </Box>
    </Flex>
  );
};

export default Body;
