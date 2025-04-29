import {Badge, Box, Button, HStack, Image, Card, CardHeader, CardBody, CardFooter, Heading, Text, VStack, Icon } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { StarIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const mentors = [
  { 
    name: "Sanskruti Lohade", 
    title: "Data Scientist", 
    expertise: ["Data Science", "Python"], 
    rating: 5.0, 
    image: "https://static.vecteezy.com/system/resources/previews/012/177/622/original/man-avatar-isolated-png.png",
    profileLink: "/mentors/sanskruti"
  },
  { 
    name: "Yash Chaware", 
    title: "React Developer", 
    expertise: ["React", "Python"], 
    rating: 4.8, 
    image: "https://passport-photo.in/_next/static/media/IndianMan.99521520.png",
    profileLink: "/mentors/yash"
  },
  { 
    name: "Yash Chaware", 
    title: "React Developer", 
    expertise: ["React", "Python"], 
    rating: 4.8, 
    image: "https://passport-photo.in/_next/static/media/IndianMan.99521520.png",
    profileLink: "/mentors/yash"
  },

  { 
    name: "Yash Chaware", 
    title: "React Developer", 
    expertise: ["React", "Python"], 
    rating: 4.8, 
    image: "https://passport-photo.in/_next/static/media/IndianMan.99521520.png",
    profileLink: "/mentors/yash"
  },
  { 
    name: "Yash Chaware", 
    title: "React Developer", 
    expertise: ["React", "Python"], 
    rating: 4.8, 
    image: "https://passport-photo.in/_next/static/media/IndianMan.99521520.png",
    profileLink: "/mentors/yash"
  },
  { 
    name: "Yash Chaware", 
    title: "React Developer", 
    expertise: ["React", "Python"], 
    rating: 4.8, 
    image: "https://passport-photo.in/_next/static/media/IndianMan.99521520.png",
    profileLink: "/mentors/yash"
  },

];

const MentorCard = ({ mentor }) => {
  const navigate = useNavigate();

  return (
    
    <Card
      display="flex"
      flexDirection="row"
      alignItems="center"
      p={4}
      boxShadow="md"
      borderRadius="lg"
      w="100%"
      cursor="pointer"
      transition="all 0.3s ease-in-out"
      _hover={{ transform: "scale(1.03)", boxShadow: "xl" }}
      onClick={() => navigate(mentor.profileLink)}
    >
      <Image borderRadius="full" boxSize="60px" src={mentor.image} alt={mentor.name} />
      
      <Box ml={4} flex="1">
        <CardHeader p={0} display="flex" alignItems="center">
          <Heading size="sm">{mentor.name}</Heading>
          <HStack ml={2}>
            <Icon as={StarIcon} color="green.400" />
            <Text fontSize="sm" color="green.500">{mentor.rating}</Text>
          </HStack>
        </CardHeader>

        <CardBody p={0}>
          <Text fontSize="sm" color="gray.500">{mentor.title}</Text>
          <HStack mt={2}>
            {mentor.expertise.map((skill, i) => (
              <Badge key={i} colorScheme="gray" variant="subtle">{skill}</Badge>
            ))}
          </HStack>
        </CardBody>

        <CardFooter p={0} mt={2.5} h="30px">
          <Button 
            colorScheme="teal" 
            size="sm" 
            h="24px" 
            onClick={(e) => { 
              e.stopPropagation(); 
              navigate(`/mentors/${mentor.profileLink.split("/").pop()}`); 
            }}          >
            View Profile
          </Button>
        </CardFooter>
      </Box>
    </Card>
    
  );
};

MentorCard.propTypes = {
  mentor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    expertise: PropTypes.arrayOf(PropTypes.string).isRequired,
    rating: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    profileLink: PropTypes.string.isRequired,
  }).isRequired,
};


export const Cards = () => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
  if (!scrollContainer) return;

  let scrollInterval;
  const startScrolling = () => {
    scrollInterval = setInterval(() => {
      if (!isHovered) {
        scrollContainer.scrollTop += 1;
        // scrollContainer.scrollBy({ top: 1, behavior: "smooth" }); // Ensures smooth scrolling
        if (scrollContainer.scrollTop >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          scrollContainer.scrollTop = 0; // Reset to top when reaching bottom
        }
      }
    }, 20);
    };

    startScrolling();
    return () => clearInterval(scrollInterval);
  }, [isHovered]);

  return (
    <Box 
    display="flex"
    flexDirection="column"
    justifyContent="flex-start"
    position="fixed"  
    right="0" 
    top="100px"  /* Adjust top so it does not enter header */
    width="25%" 
    maxHeight="70vh" /* Prevents it from covering the entire screen */
    overflowY="auto" /* Enables scrolling */
    scrollBehavior="smooth"
    p={5}
    >
      {/* Scrolling Cards on Right Side */}
        <Box 
          maxHeight="100%" 
          overflow="auto"
          ref={scrollRef} 
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}
          style={{ overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none"}}
        >
          <VStack spacing={4} align="center">
            {mentors.map((mentor, index) => (
              <MentorCard key={index} mentor={mentor} />
            ))}
          </VStack>
        </Box>
      </Box>
  );
};

export default Cards;
