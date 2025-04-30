import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  useColorModeValue,
  VStack,
  Image,
} from "@chakra-ui/react";
import { FaUsers, FaHandshake, FaLightbulb, FaChartLine } from "react-icons/fa";
import PropTypes from "prop-types";

const Feature = ({ title, text, icon }) => {
  const iconColor = useColorModeValue("teal.500", "teal.300");
  return (
    <VStack
      align="start"
      p={6}
      bg={useColorModeValue("white", "gray.700")}
      rounded="lg"
      shadow="md"
      _hover={{ transform: "translateY(-5px)", transition: "all 0.3s" }}
    >
      <Icon as={icon} w={10} h={10} color={iconColor} />
      <Heading size="md" mt={4} mb={2}>
        {title}
      </Heading>
      <Text color={useColorModeValue("gray.600", "gray.400")}>{text}</Text>
    </VStack>
  );
};

Feature.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

const AboutUs = () => {
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.700");

  const teamMembers = [
    {
      name: "John Doe",
      role: "Founder & CEO",
      image: "https://bit.ly/dan-abramov",
    },
    {
      name: "Jane Smith",
      role: "Head of Mentorship",
      image: "https://bit.ly/kent-c-dodds",
    },
    {
      name: "Mike Johnson",
      role: "Tech Lead",
      image: "https://bit.ly/ryan-florence",
    },
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
            Connecting Minds, Shaping Futures
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="3xl">
            Mentor Connect is a platform dedicated to bridging the gap between
            experienced professionals and aspiring individuals through meaningful
            mentorship relationships.
          </Text>
        </VStack>

        {/* Mission Section */}
        <Box mb={20}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <VStack align="start" spacing={6}>
              <Heading size="lg" color={headingColor}>
                Our Mission
              </Heading>
              <Text fontSize="lg" color={textColor}>
                We believe that everyone deserves access to quality mentorship.
                Our mission is to create a platform where knowledge and
                experience can be shared freely, helping individuals grow both
                personally and professionally.
              </Text>
              <Text fontSize="lg" color={textColor}>
                By connecting mentors and mentees, we&apos;re building a community
                that fosters learning, growth, and success for all.
              </Text>
            </VStack>
            <Box bg={cardBgColor} p={8} rounded="lg" shadow="md">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Team collaboration"
                rounded="lg"
                objectFit="cover"
                h="100%"
              />
            </Box>
          </SimpleGrid>
        </Box>

        {/* Features Section */}
        <Box mb={20}>
          <Heading
            size="lg"
            textAlign="center"
            mb={12}
            color={headingColor}
          >
            Why Choose Mentor Connect?
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            <Feature
              icon={FaUsers}
              title="Diverse Community"
              text="Connect with professionals from various industries and backgrounds."
            />
            <Feature
              icon={FaHandshake}
              title="Personalized Matching"
              text="Our smart algorithm matches you with the perfect mentor or mentee."
            />
            <Feature
              icon={FaLightbulb}
              title="Knowledge Sharing"
              text="Share expertise and gain insights from experienced professionals."
            />
            <Feature
              icon={FaChartLine}
              title="Growth Focused"
              text="Track your progress and achieve your personal and professional goals."
            />
          </SimpleGrid>
        </Box>

        {/* Team Section */}
        <Box>
          <Heading
            size="lg"
            textAlign="center"
            mb={12}
            color={headingColor}
          >
            Our Team
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {teamMembers.map((member) => (
              <VStack
                key={member.name}
                bg={cardBgColor}
                p={6}
                rounded="lg"
                shadow="md"
                spacing={4}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  rounded="full"
                  boxSize="150px"
                  objectFit="cover"
                />
                <VStack spacing={1}>
                  <Heading size="md" color={headingColor}>
                    {member.name}
                  </Heading>
                  <Text color={textColor}>{member.role}</Text>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs; 