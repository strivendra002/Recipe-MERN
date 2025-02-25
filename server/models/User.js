import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150', // Default avatar
    },
    preferences: {
      cuisines: {
        type: [String],
        default: [], // Example: ["Italian", "Indian"]
      },
      dietaryRestrictions: {
        type: [String],
        default: [], // Example: ["Vegan", "Gluten-Free"]
      },
    },
    favorites: [
      {
        id: {
          type: String, // Recipe ID from Spoonacular API
          // required: true,
          unique: true, // Ensures no duplicate favorite recipes
        },
        title: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

const User = mongoose.model('User', UserSchema);
export default User;
