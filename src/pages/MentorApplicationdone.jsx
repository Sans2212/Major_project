import React from "react";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useNavigate } from "react-router-dom";

const MentorApplicationdone = () => {
  const { width, height } = useWindowSize();
  const navigate = useNavigate();

  return (
    <Box position="relative" bg="#f7f9fc" minHeight="100vh" py={20} px={6}>
      {/* Confetti Animation */}
      <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />

      <VStack spacing={6} align="center" textAlign="center">
        <Heading size="2xl" color="purple.600">
          🎉 Congratulations!
        </Heading>
        <Text fontSize="xl" color="gray.700" maxW="600px">
          You’re officially a mentor now! Thank you for taking the step to guide and inspire others.
        </Text>
        <Text fontSize="md" color="gray.500">
          Your profile is under review and will be live shortly.
        </Text>

        <Button
          colorScheme="purple"
          size="lg"
          onClick={() => navigate("/")} // You can change the route
        >
          Go to Dashboard
        </Button>
      </VStack>
    </Box>
  );
};

export default MentorApplicationdone;
