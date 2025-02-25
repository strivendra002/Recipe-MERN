import { useEffect, useState } from "react";
import axios from "axios";
import "../components/Navbar.css";
import "./Home.css"; // Import the CSS file
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  List,
  ListItem,
  Text,
  VStack,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, setUser, fetchUser } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch User Data using JWT Token
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // ✅ Get token from storage
      if (!token) return;

      try {
        const res = await axios.get("https://recipe-mern-noa1.onrender.com/auth/user", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Send JWT
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ✅ Fetch Recommended Recipes based on user preferences
  useEffect(() => {
    if (user) {
      axios
        .get(`https://recipe-mern-noa1.onrender.com/api/recipes/recommendations/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ Send JWT
        })
        .then((res) => setRecipes(res.data))
        .catch((error) => console.error("Error fetching recommendations:", error))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box
      w="100vw"
      h="100vh"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <Box position="absolute" top="0" left="0" width="100%" height="100%" m="auto" />

      <VStack
        zIndex="1"
        bg="rgba(255, 255, 255, 0.3)"
        borderRadius="lg"
        boxShadow="lg"
        p={5}
        w="90%"
      >
        <Heading color="black">Welcome to the Recipe App</Heading>
        <Text fontSize="lg" fontWeight="bold" color="gray.800">
          Discover, save, and manage your favorite recipes.
        </Text>

        {user ? (
          <>
            <Text fontSize="md" fontWeight="bold" color="black">
              Logged in as {user.name}
            </Text>

            <Box textAlign="center">
              <Heading size="md" mt={3}>Your Preferences</Heading>
              <List spacing={1}>
                <ListItem>
                  <strong>Cuisines:</strong> {user.preferences?.cuisines?.join(", ") || "Not Set"}
                </ListItem>
                <ListItem>
                  <strong>Dietary Restrictions:</strong> {user.preferences?.dietaryRestrictions?.join(", ") || "Not Set"}
                </ListItem>
              </List>
            </Box>

            <Button as={Link} to="/profile" className="button-55" mt={3}>
              Update Preferences
            </Button>

            <Heading size="lg" mt={6}>Recommended Recipes</Heading>

            {recipes.length === 0 ? (
              <Text>No recommendations found. Try updating your preferences!</Text>
            ) : (
              <Flex overflowX="auto" w="full" p={3}>
                <HStack spacing={4}>
                  {recipes.map((recipe) => (
                    <Box
                      key={recipe.id}
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      width="250px"
                      bg="white"
                      p={3}
                      boxShadow="lg"
                    >
                      <Image src={recipe.image} alt={recipe.title} borderRadius="md" />
                      <Heading size="md" mt={2} noOfLines={2}>
                        {recipe.title}
                      </Heading>
                      <Button
                        as={Link}
                        to={`/recipes/${recipe.id}`}
                        className="button-55"
                        size="sm"
                        mt={3}
                      >
                        View Details
                      </Button>
                    </Box>
                  ))}
                </HStack>
              </Flex>
            )}
          </>
        ) : (
          <Button as={Link} to="/login" className="button-55">
            Login
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default Home;
