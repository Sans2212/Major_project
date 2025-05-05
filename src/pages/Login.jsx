import { useState, useEffect } from "react";
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
import { getApiUrl, fetchServerPort } from "../config";

const Login = () => {
  const { login } = useAuth();
  const [role, setRole] = useState("mentee");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [step, setStep] = useState(1);
  const [otpMessage, setOtpMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServerPort();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          email: loginEmail.trim(),
          password: loginPassword,
          role: role.trim()
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        login({
          ...data,
          role: role.trim()
        });

        if (role === "mentee") {
          navigate("/", { replace: true });
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
    setIsLoading(true);
    setOtpMessage("");

    try {
      const apiUrl = getApiUrl();
      const endpoint = role === "mentee" 
        ? `${apiUrl}/api/mentees/forgot-password`
        : `${apiUrl}/api/mentors/forgot-password/send-otp`;
        
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      setIsLoading(false);

      if (response.ok) {
        setOtpMessage("OTP sent successfully to your email!");
        setStep(2);
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
    setIsLoading(true);
    try {
      const apiUrl = getApiUrl();
      const endpoint = role === "mentee"
        ? `${apiUrl}/api/mentees/reset-password`
        : `${apiUrl}/api/mentors/forgot-password/reset-password`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: forgotPasswordEmail, 
          otp, 
          newPassword 
        }),
      });
      const data = await response.json();

      setIsLoading(false);
      if (response.ok) {
        alert("Password changed successfully");
        setShowForgotPassword(false);
        setStep(1);
        setForgotPasswordEmail("");
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

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setForgotPasswordEmail("");
    setStep(1);
    setOtpMessage("");
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
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
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
                onClick={handleForgotPasswordClick}
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
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
                <Button
                  colorScheme="teal"
                  onClick={sendOtp}
                  isLoading={isLoading}
                  loadingText="Sending OTP"
                >
                  Send OTP
                </Button>
                {otpMessage && <Text mt={4} color="red.500">{otpMessage}</Text>}
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
