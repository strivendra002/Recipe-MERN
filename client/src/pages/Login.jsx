import { Button, VStack, Heading } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import './Favorites.css'
const Login = () => {
  const { fetchUser } = useAuth();

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:5000/auth/google";

    // Delay refresh to fetch user data
    setTimeout(() => {
      fetchUser();
    }, 3000);
  };

  return (
    <VStack spacing={4} justify="center" h="100vh">
      <Heading>Login to Recipe App</Heading>
      <Button className="button-55" onClick={handleGoogleLogin}>
        Sign in with Google
      </Button>
    </VStack>
  );
};

export default Login;
