import { Box, Container, Text, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Hero = () => {
  const [currentText, setCurrentText] = useState("");
  const texts = [
    "Learn a new skill",
    "Launch a project",
    "Start a business",
    "Grow your startup"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const targetText = texts[currentIndex];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText === targetText) {
          // Wait before starting to delete
          setTypingSpeed(2000); // Pause at the end
          setIsDeleting(true);
        } else {
          // Type the next character
          setCurrentText(targetText.substring(0, currentText.length + 1));
          setTypingSpeed(150);
        }
      } else {
        if (currentText === "") {
          // Move to next text
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
          setTypingSpeed(150);
        } else {
          // Delete a character
          setCurrentText(currentText.substring(0, currentText.length - 1));
          setTypingSpeed(50);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, currentIndex, isDeleting, texts, typingSpeed]);

  return (
    <Container maxW="1200px" py={{ base: 8, md: 12 }}>
      <Flex
        direction="column"
        align="center"
        maxW="800px"
        mx="auto"
        position="relative"
        gap={4}
      >
        {/* Text above the typing animation */}
        <Text fontSize="50" fontWeight="500" color="teal" textAlign="center">
          Unlock your Potential with Expert Guidance.
        </Text>

        {/* Typing animation section */}
        <Box
          fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
          fontWeight="bold"
          lineHeight="1.2"
          color="navy.900"
          textAlign="center"
        >
          <Text as="span">1-on-1</Text>
          <Box
            minH={{ base: "60px", md: "80px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="teal.500"
            my={2}
          >
            <Text as="span">{currentText}</Text>
            <Text
              as="span"
              animation="blink 1s step-end infinite"
              sx={{
                "@keyframes blink": {
                  "50%": {
                    opacity: 0,
                  },
                },
              }}
            >
              |
            </Text>
          </Box>
          <Text as="span">Mentorship</Text>
        </Box>

        {/* Text below the typing animation */}
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Connect with top mentors to navigate your career growth.
        </Text>
      </Flex>
    </Container>
  );
};

export default Hero; 