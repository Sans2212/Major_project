// CardComponent.jsx
import { Box, Image, Text, Flex } from "@chakra-ui/react";

const CardComponent = ({ name, title, imageUrl }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
      shadow="md"
      width="100%"
      maxW="300px"
    >
      <Flex direction="column" align="center" justify="center" gap={4}>
        <Image
          borderRadius="full"
          boxSize="100px"
          src={imageUrl}
          alt={name}
        />
        <Text fontWeight="bold" fontSize="xl" textAlign="center">
          {name}
        </Text>
        <Text color="gray.500" textAlign="center">
          {title}
        </Text>
      </Flex>
    </Box>
  );
};

export default CardComponent;
