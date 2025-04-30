// src/pages/BrowseMentors.jsx (or FindMentors.jsx)

// import React from "react";
import { Box, SimpleGrid, Text, Avatar, Badge, Icon, Input, InputGroup, InputRightElement, Button, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaSearch, FaStar } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { mentors } from "../data/mentors";

const BrowseMentors = () => {
  const [searchParams] = useSearchParams();
  const [filteredMentors, setFilteredMentors] = useState([]);
  const category = searchParams.get("category");
  const searchTerm = searchParams.get("q");

  useEffect(() => {
    // Filter mentors based on search query or category
    let filtered = [...mentors];
    
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      // Split the search term into individual words
      const searchWords = query.split(/[\s-]+/);
      
      filtered = mentors.filter(mentor => {
        // Check if any of the search words match exactly with expertise
        const hasMatchingExpertise = mentor.expertise.some(skill => 
          searchWords.some(word => 
            skill.toLowerCase().includes(word)
          )
        );
        
        // Check if the search term matches the role
        const hasMatchingRole = mentor.role.toLowerCase().includes(query);
        
        return hasMatchingExpertise || hasMatchingRole;
      });
    } else if (category) {
      const categoryLower = category.toLowerCase();
      // Map category names to expertise keywords
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
      
      filtered = mentors.filter(mentor => {
        // Check if any of the mentor's expertise matches any of the category keywords
        return mentor.expertise.some(skill => 
          keywords.some(keyword => 
            skill.toLowerCase().includes(keyword)
          )
        );
      });
    }
    
    setFilteredMentors(filtered);
  }, [searchTerm, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      window.location.href = `/browse/search?q=${encodeURIComponent(query)}`;
    }
  };

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
        
        <form onSubmit={handleSearch}>
          <InputGroup size="lg" maxW="600px">
            <Input
              name="search"
              placeholder="Search by name, role, or expertise..."
              defaultValue={searchTerm || ""}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" type="submit">
                <Icon as={FaSearch} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
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
