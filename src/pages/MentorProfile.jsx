import { useParams } from "react-router-dom";
import { Box, Image, Heading, Text, VStack, HStack, Badge, Icon, Divider, Stack, Button, useColorModeValue } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

// Dummy mentor data for display (replace with API data later)
const dummyMentor = {
  name: "Sanskruti Lohade",
  title: "Data Scientist | AI/ML Enthusiast",
  location: "India",
  rating: 5.0,
  image:
    "https://static.vecteezy.com/system/resources/previews/012/177/622/original/man-avatar-isolated-png.png",
  expertise: ["Python", "Data Science", "Machine Learning", "AI", "SQL"],
  about:
    "Hi! I'm Sanskruti, a Data Scientist passionate about helping aspiring professionals break into AI/ML. With over 3 years of industry experience, I can help you with project guidance, mock interviews, and career coaching.",
  plans: [
    {
      name: "Monthly Mentorship",
      price: "₹1,999/mo",
      description:
        "Ongoing mentorship with regular check-ins, guidance, and support.",
      features: [
        "2 video calls/month",
        "Unlimited chat support",
        "Code reviews",
        "Project feedback",
      ],
    },
    {
      name: "One-Time Call",
      price: "₹499",
      description: "A 30-minute one-on-one session to discuss any topic.",
      features: ["30-minute call", "Q&A", "Career guidance"],
    },
  ],
  testimonials: [
    {
      name: "Yash Chaware",
      feedback:
        "Sanskruti is an excellent mentor! She helped me crack my data science interview and improve my portfolio. Highly recommended!",
    },
    {
      name: "Rohit Patil",
      feedback:
        "Really enjoyed my session! She explained complex ML concepts in a simple way and provided great learning resources.",
    },
  ],
};

const MentorProfile = () => {
  const { mentorId } = useParams(); // Get mentor ID from URL

  // For now, we'll use the dummy mentor data
  // Later, you can fetch real data based on mentorId
  const mentor = dummyMentor;

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack spacing={6} align="center">
          <Image
            borderRadius="full"
            boxSize="120px"
            src={mentor.image}
            alt={mentor.name}
          />
          <Box>
            <Heading size="lg">{mentor.name}</Heading>
            <Text fontSize="md" color="gray.600">
              {mentor.title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {mentor.location}
            </Text>
            <HStack mt={1}>
              <Icon as={StarIcon} color="green.400" />
              <Text color="green.600">{mentor.rating}</Text>
            </HStack>
            <HStack mt={2} spacing={2}>
              {mentor.expertise.map((skill, index) => (
                <Badge key={index} colorScheme="teal">
                  {skill}
                </Badge>
              ))}
            </HStack>
          </Box>
        </HStack>

        <Divider />

        {/* About Section */}
        <Box>
          <Heading size="md" mb={2}>
            About Me
          </Heading>
          <Text fontSize="md" color="gray.700">
            {mentor.about}
          </Text>
        </Box>

        <Divider />

        {/* Mentorship Plans */}
        <Box>
          <Heading size="md" mb={3}>
            Mentorship Plans
          </Heading>
          <Stack spacing={4}>
            {mentor.plans.map((plan, index) => (
              <Box
                key={index}
                p={4}
                borderWidth={1}
                borderRadius="md"
                boxShadow="md"
                bg={useColorModeValue("gray.50", "gray.700")}
              >
                <Heading size="sm" mb={1}>
                  {plan.name}
                </Heading>
                <Text fontWeight="bold" color="teal.500" mb={1}>
                  {plan.price}
                </Text>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {plan.description}
                </Text>
                <ul style={{ paddingLeft: "20px" }}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <Text fontSize="sm" color="gray.600">
                        • {feature}
                      </Text>
                    </li>
                  ))}
                </ul>
                <Button mt={3} colorScheme="teal" size="sm">
                  Book Now
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>

        <Divider />

        {/* Testimonials */}
        <Box>
          <Heading size="md" mb={3}>
            Testimonials
          </Heading>
          <Stack spacing={4}>
            {mentor.testimonials.map((testimonial, index) => (
              <Box
                key={index}
                p={4}
                borderWidth={1}
                borderRadius="md"
                boxShadow="sm"
                bg={useColorModeValue("white", "gray.800")}
              >
                <Text fontSize="sm" color="gray.700" fontStyle="italic">
                  "{testimonial.feedback}"
                </Text>
                <Text fontWeight="bold" mt={2}>
                  — {testimonial.name}
                </Text>
              </Box>
            ))}
          </Stack>
        </Box>
      </VStack>
    </Box>
  );
};

export default MentorProfile;
