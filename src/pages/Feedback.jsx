import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  useColorModeValue,
  Radio,
  RadioGroup,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaStar, FaThumbsUp, FaBug, FaLightbulb } from "react-icons/fa";

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("5");
  const toast = useToast();

  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.700");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log({
      feedbackType,
      name,
      email,
      subject,
      message,
      rating,
    });

    // Show success message
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! We'll review it soon.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    // Reset form
    setFeedbackType("suggestion");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setRating("5");
  };

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
            Share Your Feedback
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="2xl">
            We value your input! Help us improve MentorMe by sharing your thoughts,
            suggestions, or reporting any issues you encounter.
          </Text>
        </VStack>

        <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Type of Feedback</FormLabel>
                <RadioGroup
                  value={feedbackType}
                  onChange={setFeedbackType}
                  colorScheme="teal"
                >
                  <Stack direction="row" spacing={8}>
                    <Radio value="suggestion">
                      <HStack>
                        <Icon as={FaLightbulb} />
                        <Text>Suggestion</Text>
                      </HStack>
                    </Radio>
                    <Radio value="bug">
                      <HStack>
                        <Icon as={FaBug} />
                        <Text>Bug Report</Text>
                      </HStack>
                    </Radio>
                    <Radio value="general">
                      <HStack>
                        <Icon as={FaThumbsUp} />
                        <Text>General Feedback</Text>
                      </HStack>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Your Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Subject</FormLabel>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your feedback"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please provide detailed feedback..."
                  rows={6}
                />
              </FormControl>

              {feedbackType === "general" && (
                <FormControl>
                  <FormLabel>How would you rate your experience?</FormLabel>
                  <RadioGroup
                    value={rating}
                    onChange={setRating}
                    colorScheme="teal"
                  >
                    <Stack direction="row" spacing={4}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Radio key={value} value={value.toString()}>
                          <HStack>
                            <Icon as={FaStar} color="yellow.400" />
                            <Text>{value}</Text>
                          </HStack>
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </FormControl>
              )}

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="full"
                mt={4}
              >
                Submit Feedback
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Feedback; 