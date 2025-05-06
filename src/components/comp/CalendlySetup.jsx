import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaCalendarAlt } from "react-icons/fa";

const CalendlySetup = ({ mentorCalendlyUrl, isMentee = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");

  const handleCalendlySetup = () => {
    window.open("https://calendly.com/signup", "_blank");
  };

  const handleScheduleCall = () => {
    if (mentorCalendlyUrl) {
      window.open(mentorCalendlyUrl, "_blank");
    } else {
      onOpen();
    }
  };

  return (
    <>
      <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" w="full">
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="purple.600">
            <FaCalendarAlt style={{ display: "inline", marginRight: "8px" }} />
            {isMentee ? "Schedule a Call" : "Set Up Calendly"}
          </Heading>
          
          {isMentee ? (
            <>
              <Text color={textColor}>
                Schedule a video call with your mentor to discuss your goals and create a mentoring plan.
              </Text>
              <Button
                colorScheme="purple"
                size="lg"
                onClick={handleScheduleCall}
                leftIcon={<FaCalendarAlt />}
              >
                Schedule Call
              </Button>
            </>
          ) : (
            <>
              <Text color={textColor}>
                To enable video calls with your mentees, you&apos;ll need to set up a Calendly account.
                This will help manage your availability and schedule mentoring sessions efficiently.
              </Text>
              <Button
                colorScheme="purple"
                size="lg"
                onClick={handleCalendlySetup}
                leftIcon={<FaCalendarAlt />}
              >
                Set Up Calendly Account
              </Button>
            </>
          )}
        </VStack>
      </Box>

      {/* Modal for when mentor hasn't set up Calendly */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Calendly Account Required</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Text>
                To schedule calls with mentors, you&apos;ll need a Calendly account. This helps manage your availability and schedule mentoring sessions efficiently.
              </Text>
              <Button
                colorScheme="purple"
                onClick={handleCalendlySetup}
                leftIcon={<FaCalendarAlt />}
              >
                Set Up Calendly Account
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CalendlySetup; 