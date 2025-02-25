import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  List,
  ListItem,
  Spinner,
  Divider,
  Badge,
} from "@chakra-ui/react";

const RecipeDetails = () => {
  const { id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://recipe-mern-noa1.onrender.com/api/recipes/${id}`)
      .then((res) => setRecipe(res.data))
      .catch((error) => console.error("Error fetching recipe details:", error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <VStack justify="center" align="center" height="70vh">
        <Spinner size="xl" color="teal.500" />
      </VStack>
    );

  return (
    <Box
      p={6}
      maxW="800px"
      mx="auto"
      boxShadow="xl"
      borderRadius="lg"
      bg="whiteAlpha.900"
      opacity={0.98}
    >
      <Heading textAlign="center" color="gray.700">
        {recipe.title}
      </Heading>

      <Image
        src={recipe.image}
        alt={recipe.title}
        borderRadius="lg"
        mt={4}
        boxShadow="md"
        w="100%"
        maxH="400px"
        objectFit="cover"
      />

      {/* 🥕 Ingredients */}
      <Heading size="md" mt={6} color="teal.600">
        Ingredients:
      </Heading>
      <Box
        p={4}
        bg="gray.50"
        borderRadius="md"
        mt={3}
        boxShadow="sm"
        _hover={{ bg: "gray.100" }}
      >
        {recipe.extendedIngredients?.length > 0 ? (
          <List spacing={2}>
            {recipe.extendedIngredients.map((ing) => (
              <ListItem key={ing.id} fontSize="md" color="gray.700">
                ✅ {ing.original}
              </ListItem>
            ))}
          </List>
        ) : (
          <Text color="gray.600">No ingredients available.</Text>
        )}
      </Box>

      {/* 🍽 Instructions */}
      <Heading size="md" mt={6} color="teal.600">
        Instructions:
      </Heading>
      <Text
        mt={3}
        bg="gray.50"
        p={4}
        borderRadius="md"
        boxShadow="sm"
        _hover={{ bg: "gray.100" }}
        fontSize="md"
        color="gray.700"
      >
        {recipe.instructions || "No instructions available."}
      </Text>

      {/* 🔥 Nutrition Info */}
      <Heading size="md" mt={6} color="teal.600">
        Nutritional Information:
      </Heading>
      <Box
        p={4}
        bg="gray.50"
        borderRadius="md"
        mt={3}
        boxShadow="sm"
        _hover={{ bg: "gray.100" }}
      >
        <Text>
          <Badge colorScheme="green" mr={2}>
            Calories:
          </Badge>
          {recipe.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount || "N/A"} kcal
        </Text>
        <Divider my={2} />
        <Text>
          <Badge colorScheme="blue" mr={2}>
            Protein:
          </Badge>
          {recipe.nutrition?.nutrients?.find((n) => n.name === "Protein")?.amount || "N/A"} g
        </Text>
        <Divider my={2} />
        <Text>
          <Badge colorScheme="orange" mr={2}>
            Carbs:
          </Badge>
          {recipe.nutrition?.nutrients?.find((n) => n.name === "Carbohydrates")?.amount || "N/A"} g
        </Text>
      </Box>
    </Box>
  );
};

export default RecipeDetails;
