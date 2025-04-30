import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate(); // ✅ add navigate hook

  const handleSendOTP = async () => {
    if (!email) {
      toast({
        title: "Please enter your email.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/api/mentees/forgot-password", {
        email,
      });

      if(!response.ok){
        toast.error("Something went Wrong!");
      }

      toast({
        title: "OTP Sent!",
        description: response.data.message,
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      // ✅ Navigate to OTP verification page with email in state
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to send OTP",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex w="100%" h="100vh" justify="center" align="center" bg="gray.50">
      <Box p={8} maxW="md" bg="white" borderRadius="xl" boxShadow="md" w="full">
        <Heading mb={6} textAlign="center" size="lg">
          Forgot Password
        </Heading>
        <VStack spacing={4}>
          <Input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            focusBorderColor="teal.500"
          />
          <Button
            colorScheme="teal"
            w="full"
            onClick={handleSendOTP}
            isLoading={loading}
          >
            Send OTP
          </Button>
          <Text>
            Back to{" "}
            <Link as={RouterLink} to="/login" color="teal.500">
              Login
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ForgotPassword;
