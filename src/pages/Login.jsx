// src/pages/Login.jsx
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
  HStack,
  Link, // Chakra UI Link
} from "@chakra-ui/react";
import logo from "../assets/main_logo.png";
import GoogleLogo from "../assets/Google_logo.png";

const Login = () => {
  const [role, setRole] = useState("mentee");
  const navigate = useNavigate();

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
        <Image src={logo} alt="Mentor Connect Logo" boxSize="150px" cursor="pointer" onClick={() => navigate("/")} />
      </Flex>

      {/* Right Side: Form Section */}
      <Flex
        w={{ base: "100%", md: "60%" }}
        align="center"
        justify="center"
        p={6}
      >
        <Box w="full" maxW="md">
          <Heading mb={6}>Log in</Heading>

          {/* Toggle Buttons for Mentee / Mentor */}
          <HStack spacing={4} mb={6}>
            <Button
              variant={role === "mentee" ? "solid" : "outline"}
              colorScheme="teal"
              onClick={() => setRole("mentee")}
            >
              I'm a mentee
            </Button>
            <Button
              variant={role === "mentor" ? "solid" : "outline"}
              colorScheme="teal"
              onClick={() => setRole("mentor")}
            >
              I'm a mentor
            </Button>
          </HStack>

          <form>
            {/* Email and Password Fields */}
            <VStack spacing={4} mb={4}>
              <Box w="full">
                <Text mb={1}>Email or Username</Text>
                <Input
                  type="text"
                  placeholder="Enter your email or username"
                  required
                  focusBorderColor="teal.500"
                />
              </Box>
              <Box w="full">
                <Text mb={1}>Password</Text>
                <Input
                  type="password"
                  placeholder="Password"
                  required
                  focusBorderColor="teal.500"
                />
              </Box>
            </VStack>

            {/* Login Button */}
            <Button type="submit" w="full" colorScheme="teal" mb={4}>
              Log in as {role === "mentee" ? "Mentee" : "Mentor"}
            </Button>

            {/* Or Divider */}
            <Flex align="center" mb={4}>
              <Divider />
              <Text mx={2} color="gray.500">
                Or
              </Text>
              <Divider />
            </Flex>

            {/* Google Login Button */}
            <Button w="full" variant="outline" mb={4}>
              <Image src={GoogleLogo} alt="Google Icon" boxSize="20px" mr={2} />
              Log in with Google
            </Button>

            {/* Extra Link */}
            <Flex justify="space-between" align="center" mb={4}>
              <Link
                as={RouterLink}
                to="#"
                color="teal"
                _hover={{ textDecoration: "underline" }}
              >
                Forgot password?
              </Link>
            </Flex>

            <Text>
              {role === "mentee" ? (
                <>
                  Want to become a Mentor?{" "}
                  <Link
                    as={RouterLink}
                    to="/signup/mentee"
                    color="teal"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Apply here
                  </Link>
                </>
              ) : (
                <>
                  Signing up as a Mentee instead?{" "}
                  <Link
                    as={RouterLink}
                    to="/signup/mentor"
                    color="teal"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Sign up here
                  </Link>
                </>
              )}
            </Text>
          </form>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;
