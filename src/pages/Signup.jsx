// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Image,
  Heading,
  Button,
  Input,
  Text,
  Divider,
  VStack,
  Link,
} from "@chakra-ui/react";
import logo from "../assets/main_logo.png";
import GoogleLogo from "../assets/Google_logo.png";

const SignupForm = () => {
  const location = useLocation();
  // Determine role based on the URL (e.g., "/signup/mentor" vs. "/signup/mentee")
  const role = location.pathname.includes("mentor") ? "mentor" : "mentee";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    expertise: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Flex w="100%" h="100vh" flexDirection={{ base: "column", md: "row" }}>
      {/* Left Side with Logo and Gradient Background */}
      <Flex
        w={{ base: "100%", md: "40%" }}
        bgGradient="linear(to-b, teal.600, green.600)"
        align="center"
        justify="center"
        p={6}
      >
        <Image src={logo} alt="Logo" boxSize="150px" />
      </Flex>

      {/* Right Side: Signup Form */}
      <Flex
        w={{ base: "100%", md: "60%" }}
        align="center"
        justify="center"
        p={6}
      >
        <Box w="full" maxW="md">
          <Heading mb={6}>
            Sign up as {role.charAt(0).toUpperCase() + role.slice(1)}
          </Heading>
          <form>
            <VStack spacing={4} mb={4}>
              <Box w="full">
                <Text mb={1}>Full Name</Text>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  focusBorderColor="teal.500"
                />
              </Box>
              <Box w="full">
                <Text mb={1}>Email</Text>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  focusBorderColor="teal.500"
                />
              </Box>
              <Box w="full">
                <Text mb={1}>Password</Text>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  focusBorderColor="teal.500"
                />
              </Box>
              <Box w="full">
                <Text mb={1}>Confirm Password</Text>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  focusBorderColor="teal.500"
                />
              </Box>
              {/* Extra Fields for Mentors */}
              {role === "mentor" && (
                <>
                  <Box w="full">
                    <Text mb={1}>Expertise</Text>
                    <Input
                      type="text"
                      name="expertise"
                      placeholder="Your Expertise (e.g., AI, Web Dev)"
                      value={formData.expertise}
                      onChange={handleChange}
                      required
                      focusBorderColor="teal.500"
                    />
                  </Box>
                  <Box w="full">
                    <Text mb={1}>Experience (in years)</Text>
                    <Input
                      type="number"
                      name="experience"
                      placeholder="Years of Experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      focusBorderColor="teal.500"
                    />
                  </Box>
                </>
              )}
            </VStack>

            {/* Signup Button */}
            <Button type="submit" w="full" colorScheme="teal" mb={4}>
              Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>

            {/* Or Divider */}
            <Flex align="center" mb={4}>
              <Divider />
              <Text mx={2} color="gray.500">
                Or
              </Text>
              <Divider />
            </Flex>

            {/* Google Signup Button */}
            <Button w="full" variant="outline" mb={4}>
              <Image src={GoogleLogo} alt="Google Icon" boxSize="20px" mr={2} />
              Sign up with Google
            </Button>

            {/* Extra Link for Existing Account */}
            <Text textAlign="center">
              Already have an account?{" "}
              <Link
                as={RouterLink}
                to="/login"
                color="teal"
                _hover={{ textDecoration: "underline" }}
              >
                Log in
              </Link>
            </Text>
          </form>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SignupForm;
