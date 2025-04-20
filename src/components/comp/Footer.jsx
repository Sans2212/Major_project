import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const mentorCategories = [
    "Engineering Mentors",
    "Design Mentors",
    "Startup Mentors",
    "Product Managers",
    "Marketing Coaches",
    "Leadership Mentors",
    "Career Coaches",
    "Top Mentors",
  ];

  return (
    <Box p={8} textAlign="center">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",  // 4 equal columns
          rowGap: "8px",                          // Gap between rows
          columnGap: "40px",                      // Gap between columns
          justifyContent: "center",               // Center the grid in container
        }}
      >
        {mentorCategories.map((category) => (
          <Button
            key={category}
            variant="link"
            color="black"
            colorScheme="teal"
            onClick={() =>
              navigate(
                `/mentors/${encodeURIComponent(
                  category.toLowerCase().replace(/\s+/g, "-")
                )}`
              )
            }
            _hover={{
              bg: "gray.200",
              borderRadius: "md",
            }}
          >
            {category}
          </Button>
        ))}
      </div>

      <Text color="gray.600" fontSize="sm" mt={4}>
        © {new Date().getFullYear()} Mentor Connect. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
