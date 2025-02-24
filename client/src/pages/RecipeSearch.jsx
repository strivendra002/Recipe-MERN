import { useState } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Box,
  SimpleGrid,
  Image,
  Text,
  Heading,
  VStack,
  Spinner,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../components/Navbar.css";

const RecipeSearch = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchRecipes = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${
          import.meta.env.VITE_SPOONACULAR_API_KEY
        }&addRecipeInformation=true`
      );
      setRecipes(response.data.results);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (recipe) => {
    if (!user) {
      alert("Please log in to save favorites.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/favorites/add", recipe, {
        withCredentials: true,
      });
      alert("Recipe added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  return (
    <VStack spacing={6} p={5} align="center">
      <Heading color="gray.700">Search for Recipes</Heading>
      <Flex w="100%" maxW="600px">
        <Input
          placeholder="Enter recipe name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          _focus={{ borderColor: "teal.500", boxShadow: "md" }}
        />
        <Button onClick={fetchRecipes} className="button-55" ml={2} isLoading={loading}>
          Search
        </Button>
      </Flex>

      {loading && <Spinner size="xl" mt={5} />}

      <SimpleGrid columns={[1, 2, 3]} spacing={6} mt={5} w="100%">
        {recipes.map((recipe) => (
          <Box
            key={recipe.id}
            p={4}
            bg="whiteAlpha.800" // Reduced opacity
            borderRadius="lg"
            boxShadow="md"
            transition="all 0.3s"
            _hover={{ bg: "white", opacity: 1, transform: "scale(1.05)", boxShadow: "xl" }}
            maxW="300px"
            opacity={0.9} // Default opacity
          >
            <Image
              src={recipe.image}
              alt={recipe.title}
              borderRadius="lg"
              objectFit="cover"
              w="100%"
              h="200px"
            />
            <Heading size="md" mt={3} color="gray.700" noOfLines={2}>
              {recipe.title}
            </Heading>
            <Badge mt={2} colorScheme="teal">
              🍽 {recipe.servings || "N/A"} servings
            </Badge>

            <Flex mt={4} justify="space-between">
              <Button
                className="button-55"
                onClick={() =>
                  addToFavorites({
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                  })
                }
                size="sm"
                flex="1"
                mr={2}
              >
                Save
              </Button>
              <Button as={Link} to={`/recipes/${recipe.id}`} className="button-55" size="sm" flex="1">
                View
              </Button>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default RecipeSearch;
