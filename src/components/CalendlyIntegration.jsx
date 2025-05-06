import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  FormHelperText,
  Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { saveUserSettings, fetchUserSettings } from "../utils/settingsUtils";

const calendlyUrlPattern = /^https:\/\/calendly\.com\/[a-zA-Z0-9-]+(\/[a-zA-Z0-9-]+)?$/;

const CalendlyIntegration = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [settings, setSettings] = useState({ calendlyUrl: "", fullName: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
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
      } catch (loadError) {
        console.error('Error loading settings:', loadError);
        // ignore
      }
    };
    loadSettings();
  }, [user]);

  const handleInputChange = (value) => {
    setSettings((prev) => ({ ...prev, calendlyUrl: value }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (settings.calendlyUrl) {
      if (!calendlyUrlPattern.test(settings.calendlyUrl)) {
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
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (!userFromStorage || !userFromStorage.role) {
        throw new Error("User or role is missing");
      }
      await saveUserSettings(userFromStorage, settings, token);
      setIsSaved(true);
      toast({
        title: "Success",
        description: "Settings updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Box maxW="lg" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Text>Please log in to access this feature.</Text>
      </Box>
    );
  }

  return (
    <Box maxW="lg" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <Heading size="md">
          <FaCalendarAlt style={{ display: "inline", marginRight: "8px" }} />
          {user.role === 'mentor' ? 'Calendly Integration' : 'Profile Settings'}
        </Heading>

        {user.role === 'mentor' ? (
          <FormControl isInvalid={settings.calendlyUrl && !settings.calendlyUrl.startsWith('https://calendly.com/')}>
            <FormLabel>Your Calendly URL</FormLabel>
            <Input
              placeholder="https://calendly.com/your-username"
              value={settings.calendlyUrl || ''}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <FormHelperText>
              Add your Calendly URL to enable mentees to schedule calls with you. Make sure to include the full URL (e.g., https://calendly.com/your-username)
            </FormHelperText>
            {settings.calendlyUrl && !settings.calendlyUrl.startsWith('https://calendly.com/') && (
              <Text color="red.500" fontSize="sm" mt={1}>
                Please enter a valid Calendly booking URL (e.g., https://calendly.com/your-username)
              </Text>
            )}
          </FormControl>
        ) : (
          <Text>
            As a mentee, you can schedule calls with mentors through their Calendly links on their profile pages.
          </Text>
        )}

        <Button
          colorScheme="teal"
          onClick={handleSave}
          isLoading={isLoading}
          loadingText="Saving..."
          isDisabled={
            isLoading ||
            (user.role === 'mentor' && settings.calendlyUrl && !settings.calendlyUrl.startsWith('https://calendly.com/')) ||
            isSaved
          }
        >
          {isSaved ? 'Saved' : 'Save Changes'}
        </Button>
      </VStack>
    </Box>
  );
};

export default CalendlyIntegration; 