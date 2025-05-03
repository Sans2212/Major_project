import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link,
  Icon,
  useColorModeValue,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { FaLinkedin, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";

const ListHeader = ({ children, color }) => {
  return (
    <Text fontWeight="500" fontSize="lg" mb={2} color={color}>
      {children}
    </Text>
  );
};

ListHeader.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

const Footer = () => {
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const hoverColor = useColorModeValue("teal.500", "teal.300");
  const { user } = useAuth();

  return (
    <Box bg={bgColor} color={textColor}>
      <Container as={Stack} maxW="6xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align="flex-start">
            <ListHeader color={headingColor}>Company</ListHeader>
            <Link as={RouterLink} to="/about">About Us</Link>
            <Link as={RouterLink} to="/help">Help Center</Link>
            <Link as={RouterLink} to="/privacy">Privacy Policy</Link>
            <Link as={RouterLink} to="/terms">Terms of Service</Link>
          </Stack>

          <Stack align="flex-start">
            <ListHeader color={headingColor}>Support</ListHeader>
            <Link as={RouterLink} to="/contact">Contact Us</Link>
            {user && (
              <Link as={RouterLink} to="/feedback">Feedback</Link>
            )}
            <Link as={RouterLink} to="/report">Report an Issue</Link>
          </Stack>

          {/* Show mentor links only if user is not a mentee */}
          {(!user || user.role !== 'mentee') && (
            <Stack align="flex-start">
              <ListHeader color={headingColor}>For Mentors</ListHeader>
              {!user && (
                <Link as={RouterLink} to="/signup/mentor">
                  Become a Mentor
                </Link>
              )}
              <Link as={RouterLink} to="/mentor-guidelines">
                Mentor Guidelines
              </Link>
              {user?.role === 'mentor' && (
                <>
                  <Link as={RouterLink} to="/my-profile">
                    My Profile
                  </Link>
                  <Link as={RouterLink} to="/mentor/resources">
                    Mentor Resources
                  </Link>
                  <Link as={RouterLink} to="/mentor/community">
                    Mentor Community
                  </Link>
                </>
              )}
            </Stack>
          )}

          {/* Show mentee links only if user is not a mentor */}
          {(!user || user.role !== 'mentor') && (
            <Stack align="flex-start">
              <ListHeader color={headingColor}>For Mentees</ListHeader>
              {!user && (
                <Link as={RouterLink} to="/signup/mentee">
                  Sign Up as Mentee
                </Link>
              )}
              <Link as={RouterLink} to="/mentee/guidelines">
                Mentee Guidelines
              </Link>
              {user?.role === 'mentee' && (
                <>
                  <Link as={RouterLink} to="/home/mentee">
                    My Dashboard
                  </Link>
                  <Link as={RouterLink} to="/browse">
                    Find Mentors
                  </Link>
                  <Link as={RouterLink} to="/mentee/resources">
                    Learning Resources
                  </Link>
                </>
              )}
            </Stack>
          )}
        </SimpleGrid>
      </Container>

      <Box py={10}>
        <Flex
          align="center"
          _before={{
            content: '""',
            borderBottom: "1px solid",
            borderColor: useColorModeValue("gray.200", "gray.700"),
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: "1px solid",
            borderColor: useColorModeValue("gray.200", "gray.700"),
            flexGrow: 1,
            ml: 8,
          }}
        >
          <Heading size="md" color={headingColor}>
            Connect With Us
          </Heading>
        </Flex>
        <Stack direction="row" spacing={6} justify="center" mt={6}>
          <Link href="https://linkedin.com" isExternal>
            <Icon as={FaLinkedin} w={6} h={6} _hover={{ color: hoverColor }} />
          </Link>
          <Link href="https://twitter.com" isExternal>
            <Icon as={FaTwitter} w={6} h={6} _hover={{ color: hoverColor }} />
          </Link>
          <Link href="https://instagram.com" isExternal>
            <Icon as={FaInstagram} w={6} h={6} _hover={{ color: hoverColor }} />
          </Link>
          <Link href="https://github.com" isExternal>
            <Icon as={FaGithub} w={6} h={6} _hover={{ color: hoverColor }} />
          </Link>
        </Stack>
      </Box>

      <Box py={10}>
        <Text textAlign="center" fontSize="sm">
          © {new Date().getFullYear()} MentorMe. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;
