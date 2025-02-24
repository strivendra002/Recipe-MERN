import { Box, Flex, Spacer, Button, Heading, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Navbar.css';
const Navbar = () => {
  const { user, setUser, fetchUser } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/auth/logout', { withCredentials: true });
      setUser(null);
      fetchUser(); // Ensure user is removed from session
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box
      p={4}
      color="white"
      // bgImage="url('https://c4.wallpaperflare.com/wallpaper/373/952/839/wooden-spoon-condiments-background-wallpaper-preview.jpg')" // Change this to your actual homepage background image
      bgSize="cover"
      bgPosition="center"
      className="display-flex justyfy-self-center"
    >
      <Flex maxW="1200px" mx="auto" align="center">
        {/* Logo Positioned on the Left */}
        <Flex align="center" justifyContent="flex-start">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
            <Image
              src="https://seeklogo.com/images/R/recipe-logo-EC4BDCE687-seeklogo.com.png"
              alt="Recipe App"
              boxSize="50px"
              mr={2} // Adds space between logo and text
            />
            <Heading size="md">Recipe App</Heading>
          </Link>
        </Flex>

        <Spacer />

        {/* Navigation Buttons */}
        <Button as={Link} to="/search" className='button-55' mr={3}>
          Recipes
        </Button>

        {user ? (
          <>
            <Button as={Link} to="/profile" className='button-55' mr={3}>
              Profile
            </Button>
            <Button as={Link} to="/favorites" className='button-55' mr={3}>
              Favorites
            </Button>
            <Button onClick={handleLogout} className='button-55'>
              Logout
            </Button>
          </>
        ) : (
          <Button as={Link} to="/login" className='button-55'>
            Login
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
