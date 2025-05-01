import { useState } from "react";
import {
  Box,
  Flex,
  Image,
  Input,
  Button,
  Heading,
  Container,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useDisclosure,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SearchIcon, HamburgerIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/main_logo.png";
import axios from "axios";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const response = await axios.get(`http://localhost:3001/api/mentors/search?q=${encodeURIComponent(searchTerm.trim())}`);
        const mentors = response.data;
        
        if (mentors.length === 1) {
          // If exact match, go directly to mentor's profile
          navigate(`/mentors/${mentors[0].username}`);
        } else {
          // Otherwise, go to search results page
          navigate(`/browse/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
      } catch (err) {
        console.error('Search error:', err);
        navigate(`/browse/search?q=${encodeURIComponent(searchTerm.trim())}`);
      }
    }
  };

  // Handle search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  // Mentor categories for the secondary navigation
  const mentorCategories = [
    { name: "Engineering Mentors", path: "/browse/search?q=engineering" },
    { name: "Design Mentors", path: "/browse/search?q=design" },
    { name: "Startup Mentors", path: "/browse/search?q=startup" },
    { name: "Product Management", path: "/browse/search?q=product" },
    { name: "Marketing", path: "/browse/search?q=marketing" },
    { name: "Leadership", path: "/browse/search?q=leadership" },
    { name: "Career", path: "/browse/search?q=career" },
    { name: "Data Science", path: "/browse/search?q=data" }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  return (
    <Box as="header" bg="white" borderBottom="1px" borderColor="gray.200" position="sticky" top={0} zIndex={1000}>
      {/* Main Navigation */}
      <Container maxW="1200px" px={4}>
        <Flex h="72px" align="center" justify="space-between" gap={{ base: 4, lg: 8 }}>
          {/* Logo + Brand Name */}
          <Flex 
            align="center" 
            cursor="pointer" 
            onClick={() => navigate("/")} 
            flex={{ base: "1", md: "0 0 auto" }}
            mr={{ base: 2, md: 4, lg: 8 }}
          >
            <Image
              src={Logo}
              alt="Mentor Connect Logo"
              h={{ base: "32px", md: "36px" }}
              mr={3}
            />
            <Heading as="h1" fontSize={{ base: "20px", md: "24px" }} color="teal.700" display={{ base: "none", sm: "block" }}>
              Mentor Connect
            </Heading>
          </Flex>

          {/* Search Bar - Hidden on mobile */}
          <Box 
            flex="1" 
            maxW={{ md: "400px", lg: "580px" }} 
            mx={{ md: 6, lg: 12 }} 
            display={{ base: "none", md: "block" }}
          >
            <Flex>
              <Input
                h="40px"
                placeholder="Search mentors by name, role, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                bg="gray.50"
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                _placeholder={{ color: "gray.500" }}
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 1px teal.500",
                }}
              />
              <Button
                h="40px"
                ml={3}
                onClick={handleSearch}
                colorScheme="teal"
              >
                <SearchIcon />
              </Button>
            </Flex>
          </Box>

          {/* Desktop Navigation */}
          <Flex 
            align="center" 
            gap={6} 
            display={{ base: "none", md: "flex" }}
            ml={{ md: 4, lg: 8 }}
          >
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="teal"
                size="md"
                px={6}
              >
                Browse Mentors
              </MenuButton>
              <MenuList maxH="400px" overflowY="auto">
                {mentorCategories.map((category) => (
                  <MenuItem
                    key={category.name}
                    onClick={() => handleNavigation(category.path)}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Button
              variant="ghost"
              size="md"
              onClick={() => handleNavigation("/login")}
              px={6}
            >
              Login
            </Button>
          </Flex>

          {/* Mobile Menu Button */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<HamburgerIcon />}
            variant="ghost"
            onClick={onOpen}
            aria-label="Open menu"
          />
        </Flex>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={4}>
              <Button
                colorScheme="teal"
                size="md"
                onClick={() => handleNavigation("/browse")}
              >
                Browse Mentors
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </Button>
              <Box pt={4} pb={2} fontWeight="medium">Categories</Box>
              {mentorCategories.map((category) => (
                <Button
                  key={category.name}
                  variant="ghost"
                  justifyContent="left"
                  onClick={() => handleNavigation(category.path)}
                >
                  {category.name}
                </Button>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
  