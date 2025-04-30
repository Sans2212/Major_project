import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  List,
  ListItem,
  ListIcon,
  Icon,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { FaCheckCircle, FaLightbulb, FaHandshake, FaClock, FaComments, FaLock } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const MentorGuidelines = () => {
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.700");

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          {/* Header Section */}
          <Box textAlign="center" mb={8}>
            <Heading size="2xl" color={headingColor} mb={4}>
              Mentor Guidelines
            </Heading>
            <Text fontSize="xl" color={textColor}>
              Best practices and guidelines for effective mentoring
            </Text>
          </Box>

          {/* Introduction */}
          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Welcome to Mentorship
            </Heading>
            <Text color={textColor} mb={4}>
              As a mentor, you play a crucial role in helping mentees achieve their professional goals. 
              These guidelines will help you provide the best possible mentorship experience.
            </Text>
          </Box>

          {/* Core Responsibilities */}
          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={6}>
              Core Responsibilities
            </Heading>
            <List spacing={4}>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaCheckCircle} color="green.500" />
                <Text color={textColor}>Maintain regular communication with your mentee</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaCheckCircle} color="green.500" />
                <Text color={textColor}>Provide constructive feedback and guidance</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaCheckCircle} color="green.500" />
                <Text color={textColor}>Share relevant industry knowledge and experience</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaCheckCircle} color="green.500" />
                <Text color={textColor}>Help mentees set and achieve realistic goals</Text>
              </ListItem>
            </List>
          </Box>

          {/* Best Practices */}
          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={6}>
              Best Practices
            </Heading>
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  <Icon as={FaHandshake} mr={2} /> Building Trust
                </Heading>
                <Text color={textColor}>
                  Establish a safe and confidential environment where mentees feel comfortable sharing their challenges and goals.
                </Text>
              </Box>

              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  <Icon as={FaClock} mr={2} /> Time Management
                </Heading>
                <Text color={textColor}>
                  Be punctual and respect scheduled meeting times. Prepare for sessions in advance and maintain consistent availability.
                </Text>
              </Box>

              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  <Icon as={FaComments} mr={2} /> Communication
                </Heading>
                <Text color={textColor}>
                  Practice active listening and provide clear, actionable feedback. Encourage open dialogue and questions.
                </Text>
              </Box>

              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  <Icon as={FaLock} mr={2} /> Professional Boundaries
                </Heading>
                <Text color={textColor}>
                  Maintain appropriate professional boundaries while being approachable and supportive.
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Tips for Success */}
          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={6}>
              Tips for Success
            </Heading>
            <List spacing={4}>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaLightbulb} color="yellow.500" />
                <Text color={textColor}>Set clear expectations and goals at the beginning of the mentorship</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaLightbulb} color="yellow.500" />
                <Text color={textColor}>Be patient and allow mentees to learn at their own pace</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaLightbulb} color="yellow.500" />
                <Text color={textColor}>Share both successes and failures from your own experience</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaLightbulb} color="yellow.500" />
                <Text color={textColor}>Encourage mentees to take ownership of their learning journey</Text>
              </ListItem>
            </List>
          </Box>

          {/* Additional Resources */}
          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Additional Resources
            </Heading>
            <Text color={textColor} mb={4}>
              For more detailed information about mentoring best practices, please visit our{" "}
              <Link as={RouterLink} to="/help" color="blue.500">
                Help Center
              </Link>
              {" "}or contact our support team.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default MentorGuidelines; 