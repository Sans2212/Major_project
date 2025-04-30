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
import { FaShieldAlt, FaUserLock, FaCookie, FaUserCheck } from "react-icons/fa";

const PrivacyPolicy = () => {
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
            Privacy Policy
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
              At MentorMe, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </Text>
          </Box>

          {/* Information We Collect */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Information We Collect
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaUserCheck} color="teal.500" />
                <Text as="span" fontWeight="bold">Personal Information:</Text>
                <Text color={textColor}>
                  Name, email address, phone number, professional background, and other information you provide during registration.
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaCookie} color="teal.500" />
                <Text as="span" fontWeight="bold">Usage Data:</Text>
                <Text color={textColor}>
                  Information about how you use our platform, including session duration, pages visited, and features used.
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaUserLock} color="teal.500" />
                <Text as="span" fontWeight="bold">Communication Data:</Text>
                <Text color={textColor}>
                  Messages and other communications between mentors and mentees through our platform.
                </Text>
              </ListItem>
            </List>
          </Box>

          {/* How We Use Your Information */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              How We Use Your Information
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaShieldAlt} color="teal.500" />
                <Text color={textColor}>
                  To provide and maintain our service
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaShieldAlt} color="teal.500" />
                <Text color={textColor}>
                  To notify you about changes to our service
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaShieldAlt} color="teal.500" />
                <Text color={textColor}>
                  To provide customer support
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaShieldAlt} color="teal.500" />
                <Text color={textColor}>
                  To gather analysis or valuable information to improve our platform
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaShieldAlt} color="teal.500" />
                <Text color={textColor}>
                  To monitor the usage of our service
                </Text>
              </ListItem>
            </List>
          </Box>

          {/* Data Security */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Data Security
            </Heading>
            <Text color={textColor} mb={4}>
              We implement appropriate technical and organizational security measures to protect your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
            </Text>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaShieldAlt} color="teal.500" />
                <Text color={textColor}>
                  Encryption of data in transit and at rest
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaShieldAlt} color="teal.500" />
                <Text color={textColor}>
                  Regular security assessments and updates
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaShieldAlt} color="teal.500" />
                <Text color={textColor}>
                  Access controls and authentication
                </Text>
              </ListItem>
            </List>
          </Box>

          {/* Your Rights */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Your Rights
            </Heading>
            <Text color={textColor} mb={4}>
              You have the right to:
            </Text>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaUserLock} color="teal.500" />
                <Text color={textColor}>
                  Access your personal data
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaUserLock} color="teal.500" />
                <Text color={textColor}>
                  Request correction of your personal data
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaUserLock} color="teal.500" />
                <Text color={textColor}>
                  Request deletion of your personal data
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaUserLock} color="teal.500" />
                <Text color={textColor}>
                  Object to processing of your personal data
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={FaUserLock} color="teal.500" />
                <Text color={textColor}>
                  Request restriction of processing your personal data
                </Text>
              </ListItem>
            </List>
          </Box>

          {/* Contact Us */}
          <Box bg={sectionBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={4}>
              Contact Us
            </Heading>
            <Text color={textColor}>
              If you have any questions about this Privacy Policy, please contact us at:
            </Text>
            <Text color={textColor} mt={2}>
              Email: privacy@mentorme.com
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy; 