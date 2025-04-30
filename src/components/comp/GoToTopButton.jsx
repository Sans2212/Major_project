import { useState, useEffect } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { FaArrowUp } from "react-icons/fa";

const GoToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <Box
      position="fixed"
      bottom="30px"
      right="30px"
      zIndex="1000"
      opacity={isVisible ? 1 : 0}
      transition="opacity 0.3s ease-in-out"
      pointerEvents={isVisible ? "auto" : "none"}
    >
      <IconButton
        aria-label="Go to top"
        icon={<FaArrowUp />}
        onClick={scrollToTop}
        size="lg"
        colorScheme="teal"
        borderRadius="full"
        boxShadow="lg"
        _hover={{
          transform: "scale(1.1)",
          transition: "transform 0.2s ease-in-out",
        }}
      />
    </Box>
  );
};

export default GoToTopButton; 