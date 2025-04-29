import {
  Flex,
  Tag,
  Box,
  Input,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Cards from "./Cards";
import Hero from "../home/Hero";

const tags = [
  "Product Managers",
  "Career Coaches", 
  "Software Engineers",
  "Leadership Mentors",
  "UX Designers",
  "Data Scientists",
  "Startup Founders"
];

const Body = () => {
  const navigate = useNavigate();
  const tagBgColor = useColorModeValue('gray.100', 'gray.700');
  const tagHoverBgColor = useColorModeValue('gray.200', 'gray.600');

  const handleTagClick = (tag) => {
    navigate(`/browse/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`);
  };

  const handleSearch = () => {
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput && searchInput.value.trim()) {
      navigate(`/browse/${encodeURIComponent(searchInput.value.trim().toLowerCase().replace(/\s+/g, "-"))}`);
    }
  };

  return (
    <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <Flex gap={{ base: 8, lg: 12 }}>
        {/* Left Section */}
        <Box flex="1.4" maxW="800px">
          {/* Main Title Section */}
          <Box mb={12}>
            <Hero />
          </Box>

          {/* Search Section */}
          <Flex mb={10} gap={3}>
            <Input
              type="search"
              placeholder="Search by company, skills or role"
              size="lg"
              bg="white"
              borderColor="gray.300"
              borderRadius="md"
              _placeholder={{ color: "gray.500" }}
              _hover={{ borderColor: "gray.400" }}
              _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
            />
            <Button
              colorScheme="teal"
              size="lg"
              px={6}
              onClick={handleSearch}
            >
              Find mentors
            </Button>
          </Flex>

          {/* Categories */}
          <Flex wrap="wrap" gap={3} mb={16}>
            {tags.map((tag, index) => (
              <Tag
                key={index}
                size="lg"
                bg={tagBgColor}
                color="gray.700"
                cursor="pointer"
                py={2}
                px={4}
                borderRadius="full"
                _hover={{
                  bg: tagHoverBgColor,
                }}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Tag>
            ))}
          </Flex>
        </Box>

        {/* Right Section - Mentor Cards */}
        <Box
          flex="1"
          position="relative"
          maxWidth={{ base: "100%", md: "50%" }}
          height="calc(100vh - 100px)"
          overflow="hidden"
          sx={{
            '&::-webkit-scrollbar': { display: 'none' },
            'scrollbarWidth': 'none',
            'msOverflowStyle': 'none',
            'touchAction': 'none',
            'userSelect': 'none'
          }}
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            overflow="hidden"
          >
            <Cards style={{ width: "100%" }} />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Body;
