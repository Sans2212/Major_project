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

const MenteeGuidelines = () => {
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
              Mentee Guidelines
            </Heading>
            <Text fontSize="xl" color={textColor}>
              Best practices and guidelines for effective learning
            </Text>
          </Box>

          {/* Introduction */}
          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Welcome to Your Learning Journey
            </Heading>
            <Text color={textColor} mb={4}>
              As a mentee, you have the opportunity to learn and grow with the guidance of experienced mentors. 
              These guidelines will help you make the most of your mentorship experience.
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
                <Text color={textColor}>Be proactive in scheduling and attending sessions</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaCheckCircle} color="green.500" />
                <Text color={textColor}>Come prepared with questions and topics to discuss</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaCheckCircle} color="green.500" />
                <Text color={textColor}>Implement feedback and follow through on action items</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaCheckCircle} color="green.500" />
                <Text color={textColor}>Communicate openly about your goals and challenges</Text>
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
                  <Icon as={FaHandshake} mr={2} /> Active Participation
                </Heading>
                <Text color={textColor}>
                  Take initiative in your learning journey. Be engaged during sessions and follow up on discussions.
                </Text>
              </Box>

              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  <Icon as={FaClock} mr={2} /> Time Management
                </Heading>
                <Text color={textColor}>
                  Respect your mentor&apos;s time by being punctual and prepared for each session.
                </Text>
              </Box>

              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  <Icon as={FaComments} mr={2} /> Communication
                </Heading>
                <Text color={textColor}>
                  Be clear about your needs and expectations. Don&apos;t hesitate to ask questions or seek clarification.
                </Text>
              </Box>

              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  <Icon as={FaLock} mr={2} /> Professionalism
                </Heading>
                <Text color={textColor}>
                  Maintain a professional attitude and respect the boundaries of the mentoring relationship.
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
                <Text color={textColor}>Set specific, measurable goals for your mentorship</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaLightbulb} color="yellow.500" />
                <Text color={textColor}>Take notes during sessions and review them afterward</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaLightbulb} color="yellow.500" />
                <Text color={textColor}>Be open to constructive feedback and different perspectives</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaLightbulb} color="yellow.500" />
                <Text color={textColor}>Apply what you learn and share your progress with your mentor</Text>
              </ListItem>
            </List>
          </Box>

          {/* Additional Resources */}
          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Additional Resources
            </Heading>
            <Text color={textColor} mb={4}>
              For more detailed information about making the most of your mentorship, please visit our{" "}
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

export default MenteeGuidelines; 