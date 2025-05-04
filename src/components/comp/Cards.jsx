import { Box, Flex, Text, Avatar, Badge, Icon } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cards = ({ style }) => {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollPositionRef = useRef(0);
  const navigate = useNavigate();
  const [recommendedMentors, setRecommendedMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        // Fetch mentors from database
        const response = await axios.get('http://localhost:3001/api/mentors/browse');
        const dbMentors = response.data.map(mentor => ({
          id: mentor._id,
          name: `${mentor.firstName} ${mentor.lastName}`,
          role: mentor.jobTitle || "Mentor",
          rating: mentor.rating || 4.5,
          reviews: mentor.reviews || 0,
          expertise: mentor.skills ? mentor.skills.split(',').map(skill => skill.trim()) : [],
          image: mentor.profilePhoto ? `http://localhost:3001/uploads/mentors/${mentor.profilePhoto}` : null,
          isFromDB: true
        }));

        // Get 3 random mentors for recommendations
        const shuffled = [...dbMentors].sort(() => 0.5 - Math.random());
        setRecommendedMentors(shuffled.slice(0, 3));
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (!isPaused) {
        scrollPositionRef.current += scrollSpeed;
        
        if (scrollPositionRef.current >= container.scrollHeight - container.clientHeight) {
          scrollPositionRef.current = 0;
        }
        
        container.scrollTop = scrollPositionRef.current;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Sync initial scroll position with container
    scrollPositionRef.current = container.scrollTop;
    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused]);

  const handleCardClick = (mentor) => {
    if (mentor.isFromDB) {
      navigate(`/mentors/${mentor.id}`);
    } else {
      navigate(`/mentors/static/${mentor.id}`);
    }
  };

  const renderMentorCard = (mentor, isDuplicate = false) => (
    <Box
      key={isDuplicate ? `duplicate-${mentor.id}` : mentor.id}
      p={6}
      mb={4}
      bg="white"
      borderRadius="xl"
      boxShadow="md"
      border="1px"
      borderColor="gray.200"
      cursor="pointer"
      position="relative"
      transition="all 0.3s ease-in-out"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => handleCardClick(mentor)}
      _hover={{ 
        transform: "scale(1.05)",
        boxShadow: "xl",
        zIndex: 2
      }}
    >
      <Flex gap={4}>
        <Avatar
          size="xl"
          name={mentor.name}
          src={mentor.image}
        />
        <Box flex="1">
          <Text fontWeight="bold" fontSize="lg">{mentor.name}</Text>
          <Text color="gray.600" fontSize="md" mb={2}>{mentor.role}</Text>
          
          <Flex align="center" mb={3}>
            <Icon as={FaStar} color="yellow.400" mr={1} />
            <Text fontWeight="bold" mr={2}>{mentor.rating}</Text>
            <Text color="gray.500">({mentor.reviews} reviews)</Text>
          </Flex>

          <Flex gap={2} flexWrap="wrap">
            {mentor.expertise.map((skill, index) => (
              <Badge
                key={index}
                colorScheme="teal"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="full"
              >
                {skill}
              </Badge>
            ))}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );

  return (
    <Box
      ref={containerRef}
      height="100%"
      style={style}
      overflow="hidden"
      position="relative"
    >
      {recommendedMentors.map((mentor) => renderMentorCard(mentor))}
      {/* Duplicate cards for continuous scroll */}
      {recommendedMentors.map((mentor) => renderMentorCard(mentor, true))}
    </Box>
  );
};

Cards.propTypes = {
  style: PropTypes.object
};

export default Cards;
