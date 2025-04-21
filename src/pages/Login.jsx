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
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Link,
} from "@chakra-ui/react";
import logo from "../assets/main_logo.png";

const Login = () => {
  const [role, setRole] = useState("mentee");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // 👇 Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    if (role === "mentee") {
      navigate("/home/mentee");
    } else {
      navigate("/home/mentor");
    }
  };

  const sendOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("OTP sent to your email!");
        setStep(2);
      } else {
        alert("Failed to send OTP: " + data.error);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP. Try again.");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("OTP verified successfully!");
        setStep(3);
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Error verifying OTP. Try again.");
    }
  };

  const resetPassword = () => {
    alert("Password changed successfully");
    setShowForgotPassword(false);
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
  };

  return (
    <Flex w="100%" h="100vh" flexDirection={{ base: "column", md: "row" }}>
      {/* Left Side with Logo */}
      <Flex
        w={{ base: "100%", md: "40%" }}
        bgGradient="linear(to-b, teal.600, green.600)"
        align="center"
        justify="center"
        p={6}
      >
        <Image
          src={logo}
          alt="Mentor Connect Logo"
          boxSize="150px"
          cursor="pointer"
          onClick={() => navigate("/")}
        />
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

          {/* Toggle Buttons */}
          <HStack spacing={4} mb={6}>
            <Button
              variant={role === "mentee" ? "solid" : "outline"}
              colorScheme="teal"
              onClick={() => setRole("mentee")}
            >
              I&apos;m a mentee
            </Button>
            <Button
              variant={role === "mentor" ? "solid" : "outline"}
              colorScheme="teal"
              onClick={() => setRole("mentor")}
            >
              I&apos;m a mentor
            </Button>
          </HStack>

          <form>
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

            {/* 👇 Login Button (calls handleLogin) */}
            <Button onClick={handleLogin} w="full" colorScheme="teal" mb={4}>
              Log in as {role === "mentee" ? "Mentee" : "Mentor"}
            </Button>

            <Flex justify="space-between" align="center" mb={4}>
              <Link
                as={RouterLink}
                to="#"
                color="teal"
                _hover={{ textDecoration: "underline" }}
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </Link>
            </Flex>

            <Text>
              {role === "mentee" ? (
                <>
                  Sign up as a Mentee?{" "}
                  <Link
                    as={RouterLink}
                    to="/signup/mentee"
                    color="teal"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Click here
                  </Link>
                </>
              ) : (
                <>
                  Sign up to become a Mentor?{" "}
                  <Link
                    as={RouterLink}
                    to="/signup/mentor"
                    color="teal"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Click here
                  </Link>
                </>
              )}
            </Text>
          </form>
        </Box>
      </Flex>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {step === 1 && (
              <VStack spacing={4}>
                <Text>Enter your email to receive OTP</Text>
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button colorScheme="teal" onClick={sendOtp}>
                  Send OTP
                </Button>
              </VStack>
            )}

            {step === 2 && (
              <VStack spacing={4}>
                <Text>Enter OTP sent to your email</Text>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button colorScheme="teal" onClick={verifyOtp}>
                  Verify OTP
                </Button>
              </VStack>
            )}

            {step === 3 && (
              <VStack spacing={4}>
                <Text>Enter new password</Text>
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button colorScheme="teal" onClick={resetPassword}>
                  Reset Password
                </Button>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Login;
