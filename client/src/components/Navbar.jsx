import { Box, Flex, Spacer, Button, Heading, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const { user, setUser, fetchUser } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post("https://recipe-mern-noa1.onrender.com/auth/logout", null, {
        withCredentials: true,
      });

      localStorage.removeItem("token"); // ✅ Clear JWT Token
      setUser(null);
      fetchUser(); // Refresh auth state
      window.location.href = "/"; // Redirect to homepage
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box
      p={4}
      color="white"
      bgSize="cover"
      bgPosition="center"
      className="navbar-container"
    >
      <Flex maxW="1200px" mx="auto" align="center" justifyContent="space-between">
        {/* 🔹 Logo & Title */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "white" }}
        >
          <Image
            src="https://seeklogo.com/images/R/recipe-logo-EC4BDCE687-seeklogo.com.png"
            alt="Recipe App"
            boxSize="50px"
            mr={2} // Adds space between logo and text
          />
          <Heading size="md">Recipe App</Heading>
        </Link>

        {/* 🔹 Navigation Buttons */}
        <Flex align="center">
          <Button as={Link} to="/search" className="button-55" mr={3}>
            Recipes
          </Button>

          {user ? (
            <>
              <Button as={Link} to="/profile" className="button-55" mr={3}>
                Profile
              </Button>
              <Button as={Link} to="/favorites" className="button-55" mr={3}>
                Favorites
              </Button>
              <Button onClick={handleLogout} className="button-55">
                Logout
              </Button>
            </>
          ) : (
            <Button as={Link} to="/login" className="button-55">
              Login
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
