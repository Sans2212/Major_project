import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Switch,
  Text,
  Heading,
  Divider,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchUserSettings, saveUserSettings } from "../utils/settingsUtils";

const Settings = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    email: "",
    fullName: "",
    phone: "",
    notifications: {
      email: true,
      messages: true,
      updates: true,
    },
    privacy: {
      showProfile: true,
      showEmail: false,
      showPhone: false,
    },
  });

  const initialTab = location.pathname.includes("privacy") ? 1 : 0;
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const data = await fetchUserSettings(user, token);
        setSettings(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load settings",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    loadSettings();
  }, [user, toast]);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }));
  };

  const handlePrivacyChange = (field) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: !prev.privacy[field]
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      await saveUserSettings(user, settings, token);
      
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
        description: error.response?.data?.message || "Failed to save settings",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" py={10} bg={useColorModeValue("gray.50", "gray.900")}>
      <Container maxW="container.md">
        <Heading mb={6}>Settings</Heading>
        <Box bg={bgColor} borderRadius="lg" boxShadow="md" overflow="hidden">
          <Tabs defaultIndex={initialTab}>
            <TabList px={4} borderBottomColor={borderColor}>
              <Tab>Account Settings</Tab>
              <Tab>Privacy Settings</Tab>
            </TabList>

            <TabPanels>
              {/* Account Settings Panel */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      value={settings.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      value={settings.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </FormControl>

                  <Divider />

                  <Box>
                    <Text fontWeight="bold" mb={4}>Notification Preferences</Text>
                    <VStack align="start" spacing={4}>
                      <FormControl display="flex" alignItems="center">
                        <Switch
                          id="email-notifications"
                          isChecked={settings.notifications.email}
                          onChange={() => handleNotificationChange("email")}
                          mr={3}
                        />
                        <FormLabel htmlFor="email-notifications" mb={0}>
                          Email Notifications
                        </FormLabel>
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <Switch
                          id="message-notifications"
                          isChecked={settings.notifications.messages}
                          onChange={() => handleNotificationChange("messages")}
                          mr={3}
                        />
                        <FormLabel htmlFor="message-notifications" mb={0}>
                          Message Notifications
                        </FormLabel>
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <Switch
                          id="update-notifications"
                          isChecked={settings.notifications.updates}
                          onChange={() => handleNotificationChange("updates")}
                          mr={3}
                        />
                        <FormLabel htmlFor="update-notifications" mb={0}>
                          Platform Updates
                        </FormLabel>
                      </FormControl>
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Privacy Settings Panel */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Text fontWeight="bold" mb={2}>Profile Visibility</Text>
                  
                  <FormControl display="flex" alignItems="center">
                    <Switch
                      id="show-profile"
                      isChecked={settings.privacy.showProfile}
                      onChange={() => handlePrivacyChange("showProfile")}
                      mr={3}
                    />
                    <FormLabel htmlFor="show-profile" mb={0}>
                      Show my profile in search results
                    </FormLabel>
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <Switch
                      id="show-email"
                      isChecked={settings.privacy.showEmail}
                      onChange={() => handlePrivacyChange("showEmail")}
                      mr={3}
                    />
                    <FormLabel htmlFor="show-email" mb={0}>
                      Show my email to connected users
                    </FormLabel>
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <Switch
                      id="show-phone"
                      isChecked={settings.privacy.showPhone}
                      onChange={() => handlePrivacyChange("showPhone")}
                      mr={3}
                    />
                    <FormLabel htmlFor="show-phone" mb={0}>
                      Show my phone number to connected users
                    </FormLabel>
                  </FormControl>

                  <Text fontSize="sm" color="gray.500" mt={4}>
                    Note: Some information may still be visible to users you&apos;re actively mentoring or being mentored by.
                  </Text>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Box p={4} borderTop="1px" borderColor={borderColor}>
            <HStack spacing={4} justify="flex-end">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                colorScheme="teal"
                onClick={handleSaveSettings}
                isLoading={isLoading}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
            </HStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Settings; 