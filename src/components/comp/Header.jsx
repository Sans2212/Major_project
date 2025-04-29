import { useState } from "react";
import { Box,Flex,Heading,Button,Input, Image, } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/main_logo.png";
const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
  
    // Handle search submission
    const handleSearch = () => {
      if (searchTerm.trim() !== "") {
        navigate(
          `/mentors/${encodeURIComponent(
            searchTerm.trim().toLowerCase().replace(/\s+/g, "-")
          )}`
        );
      }
    };
  
    // Handle search on Enter key
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };
  
    // Mentor categories for the secondary navigation
    const mentorCategories = [
      "Engineering Mentors",
      "Design Mentors",
      "Startup Mentors",
      "Product Managers",
      "Marketing Coaches",
      "Leadership Mentors",
      "Career Coaches",
      "Top Mentors",
    ];
  
    return (
      <>
      <Box>
        
        {/* Top Navigation Bar */}
        <Box bg="white" boxShadow="md" px={4} py={2}>
          <Flex align="center" justify="space-between">
            {/* Logo + Brand Name (clickable) */}
            <Flex align="center" justify="space-between" cursor="pointer" onClick={() => navigate("/")}>
              <Image
                src={Logo} alt="Mentor Connect Logo" boxSize="40px" mr={2}
              />
  
              <Heading as="h1" size="lg" color="teal.700">
                Mentor Connect
              </Heading>
            </Flex>
  
            {/* Centered Search Bar */}
            <Flex flex="1" mx={4} maxW="600px" align="center">
                <Input
                  placeholder="Search for mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  bg="white"
                  color="black"
                  border="2px solid"
                  borderColor="black"
                  borderRadius="md"
                />
                  <Button size="md" ml="10px" onClick={handleSearch} colorScheme="teal"
                  // bg="transparent"
                  color="teal.200"
                  _hover={{
                    bg: "teal.600",       // Change background on hover
                    color: "white",
                    borderColor: "black", // Change border color on hover
                  }}
                  _active={{
                    bg: "teal.700",   
                    color: "white",
                    borderColor: "black", // Darker border when pressed
                  }}
                  >
                    <SearchIcon color="currentColor" />
                  </Button>
            </Flex>
  
            {/* Right-side Navigation Buttons */}
            <Flex align="center" gap={4}>
              <Button
                variant="ghost"
                colorScheme="teal"
                color="black"
                border="2px solid"
                borderColor="black"
                borderRadius="md"
                _hover={{
                  bg: "teal.500",
                  color: "white",
                  borderColor: "teal.500",
                }}
                onClick={() => navigate("/find-mentors")}
              >
                Browse Mentors
              </Button>
              <Button
                variant="outline"
                colorScheme="teal"
                color="black"
                border="2px solid"
                borderColor="black"
                borderRadius="md"
                _hover={{
                  bg: "teal.500",
                  color: "white",
                  borderColor: "teal.500",
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </Flex>
          </Flex>
        </Box>
  
        {/* Secondary Navigation Bar with Mentor Categories */}
        <Box bg="white" py={2} px={4}>
          <Flex justify="center" wrap="wrap" gap={4}>
            {mentorCategories.map((category) => (
              <Button
                key={category}
                variant="link"
                color="black"
                colorScheme="teal"
                onClick={() =>
                  navigate(
                    `/mentors/${encodeURIComponent(
                      category.toLowerCase().replace(/\s+/g, "-")
                    )}`
                  )
                }
                _hover={{
                  bg: "gray.200",
                  borderRadius: "md",
                }}
              >
                {category}
              </Button>
            ))}
          </Flex>
        </Box>
      </Box>
    </>
    );
};
  
  export default Header;
  