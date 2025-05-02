import {
  Box,
  Container,
  VStack,
  HStack,
  Avatar,
  Text,
  Button,
  useColorModeValue,
  Heading,
  SimpleGrid,
  Badge,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaGraduationCap, FaBriefcase, FaEdit } from "react-icons/fa";
import { fetchMenteeProfile, updateMenteeProfile } from "../utils/profileUtils";
import axios from "axios";

const MenteeProfile = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    bio: "",
    education: "",
    currentRole: "",
    interests: [],
    goals: "",
    profilePhoto: user?.profilePhoto || "",
  });
  const [editedProfile, setEditedProfile] = useState({...profile});
  const [error, setError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        const data = await fetchMenteeProfile(token);
        
        // Merge API data with user data, preferring API data
        const profileData = {
          ...profile,
          ...data,
          fullName: data.fullName || user?.fullName,
          email: data.email || user?.email,
          profilePhoto: data.profilePhoto || user?.profilePhoto,
        };
        
        setProfile(profileData);
        setEditedProfile(profileData);
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load complete profile data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user, toast, profile]);

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      setError(null);
      const response = await axios.post(
        'http://localhost:3001/api/mentees/upload-photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.user) {
        setEditedProfile(prev => ({
          ...prev,
          profilePhoto: response.data.user.profilePhoto
        }));
        setPhotoPreview(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError(error.response?.data?.message || 'Error uploading photo');
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete("http://localhost:3001/api/mentees/profile/photo", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEditedProfile(prev => ({
        ...prev,
        profilePhoto: null
      }));

      toast({
        title: "Success",
        description: "Photo removed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove photo",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      
      // Append all profile fields to formData
      Object.keys(editedProfile).forEach(key => {
        if (key === "interests" && Array.isArray(editedProfile[key])) {
          formData.append(key, JSON.stringify(editedProfile[key]));
        } else if (key !== "profilePhoto") { // Don't send profile photo here as it's handled separately
          formData.append(key, editedProfile[key]);
        }
      });

      await updateMenteeProfile(token, formData);
      setProfile(editedProfile);
      onClose();
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" py={10} bg={useColorModeValue("gray.50", "gray.900")}>
      <Container maxW="container.md">
        {isLoading ? (
          <Center py={10}>
            <VStack spacing={4}>
              <Spinner size="xl" />
              <Text>Loading profile...</Text>
            </VStack>
          </Center>
        ) : (
        <Box bg={bgColor} borderRadius="lg" boxShadow="md" overflow="hidden">
          {/* Profile Header */}
          <Box p={8} borderBottom="1px" borderColor={borderColor}>
            <VStack spacing={4}>
              <Avatar
                size="2xl"
                name={profile.fullName}
                src={profile.profilePhoto ? `http://localhost:3001${profile.profilePhoto}` : undefined}
              />
              <Heading size="lg">{profile.fullName}</Heading>
              <Text color={textColor} textAlign="center">{profile.bio || "No bio added yet"}</Text>
              <Button
                leftIcon={<Icon as={FaEdit} />}
                colorScheme="teal"
                variant="outline"
                onClick={onOpen}
              >
                Edit Profile
              </Button>
            </VStack>
          </Box>

          {/* Profile Details */}
          <Box p={8}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <VStack align="start" spacing={4}>
                <HStack>
                  <Icon as={FaGraduationCap} color="teal.500" boxSize={5} />
                  <Text fontWeight="bold">Education</Text>
                </HStack>
                <Text color={textColor}>{profile.education || "Not specified"}</Text>

                <HStack>
                  <Icon as={FaBriefcase} color="teal.500" boxSize={5} />
                  <Text fontWeight="bold">Current Role</Text>
                </HStack>
                <Text color={textColor}>{profile.currentRole || "Not specified"}</Text>
              </VStack>

              <VStack align="start" spacing={4}>
                <Text fontWeight="bold">Interests</Text>
                <Box>
                  {profile.interests && profile.interests.length > 0 ? (
                    profile.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        colorScheme="teal"
                        mr={2}
                        mb={2}
                        px={2}
                        py={1}
                        borderRadius="full"
                      >
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <Text color={textColor}>No interests added yet</Text>
                  )}
                </Box>

                <Text fontWeight="bold">Learning Goals</Text>
                <Text color={textColor}>{profile.goals || "No learning goals specified"}</Text>
              </VStack>
            </SimpleGrid>
          </Box>
        </Box>
        )}

        {/* Edit Profile Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Profile Photo</FormLabel>
                  <VStack spacing={2}>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    {editedProfile.profilePhoto && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={handleRemovePhoto}
                      >
                        Remove Photo
                      </Button>
                    )}
                  </VStack>
                </FormControl>

                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={editedProfile.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                    value={editedProfile.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Education</FormLabel>
                  <Input
                    value={editedProfile.education}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Current Role</FormLabel>
                  <Input
                    value={editedProfile.currentRole}
                    onChange={(e) => handleInputChange("currentRole", e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Interests (comma-separated)</FormLabel>
                  <Input
                    value={editedProfile.interests?.join(", ")}
                    onChange={(e) => handleInputChange("interests", e.target.value.split(",").map(i => i.trim()))}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Learning Goals</FormLabel>
                  <Textarea
                    value={editedProfile.goals}
                    onChange={(e) => handleInputChange("goals", e.target.value)}
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <HStack spacing={3}>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={handleSaveProfile}
                  isLoading={isLoading}
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default MenteeProfile; 