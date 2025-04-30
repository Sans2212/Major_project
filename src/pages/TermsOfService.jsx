import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCheck, FaExclamationTriangle, FaUserShield, FaHandshake } from "react-icons/fa";

const TermsOfService = () => {
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const sectionBgColor = useColorModeValue("white", "gray.700");

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="container.md">
        <VStack spacing={8} textAlign="center" mb={12}>
          <Heading
            size="2xl"
            color={headingColor}
            fontWeight="bold"
            lineHeight="1.2"
          >
            Terms of Service
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="2xl">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </VStack>

        <VStack spacing={8} align="stretch">
          {/* Introduction */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Introduction
            </Heading>
            <Text color={textColor}>
              Welcome to MentorMe. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read these terms carefully before using our services.
            </Text>
          </Box>

          {/* Account Terms */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Account Terms
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaCheck} color="teal.500" />
                <Text color={textColor}>
                  You must be at least 18 years old to use this platform
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheck} color="teal.500" />
                <Text color={textColor}>
                  You must provide accurate and complete information when creating an account
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheck} color="teal.500" />
                <Text color={textColor}>
                  You are responsible for maintaining the security of your account
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheck} color="teal.500" />
                <Text color={textColor}>
                  You may not use another person&apos;s account without permission
                </Text>
              </ListItem>
            </List>
          </Box>

          {/* Mentor Responsibilities */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Mentor Responsibilities
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaUserShield} color="teal.500" />
                <Text color={textColor}>
                  Provide accurate information about your qualifications and experience
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaUserShield} color="teal.500" />
                <Text color={textColor}>
                  Maintain professional conduct during mentoring sessions
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaUserShield} color="teal.500" />
                <Text color={textColor}>
                  Respect mentee confidentiality and privacy
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaUserShield} color="teal.500" />
                <Text color={textColor}>
                  Provide guidance and support within your area of expertise
                </Text>
              </ListItem>
            </List>
          </Box>

          {/* Mentee Responsibilities */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Mentee Responsibilities
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaHandshake} color="teal.500" />
                <Text color={textColor}>
                  Be respectful and professional during mentoring sessions
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaHandshake} color="teal.500" />
                <Text color={textColor}>
                  Come prepared with specific questions and goals
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaHandshake} color="teal.500" />
                <Text color={textColor}>
                  Provide honest feedback about your mentoring experience
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaHandshake} color="teal.500" />
                <Text color={textColor}>
                  Follow through on action items discussed during sessions
                </Text>
              </ListItem>
            </List>
          </Box>

          {/* Prohibited Activities */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Prohibited Activities
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaExclamationTriangle} color="red.500" />
                <Text color={textColor}>
                  Harassment, discrimination, or any form of abuse
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaExclamationTriangle} color="red.500" />
                <Text color={textColor}>
                  Sharing confidential information without consent
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaExclamationTriangle} color="red.500" />
                <Text color={textColor}>
                  Using the platform for illegal purposes
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaExclamationTriangle} color="red.500" />
                <Text color={textColor}>
                  Attempting to bypass security measures
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaExclamationTriangle} color="red.500" />
                <Text color={textColor}>
                  Impersonating another person or entity
                </Text>
              </ListItem>
            </List>
          </Box>

          {/* Payment Terms */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Payment Terms
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaCheck} color="teal.500" />
                <Text color={textColor}>
                  All payments are processed securely through our platform
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheck} color="teal.500" />
                <Text color={textColor}>
                  Mentors set their own rates and payment terms
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheck} color="teal.500" />
                <Text color={textColor}>
                  Platform fees are clearly stated before booking
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheck} color="teal.500" />
                <Text color={textColor}>
                  Refund policies are determined by individual mentors
                </Text>
              </ListItem>
            </List>
          </Box>

          {/* Termination */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Termination
            </Heading>
            <Text color={textColor} mb={4}>
              We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason. You may also terminate your account at any time by contacting our support team.
            </Text>
          </Box>

          {/* Contact Us */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Contact Us
            </Heading>
            <Text color={textColor}>
              If you have any questions about these Terms of Service, please contact us at:
            </Text>
            <Text color={textColor} mt={2}>
              Email: legal@mentorme.com
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default TermsOfService; 