import { Box, Flex, Text, Avatar, Badge, Icon } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { mentors } from "../../data/mentors";

const Cards = ({ style }) => {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollPositionRef = useRef(0);
  const navigate = useNavigate();
  
  // Function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get random mentors for recommendation (3 mentors)
  const [recommendedMentors] = useState(() => {
    const shuffled = shuffleArray(mentors);
    return shuffled.slice(0, 3);
  });

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

  const handleCardClick = (mentorId) => {
    navigate(`/mentor/${mentorId}`);
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
      onClick={() => handleCardClick(mentor.id)}
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
