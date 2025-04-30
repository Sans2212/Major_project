import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Input,
  Textarea,
  Button,
  Icon,
  useColorModeValue,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { FaEnvelope, FaPhone, FaClock, FaGlobe } from "react-icons/fa";

const ContactUs = () => {
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.700");

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} textAlign="center" mb={12}>
          <Heading
            size="2xl"
            color={headingColor}
            fontWeight="bold"
            lineHeight="1.2"
          >
            Contact Us
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="2xl">
            We&apos;re here to help! Choose your preferred way to get in touch with us.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          {/* Contact Information */}
          <VStack spacing={8} align="stretch">
            <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
              <Heading size="lg" color={headingColor} mb={6}>
                Get in Touch
              </Heading>
              
              <VStack spacing={6} align="stretch">
                <HStack spacing={4}>
                  <Icon as={FaEnvelope} color="teal.500" boxSize={6} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={headingColor}>Email</Text>
                    <Text color={textColor}>support@mentorme.com</Text>
                  </VStack>
                </HStack>

                <HStack spacing={4}>
                  <Icon as={FaPhone} color="teal.500" boxSize={6} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={headingColor}>Phone</Text>
                    <Text color={textColor}>+1 (555) 123-4567</Text>
                  </VStack>
                </HStack>

                <HStack spacing={4}>
                  <Icon as={FaGlobe} color="teal.500" boxSize={6} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={headingColor}>Online Support</Text>
                    <Text color={textColor}>Available 24/7 through our Help Center</Text>
                  </VStack>
                </HStack>

                <HStack spacing={4}>
                  <Icon as={FaClock} color="teal.500" boxSize={6} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={headingColor}>Response Time</Text>
                    <Text color={textColor}>We typically respond within 24 hours</Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>

            <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
              <Heading size="lg" color={headingColor} mb={6}>
                Frequently Asked Questions
              </Heading>
              <Text color={textColor} mb={4}>
                Check our Help Center for answers to common questions about:
              </Text>
              <VStack align="start" spacing={2}>
                <Text color={textColor}>• Account management</Text>
                <Text color={textColor}>• Payment and billing</Text>
                <Text color={textColor}>• Technical support</Text>
                <Text color={textColor}>• Platform features</Text>
              </VStack>
              <Button
                mt={4}
                colorScheme="teal"
                size="lg"
                width="full"
                as="a"
                href="/help"
              >
                Visit Help Center
              </Button>
            </Box>
          </VStack>

          {/* Contact Form */}
          <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" color={headingColor} mb={6}>
              Send us a Message
            </Heading>
            <VStack spacing={6} as="form">
              <FormControl isRequired>
                <FormLabel color={headingColor}>Name</FormLabel>
                <Input
                  placeholder="Your name"
                  size="lg"
                  bg={useColorModeValue("gray.50", "gray.800")}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={headingColor}>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  size="lg"
                  bg={useColorModeValue("gray.50", "gray.800")}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={headingColor}>Subject</FormLabel>
                <Input
                  placeholder="What&apos;s this about?"
                  size="lg"
                  bg={useColorModeValue("gray.50", "gray.800")}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={headingColor}>Message</FormLabel>
                <Textarea
                  placeholder="Your message..."
                  size="lg"
                  height="200px"
                  bg={useColorModeValue("gray.50", "gray.800")}
                />
              </FormControl>

              <Button
                colorScheme="teal"
                size="lg"
                width="full"
                type="submit"
              >
                Send Message
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ContactUs; 