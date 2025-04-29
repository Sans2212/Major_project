import { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Tag,
  SimpleGrid,
} from "@chakra-ui/react";
import Cards from "./Cards"; // Assuming this is your custom Cards component to display mentor profiles

const tags = [
  "Product Managers",
  "Career Coaches",
  "Software Engineers",
  "Leadership Mentors",
  "UX Designers",
  "Data Scientists",
  "Startup Founders",
];

const rotatingWords = [
  "Marketing",
  "Design",
  "Engineering",
  "Startups",
  "Leadership",
  "Data Science",
  "Product Management",
  "Career Growth",
];

const Body = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = rotatingWords[currentWordIndex];
    const typingSpeed = isDeleting ? 50 : 150; // faster when deleting

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing effect
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText.length + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 1000); // wait before deleting
        }
      } else {
        // Deleting effect
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex]);

  return (
    <Flex
      direction="column"
      minHeight="100vh"
      bg="white"
      py={10}
      justify="space-between"
    >
      {/* Main Content Section */}
      <Flex justify="center" gap={10} flex="3">
        {/* Left Section (Content) */}
        <Flex
          direction="column"
          flex="2"
          gap={6}
          align="center"
          justify="center"
          maxWidth={{ base: "100%", md: "100%" }}
        >
          {/* Intro Text */}
          <Text fontSize="50" fontWeight="500" color="teal" textAlign="center">
            Unlock your Potential with Expert Guidance.
          </Text>

          {/* Heading with typing effect */}
          <Heading as="h1" size="3xl" mb={6} textAlign="center">
            1-on-1{" "}
            <Text as="span" color="teal.500">
              {displayText}
            </Text>{" "}
            Mentorship
          </Heading>

          <Text fontSize="lg"  color="gray.500" textAlign="center">
            Connect with top mentors to navigate your career growth.
          </Text>

          {/* Heading for Mentors */}
          <Heading as="h2" size="lg" mb={6} textAlign="center">
            Meet our Mentors
          </Heading>
          <Text mb={6} textAlign="center">
            Choose from a diverse set of industry professionals ready to guide you on your career journey.
          </Text>

          <Flex
        direction="column"
        align="center"
        justify="center"
        mt={10}
        maxWidth={{ base: "100%", md: "100%" }}
      >
        <Text fontSize="lg" mb={4} textAlign="center">
          Explore Mentors by Expertise
        </Text>
        <Flex wrap="wrap" justify="center" gap={4}>
          {tags.map((tag, index) => (
            <Tag key={index} colorScheme="teal" variant="solid" size="lg">
              {tag}
            </Tag>
          ))}
</Flex>

        </Flex>

        

      </Flex>

        {/* Right Section (Cards) */}
<Flex
  flex="1"
  justify="center"
  align="center"
  direction="column"
  maxWidth={{ base: "100%", md: "50%" }}
  height="100%"
  overflowY="auto" // only vertical scroll if needed
>
  <Cards  style={{ width: "100%" }} /> 
</Flex>
      </Flex>
     
    </Flex>
  );
};

export default Body;
