import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  Alert,
  AlertIcon,
  FormHelperText,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { saveUserSettings, fetchUserSettings } from "../utils/settingsUtils";

const calendlyUrlPattern = /^https:\/\/calendly\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)?\/?$/;

const CalendlyIntegration = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [settings, setSettings] = useState({ calendlyUrl: "", fullName: "", phone: "" });
  const [calendlyUrlValid, setCalendlyUrlValid] = useState(null);
  const [checkingCalendly, setCheckingCalendly] = useState(false);
  const [calendlyCheckAttempted, setCalendlyCheckAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing Calendly URL if available
  useState(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const data = await fetchUserSettings(user, token);
        setSettings((prev) => ({
          ...prev,
          calendlyUrl: data.calendlyUrl || "",
          fullName: data.fullName || "",
          phone: data.phone || ""
        }));
      } catch (error) {
        // ignore
      }
    };
    loadSettings();
  }, [user]);

  const handleInputChange = (value) => {
    setSettings((prev) => ({ ...prev, calendlyUrl: value }));
    setCalendlyCheckAttempted(false);
    setCalendlyUrlValid(null);
  };

  const checkCalendlyUrl = async (url) => {
    setCheckingCalendly(true);
    try {
      const response = await fetch('http://localhost:3001/api/mentors/check-calendly-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendlyUrl: url }),
      });
      const data = await response.json();
      setCalendlyUrlValid(data.exists);
    } catch {
      setCalendlyUrlValid(false);
    }
    setCheckingCalendly(false);
  };

  const handleSave = async () => {
    if (settings.calendlyUrl) {
      if (!calendlyCheckAttempted || !calendlyUrlValid || !calendlyUrlPattern.test(settings.calendlyUrl)) {
        toast({
          title: "Invalid Calendly URL",
          description: "Please check and validate your Calendly URL before saving.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      await saveUserSettings(user, settings, token);
      toast({
        title: "Success",
        description: "Calendly URL updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to save Calendly URL",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="lg" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <Box mb={2}>
          <FaCalendarAlt style={{ display: "inline", marginRight: "8px" }} />
          <b>Calendly Integration</b>
        </Box>
        <FormControl isInvalid={settings.calendlyUrl && !calendlyUrlPattern.test(settings.calendlyUrl)}>
          <FormLabel>Your Calendly URL</FormLabel>
          <Input
            placeholder="https://calendly.com/your-username"
            value={settings.calendlyUrl || ''}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <Button
            mt={2}
            colorScheme="teal"
            size="sm"
            onClick={() => { setCalendlyCheckAttempted(true); checkCalendlyUrl(settings.calendlyUrl); }}
            isLoading={checkingCalendly}
            isDisabled={!settings.calendlyUrl || !calendlyUrlPattern.test(settings.calendlyUrl)}
          >
            Check your URL
          </Button>
          <FormHelperText>
            Add your Calendly URL to enable mentees to schedule calls with you. Make sure to include the full URL (e.g., https://calendly.com/your-username)
          </FormHelperText>
          {checkingCalendly && calendlyCheckAttempted && (
            <Text color="blue.500" fontSize="sm" mt={1}>
              Checking Calendly URL...
            </Text>
          )}
          {calendlyCheckAttempted && !calendlyUrlPattern.test(settings.calendlyUrl) && settings.calendlyUrl && (
            <Text color="red.500" fontSize="sm" mt={1}>
              Please enter a valid Calendly booking URL (e.g., https://calendly.com/your-username)
            </Text>
          )}
          {calendlyCheckAttempted && calendlyUrlValid === false && calendlyUrlPattern.test(settings.calendlyUrl) && (
            <Text color="red.500" fontSize="sm" mt={1}>
              This Calendly URL does not exist. Please check your username.
            </Text>
          )}
        </FormControl>
        {calendlyCheckAttempted && calendlyUrlValid && calendlyUrlPattern.test(settings.calendlyUrl) && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            Your Calendly URL is set up! Mentees can now schedule calls with you.
          </Alert>
        )}
        <Button
          colorScheme="teal"
          onClick={handleSave}
          isLoading={isLoading}
          loadingText="Saving..."
          isDisabled={
            isLoading ||
            (settings.calendlyUrl && (!calendlyCheckAttempted || !calendlyUrlValid || !calendlyUrlPattern.test(settings.calendlyUrl)))
          }
        >
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default CalendlyIntegration; 