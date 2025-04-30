import {
  Box,
  Container,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Link,
} from "@chakra-ui/react";
import { FaEnvelope, FaUserTie, FaUserGraduate } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const HelpCenter = () => {
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const hoverBgColor = useColorModeValue("gray.100", "gray.600");

  const mentorFaqs = [
    {
      question: "How do I become a mentor?",
      answer: "To become a mentor, click on 'Become a Mentor' in the header or footer. You'll need to fill out an application form with your professional details, experience, and areas of expertise. Our team will review your application and get back to you within 2-3 business days. Make sure to review our Mentor Guidelines before applying."
    },
    {
      question: "What are the requirements to be a mentor?",
      answer: "We look for mentors with at least 3 years of professional experience in their field, a strong track record of achievements, and a passion for helping others grow. You should be able to commit at least 1-2 hours per week for mentoring sessions."
    },
    {
      question: "How do I set up my mentor profile?",
      answer: "After your application is approved, you can create your profile by adding your professional background, areas of expertise, availability, and setting your mentoring rates. Make sure to include a professional photo and detailed description of your experience."
    },
    {
      question: "How do I manage my mentoring sessions?",
      answer: "You can manage your sessions through your mentor dashboard. Here you can view upcoming sessions, reschedule if needed, and track your earnings. All communication with mentees should be done through our platform for security and record-keeping."
    },
    {
      question: "How do I get paid for mentoring?",
      answer: "We handle all payments securely through our platform. You'll receive payments for completed sessions directly to your registered bank account. Payments are processed weekly, and you can view your earnings in your dashboard."
    }
  ];

  const menteeFaqs = [
    {
      question: "How do I find the right mentor?",
      answer: "You can search for mentors by expertise, industry, or keywords. Browse through mentor profiles to find someone whose experience aligns with your goals. You can also filter by availability, rate, and reviews from other mentees."
    },
    {
      question: "How do I book a session with a mentor?",
      answer: "Once you find a mentor you'd like to work with, you can view their availability and book a session directly through their profile. You'll need to provide payment information before the session is confirmed."
    },
    {
      question: "What should I prepare for my first session?",
      answer: "Before your first session, think about your goals and specific questions you'd like to ask. Share relevant background information with your mentor and be ready to discuss what you hope to achieve through the mentorship."
    },
    {
      question: "How long do mentoring sessions last?",
      answer: "Sessions typically last 30-60 minutes, depending on the mentor's availability and your needs. You can discuss the ideal session length with your mentor before booking."
    },
    {
      question: "What if I need to cancel or reschedule a session?",
      answer: "You can cancel or reschedule sessions up to 24 hours before the scheduled time through your dashboard. Late cancellations may be subject to the mentor's cancellation policy."
    },
    {
      question: "How do I get started as a mentee?",
      answer: (
        <>
          To get started as a mentee:
          <br />
          1. Create an account and complete your profile
          <br />
          2. Browse mentors in your area of interest
          <br />
          3. Send connection requests to mentors you&apos;d like to work with
          <br />
          4. Once connected, schedule your first session
          <br />
          5. Review our <Link as={RouterLink} to="/mentee-guidelines" color="blue.500">Mentee Guidelines</Link> for best practices
        </>
      )
    }
  ];

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="6xl">
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Heading
            size="2xl"
            color={headingColor}
            fontWeight="bold"
            lineHeight="1.2"
          >
            How can we help you?
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="3xl">
            Find answers to common questions or contact our support team for assistance.
          </Text>
        </VStack>

        {/* FAQ Sections */}
        <Box mb={20}>
          <HStack spacing={8} mb={8}>
            <Box flex="1">
              <HStack mb={6}>
                <Icon as={FaUserTie} w={6} h={6} color="teal.500" />
                <Heading size="lg" color={headingColor}>
                  For Mentors
                </Heading>
              </HStack>
              <Accordion allowMultiple>
                {mentorFaqs.map((faq, index) => (
                  <AccordionItem key={index} border="none" mb={4}>
                    <AccordionButton
                      bg={cardBgColor}
                      p={4}
                      borderRadius="md"
                      _hover={{ bg: hoverBgColor }}
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="bold">{faq.question}</Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} bg={cardBgColor} borderRadius="md" mt={1}>
                      <Text color={textColor}>{faq.answer}</Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>

            <Box flex="1">
              <HStack mb={6}>
                <Icon as={FaUserGraduate} w={6} h={6} color="teal.500" />
                <Heading size="lg" color={headingColor}>
                  For Mentees
                </Heading>
              </HStack>
              <Accordion allowMultiple>
                {menteeFaqs.map((faq, index) => (
                  <AccordionItem key={index} border="none" mb={4}>
                    <AccordionButton
                      bg={cardBgColor}
                      p={4}
                      borderRadius="md"
                      _hover={{ bg: hoverBgColor }}
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="bold">{faq.question}</Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} bg={cardBgColor} borderRadius="md" mt={1}>
                      <Text color={textColor}>{faq.answer}</Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          </HStack>
        </Box>

        {/* Contact Support Section */}
        <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
          <HStack mb={6}>
            <Icon as={FaEnvelope} w={6} h={6} color="teal.500" />
            <Heading size="lg" color={headingColor}>
              Contact Support
            </Heading>
          </HStack>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Your email address" />
            </FormControl>
            <FormControl>
              <FormLabel>Subject</FormLabel>
              <Input type="text" placeholder="What can we help you with?" />
            </FormControl>
            <FormControl>
              <FormLabel>Message</FormLabel>
              <Textarea placeholder="Describe your issue or question in detail" rows={6} />
            </FormControl>
            <Button colorScheme="teal" size="lg">
              Send Message
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default HelpCenter; 