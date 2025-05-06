import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, FormControl, FormLabel, Input, Text, Heading,
  Textarea, VStack, HStack, SimpleGrid, Stack, useToast,
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { fetchProfile } from "../../components/comp/ProfileDropdown";

const MentorSignup = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        skills: [],
        bio: "",
        profilePhoto: null,
    });

    const updateMentorProfile = async (token, data) => {
        try {
            const response = await axios.put('http://localhost:3001/api/mentors/profile', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response;
        } catch (error) {
            console.error('Error updating mentor profile:', error);
            throw error;
        }
    };
    const updateMenteeProfile = async (token, data) => {
        try {
            const response = await axios.put('http://localhost:3001/api/mentees/profile', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response;
        } catch (error) {
            console.error('Error updating mentee profile:', error);
            throw error;
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const role = user.role;

            const profileData = {
                ...formData,
                skills: formData.skills.join(', '),
            };
            let updateUserProfile;

            if (role === 'mentor') {
                updateUserProfile = updateMentorProfile;
            } else {
                updateUserProfile = updateMenteeProfile;
            }

            if (!updateUserProfile) {
                toast({
                    title: 'Error',
                    description: 'Invalid user role',
                    status: 'error',
                    duration: 3000,
                });
                return;
            }


            await updateUserProfile(token, profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast({
                title: 'Profile Updated',
                description: 'Your profile has been successfully updated.',
                status: 'success',
                duration: 3000,
            });

        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Error',
                description: 'Failed to update profile.',
                status: 'error',
                duration: 3000,
            });
        }
    };

    return (
        <Container maxW="container.lg" py={10}>
            <VStack as="form" onSubmit={handleSubmit} spacing={6} w="full">
                <Heading as="h2" size="lg" textAlign="center" mb={6}>
                    Complete Your Profile
                </Heading>
                <FormControl>
                    <FormLabel htmlFor="fullName">Full Name</FormLabel>
                    <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="skills">Skills (comma-separated)</FormLabel>
                    <Input
                        id="skills"
                        type="text"
                        value={formData.skills.join(', ')}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',') })}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="bio">Bio</FormLabel>
                    <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="profilePhoto">Profile Photo</FormLabel>
                    <Input
                        id="profilePhoto"
                        type="file"
                        onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.files[0] })}
                    />
                </FormControl>

                <Button colorScheme="blue" type="submit" w="full">
                    Update Profile
                </Button>
            </VStack>
        </Container>
    );
};

export default MentorSignup;
