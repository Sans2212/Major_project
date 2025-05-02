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
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [role, setRole] = useState("mentee");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [step, setStep] = useState(1);
  const [otpMessage, setOtpMessage] = useState(""); // Message for OTP status
  const [isLoading, setIsLoading] = useState(false); // Loading state for button
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          email: email.trim(),
          password: loginPassword,
          role: role.trim()
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Use the login function from auth context
        login({
          ...data,
          role: role.trim() // Ensure role is included in the login data
        });

        // Redirect based on role
        if (role === "mentee") {
          navigate("/home/mentee", { replace: true });
        } else {
          navigate("/my-profile", { replace: true });
        }
      } else {
        console.error("Login failed:", data.error);
        alert(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error logging in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async () => {
    setIsLoading(true); // Set loading to true while sending OTP
    setOtpMessage(""); // Clear previous messages

    try {
      const response = await fetch("http://localhost:3001/api/mentees/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setIsLoading(false); // Reset loading state

      if (response.ok) {
        setOtpMessage("OTP sent successfully to your email!");
        setStep(2); // Move to the next step after OTP is sent
      } else {
        const errorData = await response.json();
        setOtpMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setIsLoading(false);
      setOtpMessage("Failed to send OTP. Please try again later.");
      console.error("Error sending OTP:", error.message || error);
    }
  };

  const resetPassword = async () => {
    setIsLoading(true); // Set loading to true while resetting password
    try {
      const response = await fetch("http://localhost:3001/api/mentees/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();

      setIsLoading(false); // Reset loading state
      if (response.ok) {
        alert("Password changed successfully");
        setShowForgotPassword(false);
        setStep(1); // Reset to step 1
        setEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        alert("Failed to reset password: " + data.error);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error resetting password:", error);
      alert("Error resetting password. Try again.");
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
        <Image
          src={logo}
          alt="Mentor Connect Logo"
          boxSize="150px"
          cursor="pointer"
          onClick={() => navigate("/")}
        />
      </Flex>

      <Flex
        w={{ base: "100%", md: "60%" }}
        align="center"
        justify="center"
        p={6}
      >
        <Box w="full" maxW="md">
          <Heading mb={6}>Log in</Heading>

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

          <form onSubmit={handleLogin}>
            <VStack spacing={4} mb={4}>
              <Box w="full">
                <Text mb={1}>Email</Text>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  focusBorderColor="teal.500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>
              <Box w="full">
                <Text mb={1}>Password</Text>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  focusBorderColor="teal.500"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </Box>
            </VStack>

            <Button type="submit" w="full" colorScheme="teal" mb={4}>
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
      <Modal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)}>
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
                <Button
                  colorScheme="teal"
                  onClick={sendOtp}
                  isLoading={isLoading}
                  loadingText="Sending OTP"
                >
                  Send OTP
                </Button>
                {otpMessage && <Text mt={4} color="red.500">{otpMessage}</Text>} {/* OTP message */}
              </VStack>
            )}

            {step === 2 && (
              <VStack spacing={4}>
                <Text>Enter OTP and new password</Text>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  colorScheme="teal"
                  onClick={resetPassword}
                  isLoading={isLoading}
                  loadingText="Resetting"
                >
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
