import { useState } from "react";
import {
  Box,
  Container,
  Flex,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Link,
  Divider,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  useBreakpointValue,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { HamburgerIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Logo from "../../assets/main_logo.png";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
    { name: "Technology", path: "/browse/technology" },
    { name: "Business", path: "/browse/business" },
    { name: "Design", path: "/browse/design" },
    { name: "Marketing", path: "/browse/marketing" },
    { name: "Finance", path: "/browse/finance" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isOpen) onClose();
  };

  // Only show search functionality for mentees or non-authenticated users
  const showSearch = !user || user.role === 'mentee';

  return (
    <Box as="header" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" h="4rem">
          <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
            <HStack spacing={4}>
              <Image src={Logo} alt="Logo" h="2.5rem" />
              <Text
                fontSize="xl"
                fontWeight="bold"
                display={{ base: "none", md: "block" }}
              >
                Mentor Connect
              </Text>
            </HStack>
          </Link>

          {/* Search Bar - Only show on desktop and for appropriate users */}
          {!isMobile && showSearch && (
            <Box flex="1" mx={8} maxW="500px">
              <InputGroup>
                <Input
                  placeholder="Search mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <InputRightElement>
                  <IconButton
                    icon={<SearchIcon />}
                    variant="ghost"
                    onClick={handleSearch}
                    aria-label="Search"
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
          )}

          {/* Desktop Navigation */}
          <Flex 
            align="center" 
            gap={6} 
            display={{ base: "none", md: "flex" }}
            ml={{ md: 4, lg: 8 }}
            minW="fit-content"
          >
            {/* Show Browse Mentors menu for non-authenticated users and Dashboard for authenticated users */}
            {user ? (
              <Button
                as={RouterLink}
                to={user.role === 'mentee' ? '/home/mentee' : '/home/mentor'}
                colorScheme="teal"
                size="md"
                px={6}
                borderRadius="0"
                _hover={{ borderRadius: '0' }}
                _active={{ borderRadius: '0' }}
              >
                Dashboard
              </Button>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  colorScheme="teal"
                  size="md"
                  px={6}
                  borderRadius="0"
                  _hover={{ borderRadius: '0' }}
                  _active={{ borderRadius: '0' }}
                  _expanded={{ borderRadius: '0' }}
                >
                  Browse Mentors
                </MenuButton>
                <MenuList maxH="400px" overflowY="auto" borderRadius="0">
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
            )}
            
            <Box minW="fit-content">
              {user ? (
                <ProfileDropdown />
              ) : (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => handleNavigation("/login")}
                  px={6}
                  borderRadius="0"
                  _hover={{ borderRadius: '0' }}
                  _active={{ borderRadius: '0' }}
                >
                  Login
                </Button>
              )}
            </Box>
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
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {/* Search Bar for Mobile - Only show for appropriate users */}
              {showSearch && (
                <InputGroup>
                  <Input
                    placeholder="Search mentors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <InputRightElement>
                    <IconButton
                      icon={<SearchIcon />}
                      variant="ghost"
                      onClick={handleSearch}
                      aria-label="Search"
                    />
                  </InputRightElement>
                </InputGroup>
              )}

              {/* Show Browse Categories only for mentees or non-authenticated users */}
              {showSearch && (
                <>
                  <Text fontWeight="bold" mb={2}>
                    Browse by Category
                  </Text>
                  {mentorCategories.map((category) => (
                    <Button
                      key={category.name}
                      variant="ghost"
                      justifyContent="flex-start"
                      onClick={() => {
                        handleNavigation(category.path);
                        onClose();
                      }}
                    >
                      {category.name}
                    </Button>
                  ))}
                  <Divider my={4} />
                </>
              )}

              {user ? (
                <>
                  {user.role === 'mentee' && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleNavigation("/home/mentee");
                        onClose();
                      }}
                    >
                      Dashboard
                    </Button>
                  )}
                  {user.role === 'mentor' && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleNavigation("/my-profile");
                        onClose();
                      }}
                    >
                      My Profile
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleNavigation("/settings");
                      onClose();
                    }}
                  >
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleNavigation("/login");
                    onClose();
                  }}
                >
                  Login
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
  