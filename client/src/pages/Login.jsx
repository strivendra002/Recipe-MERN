import { useState } from "react";
import axios from "axios";
import { VStack, Input, Button, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser, fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "https://recipe-mern-noa1.onrender.com/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token); // ✅ Store JWT token
      setUser(res.data.user);
      fetchUser(); // ✅ Fetch user data again

      alert("Login successful!");
      navigate("/"); // ✅ Redirect to homepage
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} p={5} maxW="400px" mx="auto">
      <Heading>Login</Heading>

      {error && <Text color="red.500">{error}</Text>}

      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button colorScheme="teal" onClick={handleLogin} isLoading={loading}>
        Login
      </Button>

      <Text>
        Don't have an account?{" "}
        <a href="/register" style={{ color: "blue" }}>Register</a>
      </Text>
    </VStack>
  );
};

export default Login;
