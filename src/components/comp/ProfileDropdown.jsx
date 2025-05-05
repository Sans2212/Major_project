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
  ModalFooter,
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React from 'react';

const ProfileDropdown = ({ onProfileUpdate }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    skills: [],
    bio: '',
    profilePhoto: null,
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const cancelRef = React.useRef();
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: 'Error',
          description: 'Authentication token not found. Please log in again.',
          status: 'error',
          duration: 3000,
        });
        logout();
        return;
      }

      const endpoint = user.role === 'mentee' 
        ? 'http://localhost:3001/api/mentees/profile'
        : 'http://localhost:3001/api/mentors/profile';

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const profileData = response.data;
      setFormData({
        fullName: profileData.firstName ? `${profileData.firstName} ${profileData.lastName}` : profileData.fullName,
        email: profileData.email,
        skills: profileData.skills ? profileData.skills.split(',').map(s => s.trim()) : [],
        bio: profileData.bio || '',
        profilePhoto: profileData.profilePhoto || null,
      });

      if (profileData.profilePhoto) {
        setPreviewUrl(`http://localhost:3001${profileData.profilePhoto}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      const errorMessage = error.response?.data?.error || 'Failed to fetch profile data';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
      
      if (error.response?.status === 401) {
        logout();
      }
    }
  }, [user, toast, logout]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    // fetchMentorData runs whenever refreshKey changes
    fetchUserProfile();
  }, [refreshKey]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
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

      const endpoint = user.role === 'mentee'
        ? 'http://localhost:3001/api/mentees/upload-photo'
        : 'http://localhost:3001/api/mentors/upload-photo';

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.user) {
        // Update the user context with new photo
        setUser(prev => ({
          ...prev,
          profilePhoto: response.data.user.profilePhoto
        }));

        // Update the preview URL
        setPreviewUrl(`http://localhost:3001${response.data.user.profilePhoto}`);

        // Call onProfileUpdate to refresh the mentor profile
        if (onProfileUpdate) {
          onProfileUpdate();
        }

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
        : `http://localhost:3001/api/mentors/profile/${user.id || user._id}`;

      const dataToSend = {
        ...formData,
        skills: formData.skills.join(', ')
      };

      await axios.put(endpoint, dataToSend, {
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
      if (onProfileUpdate) onProfileUpdate();
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

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'CONFIRM') {
      toast({
        title: 'Error',
        description: 'Please type CONFIRM to delete your account',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const endpoint = user.role === 'mentee'
        ? 'http://localhost:3001/api/mentees/delete-account'
        : 'http://localhost:3001/api/mentors/delete-account';

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsDeleteModalOpen(false);
      setIsAlertDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Your account has been deleted successfully',
        status: 'success',
        duration: 3000,
      });
      
      // Logout and redirect to home
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete account',
        status: 'error',
        duration: 3000,
      });
    }
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
            <MenuItem onClick={() => navigate('/integrate-calendly')}>Integrate Calendly URL</MenuItem>
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
                <Text fontWeight="bold" mb={2}>Skills / Expertise</Text>
                <Box>
                  {formData.skills.length > 0 ? (
                    formData.skills.map((skill, index) => (
                      <Tag
                        key={index}
                        size="md"
                        borderRadius="full"
                        variant="solid"
                        colorScheme="teal"
                        mr={2}
                        mb={2}
                      >
                        <TagLabel>{skill}</TagLabel>
                      </Tag>
                    ))
                  ) : (
                    <Text color="gray.500">No skills added</Text>
                  )}
                </Box>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={1}>Bio</Text>
                <Text>{formData.bio || 'No bio added'}</Text>
              </Box>

              <VStack spacing={4} align="stretch">
                <Button
                  leftIcon={<EditIcon />}
                  colorScheme="teal"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit Profile
                </Button>
                
                <Button
                  colorScheme="red"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete Account
                </Button>
              </VStack>
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
                <FormLabel>Skills / Expertise</FormLabel>
                <HStack>
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add new skill or expertise"
                  />
                  <IconButton
                    icon={<AddIcon />}
                    onClick={handleAddSkill}
                    aria-label="Add skill"
                  />
                </HStack>
                <Box mt={2}>
                  {formData.skills.map((skill, index) => (
                    <Tag
                      key={index}
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="blue"
                      mr={2}
                      mb={2}
                    >
                      <TagLabel>{skill}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveSkill(skill)} />
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

      {/* Delete Account Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text>To delete your account, please type &quot;CONFIRM&quot; below:</Text>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type CONFIRM"
              />
              <Text color="red.500" fontSize="sm">
                This action cannot be undone. All your data will be permanently deleted.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                if (deleteConfirmText === 'CONFIRM') {
                  setIsDeleteModalOpen(false);
                  setIsAlertDialogOpen(true);
                } else {
                  toast({
                    title: 'Error',
                    description: 'Please type CONFIRM to delete your account',
                    status: 'error',
                    duration: 3000,
                  });
                }
              }}
            >
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Final Confirmation Alert Dialog */}
      <AlertDialog
        isOpen={isAlertDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
              All your data will be permanently deleted.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Yes, Delete My Account
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ProfileDropdown; 