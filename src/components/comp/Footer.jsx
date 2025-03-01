
import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box p={8} textAlign="center">
      <Text color="gray.600" fontSize="sm">
        © {new Date().getFullYear()} Mentor Connect. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
