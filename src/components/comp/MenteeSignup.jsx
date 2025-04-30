import axios from "axios";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Image,
  Heading,
  Button,
  Input,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";
import logo from "../../assets/main_logo.png";

const MenteeSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const menteeData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: "mentee",
    };

    try {
      // Correct API route
      const response = await axios.post("http://localhost:3001/api/auth/signup", menteeData);
      alert("Signup successful! 🎉");
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <Flex w="100%" h="100vh" flexDirection={{ base: "column", md: "row" }}>
      <Flex
        w={{ base: "100%", md: "40%" }}
        bgGradient="linear(to-b, teal.600, green.600)"
        align="center"
        justify="center"
        p={6}
      >
        <Link as={RouterLink} to="/">
          <Image src={logo} alt="Logo" boxSize="150px" cursor="pointer" />
        </Link>
      </Flex>

      <Flex
        w={{ base: "100%", md: "60%" }}
        align="center"
        justify="center"
        p={6}
      >
        <Box w="full" maxW="md">
          <Heading mb={6}>Sign up as Mentee</Heading>
          <form onSubmit={handleSubmit}>
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
            </VStack>

            <Button type="submit" w="full" colorScheme="teal" mb={4}>
              Sign up as Mentee
            </Button>

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

export default MenteeSignup;
