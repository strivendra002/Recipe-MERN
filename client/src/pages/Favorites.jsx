import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Image,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Button,
  Flex,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); // 🔹 Loading state
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      axios
        .get("https://recipe-mern-noa1.onrender.com/api/favorites", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ JWT Token
        })
        .then((res) => setFavorites(res.data))
        .catch((error) => console.error("Error fetching favorites:", error))
        .finally(() => setLoading(false)); // 🔹 Stop loading
    }
  }, [user]);

  const removeFavorite = async (id) => {
    try {
      await axios.delete(`https://recipe-mern-noa1.onrender.com/api/favorites/remove/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ JWT Token
      });

      setFavorites((prev) => prev.filter((fav) => fav.id !== id)); // ✅ UI Updates Instantly
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (!user)
    return (
      <Heading textAlign="center" color="gray.600" mt={10}>
        Please log in to view favorites.
      </Heading>
    );

  return (
    <VStack spacing={6} p={5} align="center">
      <Heading color="gray.700">Your Favorite Recipes</Heading>

      {loading ? ( // 🔹 Show spinner while loading
        <Spinner size="xl" color="teal.500" mt={5} />
      ) : favorites.length === 0 ? (
        <Text fontSize="lg" color="gray.500">
          No favorites added yet.
        </Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6} mt={5} w="100%">
          {favorites.map((recipe) => (
            <Box
              key={recipe.id}
              p={4}
              bg="whiteAlpha.800"
              borderRadius="lg"
              boxShadow="md"
              transition="all 0.3s"
              _hover={{ bg: "white", opacity: 1, transform: "scale(1.05)", boxShadow: "xl" }}
              maxW="300px"
              opacity={0.9}
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
              <Badge mt={2} colorScheme="purple">
                ❤️ Favorite Recipe
              </Badge>

              <Flex mt={4} justify="space-between">
                <Button
                  className="button-55"
                  onClick={() => removeFavorite(recipe.id)}
                  size="sm"
                  flex="1"
                  mr={2}
                >
                  Remove
                </Button>
                <Button as={Link} to={`/recipes/${recipe.id}`} className="button-55" size="sm" flex="1">
                  View
                </Button>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default Favorites;
