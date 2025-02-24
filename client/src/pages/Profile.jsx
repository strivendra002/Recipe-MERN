import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Avatar,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import './Profile.css';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Ensure initial state is always an array to avoid errors
  const [cuisines, setCuisines] = useState(user?.preferences?.cuisines || []);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    user?.preferences?.dietaryRestrictions || []
  );

  useEffect(() => {
    if (user) {
      setCuisines(user.preferences?.cuisines || []);
      setDietaryRestrictions(user.preferences?.dietaryRestrictions || []);
    }
  }, [user]);

  // ✅ Show loading if user data is not ready
  if (!user) {
    return <Heading textAlign="center">Not Logged In</Heading>;
  }

  const updatePreferences = async () => {
    if (!user || !user._id) {
      alert("User not found!");
      return;
    }

    try {
      await axios.put(
        `https://recipe-mern-noa1.onrender.com/api/user/${user._id}`, // ✅ Fix the URL
        { cuisines, dietaryRestrictions },
        { withCredentials: true }
      );
      alert("Preferences updated!");
      fetchUser(); // Refresh user data
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadAvatar = async () => {
    if (!file) return alert("Please select a file");
    setLoading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await axios.put(
        "https://recipe-mern-noa1.onrender.com/api/user/profile/avatar",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Avatar updated!");
      fetchUser(); // Refresh user data
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} p={5}>
      {/* ✅ Ensure avatar URL exists */}
      <Avatar
        size="xl"
        src={user.avatar || "https://via.placeholder.com/150"}
      />
      <Heading>{user.name}</Heading>
      <Text>Email: {user.email}</Text>

      {/* 🔹 Avatar Upload */}
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      <Button className='button-55' onClick={uploadAvatar} isLoading={loading}>
        Upload New Avatar
      </Button>

      {/* 🥗 User Preferences */}
      <Box textAlign="center">
        <Heading size="md">Your Preferences</Heading>

        {/* ✅ Ensure inputs never break UI */}
        <Input
          placeholder="Cuisines (e.g., Italian, Mexican)"
          value={cuisines.length > 0 ? cuisines.join(", ") : ""}
          onChange={(e) =>
            setCuisines(
              e.target.value
                ? e.target.value.split(",").map((c) => c.trim())
                : []
            )
          }
        />

        <Input
          placeholder="Dietary Restrictions (e.g., Vegan, Gluten-Free)"
          value={
            dietaryRestrictions.length > 0 ? dietaryRestrictions.join(", ") : ""
          }
          onChange={(e) =>
            setDietaryRestrictions(
              e.target.value
                ? e.target.value.split(",").map((d) => d.trim())
                : []
            )
          }
        />

        <Button className='button-55' onClick={updatePreferences} mt={3}>
          Save Preferences
        </Button>
      </Box>
    </VStack>
  );
};

export default Profile;
