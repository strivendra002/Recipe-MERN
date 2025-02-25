import { useState } from "react";
import axios from "axios";
import { VStack, Input, Button, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ For redirecting after registration

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    if (!name || !email || !password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "https://recipe-mern-noa1.onrender.com/api/auth/register",
        { name, email, password }
      );

      alert("Registration successful! Please login.");
      navigate("/login"); // ✅ Redirect to login page
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} p={5} maxW="400px" mx="auto">
      <Heading>Register</Heading>

      {error && <Text color="red.500">{error}</Text>}

      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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

      <Button colorScheme="teal" onClick={handleRegister} isLoading={loading}>
        Register
      </Button>

      <Text>
        Already have an account? <a href="/login" style={{ color: "blue" }}>Login</a>
      </Text>
    </VStack>
  );
};

export default Register;
