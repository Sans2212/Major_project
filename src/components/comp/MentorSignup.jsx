<<<<<<< HEAD
// import React from "react";
=======
>>>>>>> 4622fcfd0f640e1a8e2fdf303078100144d9af8a
import { Button, Container, Heading, Stack, Text, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const MentorSignup = () => {
  const navigate = useNavigate();

  return (
    <Box bgGradient="linear(to-r, blue.50, teal.100)" py={16} minHeight= "80vh">
      <Container maxW="4xl" centerContent textAlign="center">
        <Heading
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          fontWeight="bold"
          color="gray.800"
          mb={4}
        >
          Share your expertise, grow, <br />
          <Text as="span" color="blue.700">make a difference</Text>
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={8}>
          Mentoring is a two-way street. Let us take care of the boring parts so you can
          concentrate on personal and professional growth for both you and your mentees.
        </Text>
        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate("/signup/mentor/form")}
          >
            Become a mentor
          </Button>
          <Button
            variant="outline"
            colorScheme="teal"
            size="lg"
            onClick={() => navigate("/faq")}
          >
            Frequently asked questions
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default MentorSignup;
