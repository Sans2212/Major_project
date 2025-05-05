import { Box, Heading, Text, Button, VStack, Link, useColorModeValue } from "@chakra-ui/react";
import Confetti from "react-confetti";  // Import here
import { useWindowSize } from "react-use";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";


const MentorApplicationdone = () => {
  const { width, height } = useWindowSize();
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");

  const handleCalendlySetup = () => {
    const CLIENT_ID = "YOUR_CLIENT_ID";
    const REDIRECT_URI = "http://localhost:3000/oauth/callback";
    const calendlyAuthUrl = `https://auth.calendly.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=default`;

    window.location.href = calendlyAuthUrl;
  };

  return (
    <Box position="relative" bg="#f7f9fc" minHeight="100vh" py={20} px={6}>
      {/* Confetti Animation */}
      <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />

      <VStack spacing={6} align="center" textAlign="center" maxW="800px" mx="auto">
        <Heading size="2xl" color="purple.600">
          🎉 Congratulations!
        </Heading>
        <Text fontSize="xl" color="gray.700">
          You&apos;re officially a mentor now! Thank you for taking the step to guide and inspire others.
        </Text>
        <Text fontSize="md" color="gray.500">
          Your profile is under review and will be live shortly.
        </Text>

        {/* Calendly Setup Section */}
        <Box bg={cardBg} p={8} borderRadius="lg" boxShadow="md" w="full">
          <VStack spacing={4}>
            <Heading size="md" color="purple.600">
              <FaCalendarAlt style={{ display: "inline", marginRight: "8px" }} />
              Set Up Your Calendly Account
            </Heading>
            <Text color={textColor}>
              To enable video calls with your mentees, you&apos;ll need to set up a Calendly account.
              This will help manage your availability and schedule mentoring sessions efficiently.
            </Text>
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleCalendlySetup}
              leftIcon={<FaCalendarAlt />}
            >
              Set Up Calendly Account
            </Button>
            <Text fontSize="sm" color="gray.500">
              Already have a Calendly account? You can add your Calendly link in your profile settings later.
            </Text>
          </VStack>
        </Box>

        <Button
          colorScheme="purple"
          size="lg"
          onClick={() => navigate("/login")}
        >
          Go to Login Page
        </Button>
      </VStack>
    </Box>
  );
};

export default MentorApplicationdone;
