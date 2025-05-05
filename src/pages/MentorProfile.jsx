import { useParams, useNavigate } from "react-router-dom";
import { mentors as staticMentors } from "../data/mentors";
import { 
  Box, 
  Image, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Badge, 
  Icon, 
  Divider, 
  Stack, 
  Button, 
  useColorModeValue,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { 
  StarIcon, 
  TimeIcon, 
  CheckIcon,
  CalendarIcon,
  InfoIcon
} from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { InlineWidget } from "react-calendly";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import RatingModal from "../components/comp/RatingModal";

const MentorProfile = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { isOpen: isScheduleOpen, onOpen: onScheduleOpen, onClose: onScheduleClose } = useDisclosure();
  const { isOpen: isRatingOpen, onOpen: onRatingOpen, onClose: onRatingClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const testimonialBg = useColorModeValue("white", "gray.800");
  const { user } = useAuth();

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if this is a static mentor
        if (mentorId.startsWith('static/')) {
          const staticId = parseInt(mentorId.split('/')[1]);
          const staticMentor = staticMentors.find(m => m.id === staticId);
          
          if (!staticMentor) {
            throw new Error("Mentor not found");
          }

          // Transform static mentor data to match the expected format
          const mentorWithDefaults = {
            ...staticMentor,
            about: staticMentor.about || "No description available",
            plans: staticMentor.plans || [],
            sessions: staticMentor.sessions || [],
            testimonials: staticMentor.testimonials || [],
            articles: staticMentor.articles || [],
            experience: staticMentor.experience || [],
            education: staticMentor.education || [],
            certifications: staticMentor.certifications || [],
            expertiseDetails: staticMentor.expertiseDetails || [],
            languages: staticMentor.languages || [],
            calendlyUrl: staticMentor.calendlyUrl || null,
            responseTime: staticMentor.responseTime || "Not specified",
            lastActive: staticMentor.lastActive || "Recently"
          };

          setMentor(mentorWithDefaults);
          return;
        }

        // If not static, try to fetch by ID first
        try {
          const response = await axios.get(`http://localhost:3001/api/mentors/profile/${mentorId}`);
          const mentorData = response.data;
          
          const mentorWithDefaults = {
            ...mentorData,
            name: `${mentorData.firstName} ${mentorData.lastName}`,
            about: mentorData.bio || "No description available",
            role: mentorData.jobTitle || "Mentor",
            image: mentorData.profilePhoto ? `http://localhost:3001${mentorData.profilePhoto}` : null,
            plans: mentorData.plans || [],
            sessions: mentorData.sessions || [],
            testimonials: mentorData.testimonials || [],
            articles: mentorData.articles || [],
            experience: mentorData.experience || [],
            education: mentorData.education || [],
            certifications: mentorData.certifications || [],
            expertiseDetails: mentorData.expertiseDetails || [],
            languages: mentorData.languages || [],
            expertise: mentorData.skills ? mentorData.skills.split(',').map(skill => skill.trim()) : [],
            calendlyUrl: mentorData.calendlyUrl || null,
            rating: mentorData.rating || 0,
            reviews: mentorData.reviews || 0,
            responseTime: mentorData.responseTime || "Not specified",
            lastActive: mentorData.lastActive ? new Date(mentorData.lastActive).toLocaleDateString() : "Recently"
          };

          setMentor(mentorWithDefaults);
        } catch (error) {
          console.error('Error fetching mentor by ID:', error);
          throw error; // Re-throw to be caught by outer catch
        }
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        setError(error.response?.data?.message || "Error loading mentor profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (mentorId) {
      fetchMentorData();
    }
  }, [mentorId, refreshKey]);

  const handleProfileUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleScheduleCall = (plan = null, session = null) => {
    if (!mentor?.calendlyUrl) {
      setError("Scheduling is not available for this mentor");
      return;
    }
    setSelectedPlan(plan);
    setSelectedSession(session);
    onScheduleOpen();
  };

  const getCalendlyUrl = () => {
    if (!mentor?.calendlyUrl) return "";
    if (selectedPlan) {
      return `${mentor.calendlyUrl}/${selectedPlan.calendlyEventType}`;
    }
    if (selectedSession) {
      return `${mentor.calendlyUrl}/${selectedSession.calendlyEventType}`;
    }
    return mentor.calendlyUrl;
  };

  const handleRatingSubmit = (newRating) => {
    // Update the local state with the new rating
    setMentor(prev => ({
      ...prev,
      rating: ((prev.rating * prev.reviews) + newRating) / (prev.reviews + 1),
      reviews: prev.reviews + 1
    }));
  };

  if (isLoading) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" thickness="4px" />
          <Text>Loading mentor profile...</Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Box p={8} textAlign="center">
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
        <Button colorScheme="teal" onClick={() => navigate("/browse")}>
          Browse Other Mentors
        </Button>
      </Box>
    );
  }

  if (!mentor) {
    return (
      <Box p={8} textAlign="center">
        <Alert status="warning">
          <AlertIcon />
          Mentor not found
        </Alert>
        <Button mt={4} colorScheme="teal" onClick={() => navigate("/browse")}>
          Browse Other Mentors
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        {/* Left Column - Main Content */}
        <GridItem colSpan={8}>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box>
              <Heading size="xl">{mentor.name}</Heading>
              <Text fontSize="lg" color="gray.600" mt={1}>
                {mentor.role}
              </Text>
              <HStack mt={2} spacing={4}>
                <HStack>
                  <Icon as={StarIcon} color="yellow.400" />
                  <Text color="gray.600">{mentor.rating.toFixed(1)} ({mentor.reviews} reviews)</Text>
                  {user?.role === 'mentee' && (
                    <Button
                      size="sm"
                      colorScheme="yellow"
                      leftIcon={<StarIcon />}
                      onClick={onRatingOpen}
                      ml={2}
                    >
                      Rate Mentor
                    </Button>
                  )}
                </HStack>
                {mentor.responseTime && (
                  <HStack>
                    <Icon as={TimeIcon} color="teal.500" />
                    <Text>{mentor.responseTime}</Text>
                  </HStack>
                )}
                {mentor.lastActive && (
                  <HStack>
                    <Icon as={CalendarIcon} color="teal.500" />
                    <Text>{mentor.lastActive}</Text>
                  </HStack>
                )}
              </HStack>
            </Box>

            <Divider />

            {/* Skills */}
            <Box>
              <Heading size="md" mb={3}>Skills</Heading>
              <Flex wrap="wrap" gap={2}>
                {mentor.expertise.map((skill, index) => (
                  <Badge key={index} colorScheme="teal" px={2} py={1}>
                    {skill}
                  </Badge>
                ))}
              </Flex>
            </Box>

            <Divider />

            {/* Tabs */}
            <Tabs variant="enclosed">
              <TabList>
                <Tab>About</Tab>
                <Tab>Experience</Tab>
                <Tab>Education</Tab>
                <Tab>Expertise</Tab>
                {mentor.plans && mentor.plans.length > 0 && <Tab>Mentorship Plans</Tab>}
                {mentor.sessions && mentor.sessions.length > 0 && <Tab>One-off Sessions</Tab>}
                {mentor.testimonials && mentor.testimonials.length > 0 && <Tab>Testimonials</Tab>}
                {mentor.articles && mentor.articles.length > 0 && <Tab>Articles</Tab>}
              </TabList>

              <TabPanels>
                {/* About Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Text fontSize="md" color="gray.700" whiteSpace="pre-line">
                        {mentor.about}
                      </Text>
                    </Box>

                    {mentor.languages && (
                      <Box mt={4}>
                        <Heading size="md" mb={3}>Languages</Heading>
                        <Flex wrap="wrap" gap={2}>
                          {mentor.languages.map((lang, index) => (
                            <Badge 
                              key={index} 
                              colorScheme="purple" 
                              p={2} 
                              borderRadius="md"
                            >
                              {lang.language} - {lang.proficiency}
                            </Badge>
                          ))}
                        </Flex>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                {/* Experience Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="md" mb={4}>Professional Experience</Heading>
                      <VStack spacing={4} align="stretch">
                        {mentor.experience?.map((exp, index) => (
                          <Box key={index} p={4} borderWidth={1} borderRadius="md" bg={cardBg}>
                            <Heading size="sm">{exp.role}</Heading>
                            <Text color="gray.600" fontSize="sm">{exp.company}</Text>
                            <Text color="gray.500" fontSize="sm">{exp.duration}</Text>
                            <Text mt={2}>{exp.description}</Text>
                            {exp.achievements && (
                              <VStack align="stretch" mt={2} spacing={1}>
                                {exp.achievements.map((achievement, idx) => (
                                  <HStack key={idx}>
                                    <Icon as={CheckIcon} color="green.500" />
                                    <Text fontSize="sm">{achievement}</Text>
                                  </HStack>
                                ))}
                              </VStack>
                            )}
                          </Box>
                        )) || (
                          <Text color="gray.600">Experience details will be updated soon.</Text>
                        )}
                      </VStack>
                    </Box>

                    <Box>
                      <Heading size="md" mb={4}>Certifications & Achievements</Heading>
                      <VStack spacing={4} align="stretch">
                        {mentor.certifications?.map((cert, index) => (
                          <Box key={index} p={4} borderWidth={1} borderRadius="md" bg={cardBg}>
                            <Heading size="sm">{cert.name}</Heading>
                            <Text color="gray.600" fontSize="sm">{cert.issuer}</Text>
                            <Text color="gray.500" fontSize="sm">{cert.year}</Text>
                            {cert.description && (
                              <Text mt={2} fontSize="sm">{cert.description}</Text>
                            )}
                          </Box>
                        )) || (
                          <Text color="gray.600">Certification details will be updated soon.</Text>
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Education Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="md" mb={4}>Education</Heading>
                      <VStack spacing={4} align="stretch">
                        {mentor.education?.map((edu, index) => (
                          <Box key={index} p={4} borderWidth={1} borderRadius="md" bg={cardBg}>
                            <Heading size="sm">{edu.degree}</Heading>
                            <Text color="gray.600" fontSize="sm">{edu.institution}</Text>
                            <Text color="gray.500" fontSize="sm">{edu.year}</Text>
                            {edu.achievements && (
                              <Text mt={2} fontSize="sm">{edu.achievements}</Text>
                            )}
                            {edu.courses && (
                              <Box mt={3}>
                                <Text fontSize="sm" fontWeight="bold" mb={2}>Key Courses:</Text>
                                <Flex wrap="wrap" gap={2}>
                                  {edu.courses.map((course, idx) => (
                                    <Badge key={idx} colorScheme="teal">
                                      {course}
                                    </Badge>
                                  ))}
                                </Flex>
                              </Box>
                            )}
                          </Box>
                        )) || (
                          <Text color="gray.600">Education details will be updated soon.</Text>
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Expertise Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="md" mb={4}>Areas of Expertise</Heading>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        {mentor.expertiseDetails?.map((area, index) => (
                          <Box key={index} p={4} borderWidth={1} borderRadius="md" bg={cardBg}>
                            <Heading size="sm" mb={2}>{area.category}</Heading>
                            <VStack align="stretch" spacing={2}>
                              {area.skills.map((skill, idx) => (
                                <HStack key={idx}>
                                  <Icon as={CheckIcon} color="green.500" />
                                  <Text fontSize="sm">{skill}</Text>
                                </HStack>
                              ))}
                            </VStack>
                          </Box>
                        )) || (
                          <Text color="gray.600">Detailed expertise information will be updated soon.</Text>
                        )}
                      </Grid>
                    </Box>

                    <Box>
                      <Heading size="md" mb={3}>Skills & Technologies</Heading>
                      <Flex wrap="wrap" gap={2}>
                        {mentor.expertise.map((skill, index) => (
                          <Badge key={index} colorScheme="teal" px={2} py={1}>
                            {skill}
                          </Badge>
                        ))}
                      </Flex>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Mentorship Plans Tab */}
                {mentor.plans && mentor.plans.length > 0 && (
                  <TabPanel>
                    <Stack spacing={4}>
                      {mentor.plans.map((plan, index) => (
                        <Box
                          key={index}
                          p={4}
                          borderWidth={1}
                          borderRadius="md"
                          boxShadow="md"
                          bg={cardBg}
                        >
                          <HStack justify="space-between">
                            <Heading size="sm">{plan.name}</Heading>
                            <Badge colorScheme="green" fontSize="sm">
                              {plan.spotsLeft} spots left
                            </Badge>
                          </HStack>
                          <Text fontWeight="bold" color="teal.500" my={2}>
                            ${plan.price}/month
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            {plan.description}
                          </Text>
                          <VStack align="stretch" spacing={1}>
                            {plan.features.map((feature, idx) => (
                              <HStack key={idx} spacing={2}>
                                <Icon as={CheckIcon} color="green.500" />
                                <Text fontSize="sm" color="gray.600">
                                  {feature}
                                </Text>
                              </HStack>
                            ))}
                          </VStack>
                          <Button 
                            mt={4} 
                            colorScheme="teal" 
                            size="sm" 
                            width="full"
                            onClick={() => handleScheduleCall(plan)}
                          >
                            Book Now
                          </Button>
                        </Box>
                      ))}
                    </Stack>
                  </TabPanel>
                )}

                {/* One-off Sessions Tab */}
                {mentor.sessions && mentor.sessions.length > 0 && (
                  <TabPanel>
                    <Stack spacing={4}>
                      {mentor.sessions.map((session, index) => (
                        <Box
                          key={index}
                          p={4}
                          borderWidth={1}
                          borderRadius="md"
                          boxShadow="md"
                          bg={cardBg}
                        >
                          <HStack justify="space-between">
                            <Heading size="sm">{session.name}</Heading>
                            <Text fontSize="sm" color="gray.500">
                              {session.duration}
                            </Text>
                          </HStack>
                          <Text fontWeight="bold" color="teal.500" my={2}>
                            ${session.price}
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            {session.description}
                          </Text>
                          <Button 
                            mt={2} 
                            colorScheme="teal" 
                            size="sm" 
                            width="full"
                            onClick={() => handleScheduleCall(null, session)}
                          >
                            Book Session
                          </Button>
                        </Box>
                      ))}
                    </Stack>
                  </TabPanel>
                )}

                {/* Testimonials Tab */}
                {mentor.testimonials && mentor.testimonials.length > 0 && (
                  <TabPanel>
                    <Stack spacing={4}>
                      {mentor.testimonials.map((testimonial, index) => (
                        <Box
                          key={index}
                          p={4}
                          borderWidth={1}
                          borderRadius="md"
                          boxShadow="sm"
                          bg={testimonialBg}
                        >
                          <HStack justify="space-between" mb={2}>
                            <Text fontWeight="bold">{testimonial.name}</Text>
                            <HStack>
                              <Icon as={StarIcon} color="yellow.400" />
                              <Text>{testimonial.rating}</Text>
                            </HStack>
                          </HStack>
                          <Text fontSize="sm" color="gray.500" mb={2}>
                            {testimonial.plan} • {testimonial.duration}
                          </Text>
                          <Text fontSize="sm" color="gray.700" fontStyle="italic">
                            &ldquo;{testimonial.content}&rdquo;
                          </Text>
                          <Text fontSize="xs" color="gray.500" mt={2}>
                            {testimonial.date}
                          </Text>
                        </Box>
                      ))}
                    </Stack>
                  </TabPanel>
                )}

                {/* Articles Tab */}
                {mentor.articles && mentor.articles.length > 0 && (
                  <TabPanel>
                    <Stack spacing={4}>
                      {mentor.articles.map((article, index) => (
                        <Box
                          key={index}
                          p={4}
                          borderWidth={1}
                          borderRadius="md"
                          boxShadow="sm"
                          bg={testimonialBg}
                        >
                          <HStack spacing={2} mb={2}>
                            <Badge colorScheme="blue">{article.type}</Badge>
                            <Heading size="sm">{article.title}</Heading>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {article.description}
                          </Text>
                        </Box>
                      ))}
                    </Stack>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </VStack>
        </GridItem>

        {/* Right Column - Sidebar */}
        <GridItem colSpan={4}>
          <VStack spacing={4} align="stretch">
            {/* Profile Image - move above Schedule Call */}
            <Box textAlign="center" mb={2}>
              <Image
                borderRadius="full"
                boxSize="180px"
                src={mentor.image}
                alt={mentor.name}
                mx="auto"
                objectFit="cover"
                border="4px solid #e2e8f0"
                boxShadow="lg"
              />
            </Box>
            {/* Contact Actions */}
            <Box p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
              <VStack spacing={3}>
                <Button 
                  leftIcon={<CalendarIcon />} 
                  colorScheme="teal" 
                  width="full"
                  onClick={() => handleScheduleCall()}
                >
                  Schedule Call
                </Button>
                <Button 
                  leftIcon={<InfoIcon />} 
                  colorScheme="gray" 
                  width="full"
                  onClick={() => navigate("/browse")}
                >
                  Browse Other Mentors
                </Button>
              </VStack>
            </Box>

            {/* Quick Stats */}
            <Box p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
              <VStack spacing={3} align="stretch">
                {mentor.responseTime && (
                  <HStack>
                    <Icon as={TimeIcon} color="teal.500" />
                    <Text>Response Time: {mentor.responseTime}</Text>
                  </HStack>
                )}
                {mentor.lastActive && (
                  <HStack>
                    <Icon as={CalendarIcon} color="teal.500" />
                    <Text>Last Active: {mentor.lastActive}</Text>
                  </HStack>
                )}
                <HStack>
                  <Icon as={StarIcon} color="teal.500" />
                  <Text>Rating: {mentor.rating} ({mentor.reviews} reviews)</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </GridItem>
      </Grid>

      {/* Rating Modal */}
      {mentor && (
        <RatingModal
          isOpen={isRatingOpen}
          onClose={onRatingClose}
          mentorId={mentorId}
          mentorName={mentor.name}
          onRatingSubmit={handleRatingSubmit}
        />
      )}

      {/* Scheduling Modal */}
      <Modal isOpen={isScheduleOpen} onClose={onScheduleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule a Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {mentor?.calendlyUrl ? (
              <InlineWidget url={getCalendlyUrl()} />
            ) : (
              <Alert status="warning">
                <AlertIcon />
                Scheduling is not available for this mentor
              </Alert>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MentorProfile;
