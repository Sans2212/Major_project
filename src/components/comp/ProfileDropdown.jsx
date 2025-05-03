import { useState, useEffect, useCallback } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton,
  Image,
  Divider,
  Center,
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfileDropdown = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    interests: [],
    bio: '',
    profilePhoto: null,
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const endpoint = user.role === 'mentee' 
        ? 'http://localhost:3001/api/mentees/profile'
        : 'http://localhost:3001/api/mentors/profile';

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const profileData = response.data;
      setFormData({
        fullName: profileData.fullName,
        email: profileData.email,
        interests: profileData.interests || [],
        bio: profileData.bio || '',
        profilePhoto: profileData.profilePhoto || null,
      });

      if (profileData.profilePhoto) {
        const photoPath = user.role === 'mentee' ? 'mentees' : 'mentors';
        setPreviewUrl(`http://localhost:3001/uploads/${photoPath}/${profileData.profilePhoto}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch profile data',
        status: 'error',
        duration: 3000,
      });
    }
  }, [user, toast]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size should be less than 5MB",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in to upload a photo",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const response = await axios.post(
        'http://localhost:3001/api/mentees/upload-photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.user) {
        // Update the user context with new photo
        setUser(prev => ({
          ...prev,
          profilePhoto: response.data.user.profilePhoto
        }));

        // Update the preview URL
        setPreviewUrl(`http://localhost:3001${response.data.user.profilePhoto}`);

        toast({
          title: "Success",
          description: "Photo uploaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      console.error('Error details:', error.response?.data);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload photo",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const endpoint = user.role === 'mentee'
        ? 'http://localhost:3001/api/mentees/profile/photo'
        : 'http://localhost:3001/api/mentors/profile/photo';

      const response = await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.user) {
        // Update the user context with the updated user data
        setUser(prev => ({
          ...prev,
          ...response.data.user
        }));
      } else {
        // Fallback to just removing the photo
        setUser(prev => ({
          ...prev,
          profilePhoto: null
        }));
      }

      // Update local state
      setPreviewUrl('');
      setFormData(prev => ({
        ...prev,
        profilePhoto: null
      }));

      toast({
        title: 'Success',
        description: 'Photo removed successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      console.error('Error details:', error.response?.data);
      toast({
        title: 'Error',
        description: error.response?.data?.details || error.response?.data?.error || 'Failed to remove photo',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const endpoint = user.role === 'mentee'
        ? 'http://localhost:3001/api/mentees/profile'
        : 'http://localhost:3001/api/mentors/profile';

      await axios.put(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsEditModalOpen(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
      });
      
      // Refresh profile data
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Box position="relative" minW="250px">
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost"
            width="100%"
            height="40px"
            p={2}
            display="flex"
            alignItems="center"
            borderRadius="0"
            _hover={{ bg: 'gray.100', borderRadius: '0' }}
            _active={{ bg: 'gray.200', borderRadius: '0' }}
            _expanded={{ bg: 'gray.100', borderRadius: '0' }}
          >
            <HStack spacing={3} width="100%" pr={4}>
              <Avatar
                size="sm"
                name={formData.fullName}
                src={previewUrl || undefined}
                borderRadius="full"
              />
              <Text
                flex="1"
                noOfLines={1}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {formData.fullName}
              </Text>
            </HStack>
          </MenuButton>
          <MenuList borderRadius="0">
            {user?.role === 'mentee' && (
              <MenuItem onClick={() => navigate('/home/mentee')}>Dashboard</MenuItem>
            )}
            {user?.role === 'mentor' && (
              <MenuItem onClick={() => navigate('/my-profile')}>My Profile</MenuItem>
            )}
            <MenuItem onClick={() => setIsViewModalOpen(true)}>View Profile</MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} color="red.500">Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>

      {/* View Profile Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              <Center>
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Profile"
                    boxSize="150px"
                    borderRadius="full"
                    objectFit="cover"
                  />
                ) : (
                  <Avatar size="2xl" name={formData.fullName} />
                )}
              </Center>

              <Box>
                <Text fontWeight="bold" mb={1}>Full Name</Text>
                <Text>{formData.fullName}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={1}>Email</Text>
                <Text>{formData.email}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>Interests</Text>
                <Box>
                  {formData.interests.length > 0 ? (
                    formData.interests.map((interest, index) => (
                      <Tag
                        key={index}
                        size="md"
                        borderRadius="full"
                        variant="solid"
                        colorScheme="teal"
                        mr={2}
                        mb={2}
                      >
                        <TagLabel>{interest}</TagLabel>
                      </Tag>
                    ))
                  ) : (
                    <Text color="gray.500">No interests added</Text>
                  )}
                </Box>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={1}>Bio</Text>
                <Text>{formData.bio || 'No bio added'}</Text>
              </Box>

              <Button
                leftIcon={<EditIcon />}
                colorScheme="teal"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsEditModalOpen(true);
                }}
                mt={4}
              >
                Edit Profile
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Profile Photo</FormLabel>
                <HStack spacing={4}>
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Profile"
                      boxSize="100px"
                      borderRadius="full"
                      objectFit="cover"
                    />
                  ) : (
                    <Avatar size="xl" name={formData.fullName} />
                  )}
                  <VStack>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      display="none"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button as="span" colorScheme="blue">
                        Upload Photo
                      </Button>
                    </label>
                    {previewUrl && (
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={handleRemovePhoto}
                        aria-label="Remove photo"
                      />
                    )}
                  </VStack>
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  isReadOnly
                />
              </FormControl>

              <FormControl>
                <FormLabel>Interests</FormLabel>
                <HStack>
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add new interest"
                  />
                  <IconButton
                    icon={<AddIcon />}
                    onClick={handleAddInterest}
                    aria-label="Add interest"
                  />
                </HStack>
                <Box mt={2}>
                  {formData.interests.map((interest, index) => (
                    <Tag
                      key={index}
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="blue"
                      mr={2}
                      mb={2}
                    >
                      <TagLabel>{interest}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveInterest(interest)} />
                    </Tag>
                  ))}
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                />
              </FormControl>

              <Button colorScheme="blue" onClick={handleSave} w="full">
                Save Changes
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileDropdown; 