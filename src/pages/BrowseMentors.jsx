// src/pages/BrowseMentors.jsx (or FindMentors.jsx)

// import React from "react";
import { Box, SimpleGrid, Text, Avatar, Badge, Icon, Flex, Spinner, Center } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useSearchParams, useNavigate } from "react-router-dom";
import { mentors as staticMentors } from "../data/mentors";
import axios from "axios";

const BrowseMentors = () => {
  const [searchParams] = useSearchParams();
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const category = searchParams.get("category");
  const searchTerm = searchParams.get("q");

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      try {
        // Fetch mentors from database
        let dbMentors = [];
        if (searchTerm) {
          const response = await axios.get(`http://localhost:3001/api/mentors/search?q=${encodeURIComponent(searchTerm.trim())}`);
          dbMentors = response.data.map(mentor => ({
            id: mentor._id,
            name: `${mentor.firstName} ${mentor.lastName}`,
            role: mentor.jobTitle || "Mentor",
            rating: mentor.rating || 4.5,
            reviews: mentor.reviews || 0,
            expertise: mentor.skills ? mentor.skills.split(',').map(skill => skill.trim()) : [],
            image: mentor.profilePhoto ? `http://localhost:3001/uploads/mentors/${mentor.profilePhoto}` : null,
            isFromDB: true
          }));
        } else {
          const response = await axios.get('http://localhost:3001/api/mentors/browse');
          dbMentors = response.data.map(mentor => ({
            id: mentor._id,
            name: `${mentor.firstName} ${mentor.lastName}`,
            role: mentor.jobTitle || "Mentor",
            rating: mentor.rating || 4.5,
            reviews: mentor.reviews || 0,
            expertise: mentor.skills ? mentor.skills.split(',').map(skill => skill.trim()) : [],
            image: mentor.profilePhoto ? `http://localhost:3001/uploads/mentors/${mentor.profilePhoto}` : null,
            isFromDB: true
          }));
        }

        // Combine with static mentors
        let allMentors = [...dbMentors, ...staticMentors];
        
        // Filter based on search term or category
        if (searchTerm) {
          const query = searchTerm.toLowerCase();
          const searchWords = query.split(/[\s-]+/);
          
          allMentors = allMentors.filter(mentor => {
            const hasMatchingExpertise = mentor.expertise.some(skill => 
              searchWords.some(word => 
                skill.toLowerCase().includes(word)
              )
            );
            const hasMatchingRole = mentor.role.toLowerCase().includes(query);
            const hasMatchingName = mentor.name.toLowerCase().includes(query);
            
            return hasMatchingExpertise || hasMatchingRole || hasMatchingName;
          });
        }
        
        if (category) {
          const categoryLower = category.toLowerCase();
          const categoryKeywords = {
            'engineering': ['javascript', 'react', 'node.js', 'java', 'microservices', 'cloud computing', 'system design', 'cloud architecture'],
            'design': ['ui', 'ux', 'design', 'user experience', 'user interface', 'figma', 'prototyping', 'design systems'],
            'startup': ['startup', 'founder', 'entrepreneur', 'business strategy', 'fundraising', 'growth hacking'],
            'product-management': ['product', 'product strategy', 'product management', 'agile', 'user research'],
            'marketing': ['marketing', 'digital marketing', 'brand strategy', 'social media'],
            'leadership': ['leadership', 'executive', 'management', 'team leadership', 'strategic planning'],
            'career': ['career', 'career development', 'resume', 'interview preparation'],
            'data-science': ['data', 'analytics', 'machine learning', 'ai', 'python', 'big data']
          };

          const keywords = categoryKeywords[categoryLower] || [categoryLower];
          
          allMentors = allMentors.filter(mentor => {
            return mentor.expertise.some(skill => 
              keywords.some(keyword => 
                skill.toLowerCase().includes(keyword)
              )
            );
          });
        }
        
        setFilteredMentors(allMentors);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        // If database fetch fails, fall back to static mentors
        setFilteredMentors(staticMentors);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, [searchTerm, category]);

  const handleMentorClick = (mentor) => {
    if (mentor.isFromDB) {
      navigate(`/mentors/${mentor.id}`);
    } else {
      navigate(`/mentors/static/${mentor.id}`);
    }
  };

  if (isLoading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );
  }

  return (
    <Box p={8}>
      <Box mb={8}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          {searchTerm 
            ? `Search Results for "${searchTerm}"` 
            : category 
              ? `${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`
              : "Browse All Mentors"}
        </Text>
        <Text color="gray.600" mb={4}>
          {filteredMentors.length} mentors found
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {filteredMentors.map((mentor) => (
          <Box
            key={mentor.id}
            p={6}
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            border="1px"
            borderColor="gray.200"
            transition="all 0.3s ease-in-out"
            cursor="pointer"
            onClick={() => handleMentorClick(mentor)}
            _hover={{ 
              transform: "scale(1.02)",
              boxShadow: "xl"
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
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default BrowseMentors;
