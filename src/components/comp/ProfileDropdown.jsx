import { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = () => {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:3001/api/mentees/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData({
        fullName: response.data.fullName,
        email: response.data.email,
        interests: response.data.interests || [],
        bio: response.data.bio || '',
        profilePhoto: response.data.profilePhoto || null,
      });
      if (response.data.profilePhoto?.url) {
        setPreviewUrl(response.data.profilePhoto.url);
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
  };

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
    if (file) {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post('http://localhost:3001/api/mentees/profile/photo', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setPreviewUrl(response.data.url);
        setFormData(prev => ({
          ...prev,
          profilePhoto: response.data
        }));
        
        toast({
          title: 'Success',
          description: 'Profile photo updated successfully',
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        console.error('Error uploading photo:', error);
        toast({
          title: 'Error',
          description: 'Failed to update profile photo',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete('http://localhost:3001/api/mentees/profile/photo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPreviewUrl('');
      setFormData(prev => ({
        ...prev,
        profilePhoto: null
      }));
      
      toast({
        title: 'Success',
        description: 'Profile photo removed successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove profile photo',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put('http://localhost:3001/api/mentees/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
      });
      setIsEditModalOpen(false);
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

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant="ghost"
          _hover={{ bg: 'gray.100' }}
        >
          <HStack spacing={2}>
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile"
                boxSize="32px"
                borderRadius="full"
                objectFit="cover"
              />
            ) : (
              <Avatar size="sm" name={user.fullName} />
            )}
            <Text>{user.fullName}</Text>
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setIsEditModalOpen(true)}>Edit Profile</MenuItem>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </MenuList>
      </Menu>

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