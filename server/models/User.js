import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    preferences: {
      cuisines: [{ type: String }], // Example: ["Italian", "Indian"]
      dietaryRestrictions: [{ type: String }], // Example: ["Vegan", "Gluten-Free"]
    },
    favorites: [
      {
        id: Number, // Recipe ID from Spoonacular
        title: String,
        image: String,
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

const User = mongoose.model('User', UserSchema);
export default User;
