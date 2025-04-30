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

  return (
    <Box bg={bgColor} color={textColor}>
      <Container as={Stack} maxW="6xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align="flex-start">
            <ListHeader color={headingColor}>Company</ListHeader>
            <Link href="/about">About Us</Link>
            <Link href="/help">Help Center</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </Stack>

          <Stack align="flex-start">
            <ListHeader color={headingColor}>Support</ListHeader>
            <Link href="/contact">Contact Us</Link>
            <Link href="/feedback">Feedback</Link>
            <Link href="/report">Report an Issue</Link>
          </Stack>

          <Stack align="flex-start">
            <ListHeader color={headingColor}>For Mentors</ListHeader>
            <Link href="/signup/mentor/form" color={textColor}>
              Become a Mentor
            </Link>
            <Link href="/mentor-guidelines" color={textColor}>
              Mentor Guidelines
            </Link>
            <Link href="#" color={textColor}>
              Mentor Resources
            </Link>
            <Link href="#" color={textColor}>
              Mentor Community
            </Link>
          </Stack>

          <Stack align="flex-start">
            <ListHeader color={headingColor}>For Mentees</ListHeader>
            <Link href="/signup/mentee">Sign Up</Link>
            <Link href="/mentee/guidelines">Mentee Guidelines</Link>
            <Link href="/mentee/resources">Resources</Link>
          </Stack>
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
