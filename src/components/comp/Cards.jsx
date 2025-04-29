import { Box, Flex, Text, Avatar, Badge, Icon } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const mentors = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Product Manager at Google",
    rating: 4.9,
    reviews: 127,
    expertise: ["Product Strategy", "User Research", "Agile"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Engineering Lead at Microsoft",
    rating: 4.8,
    reviews: 94,
    expertise: ["System Design", "Leadership", "Cloud Architecture"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "UX Design Director at Apple",
    rating: 5.0,
    reviews: 156,
    expertise: ["UI/UX", "Design Systems", "User Testing"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Data Science Manager at Amazon",
    rating: 4.7,
    reviews: 83,
    expertise: ["Machine Learning", "Analytics", "Python"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  }
];

const Cards = ({ style }) => {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollPositionRef = useRef(0);
  const navigate = useNavigate();

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
      {mentors.map((mentor) => renderMentorCard(mentor))}
      {/* Duplicate cards for continuous scroll */}
      {mentors.map((mentor) => renderMentorCard(mentor, true))}
    </Box>
  );
};

Cards.propTypes = {
  style: PropTypes.object
};

export default Cards;
