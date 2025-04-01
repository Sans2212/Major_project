import { useParams } from "react-router-dom";
import { Box, Image, Heading, Text, VStack, HStack, Badge, Icon } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

// Dummy Mentor Data (Should match the structure in Cards.jsx)
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
  }
];

const MentorProfile = () => {
  const { mentorId } = useParams(); // Get mentor ID from URL
  const mentor = mentors.find((m) => m.profileLink === `/mentors/${mentorId}`);

  if (!mentor) {
    return <Text fontSize="xl" color="red.500">Mentor not found</Text>;
  }

  return (
    <VStack spacing={4} p={5} align="center">
      <Image borderRadius="full" boxSize="120px" src={mentor.image} alt={mentor.name} />
      <Heading size="lg">{mentor.name}</Heading>
      <Text fontSize="md" color="gray.500">{mentor.title}</Text>

      <HStack>
        <Icon as={StarIcon} color="green.400" />
        <Text fontSize="lg" color="green.500">{mentor.rating}</Text>
      </HStack>

      <HStack spacing={3}>
        {mentor.expertise.map((skill, index) => (
          <Badge key={index} colorScheme="teal">{skill}</Badge>
        ))}
      </HStack>
    </VStack>
  );
};

export default MentorProfile;
