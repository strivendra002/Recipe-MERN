import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// 🔹 Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recipe-app/avatars', // Cloudinary folder
    allowed_formats: ['jpeg', 'jpg', 'png'], // Allowed formats
    transformation: [{ width: 300, height: 300, crop: 'fill' }], // Resize
  },
});

// 🔹 Multer Setup
const upload = multer({ storage });

// ✅ Debugging Logs
console.log('✅ Multer is ready for file uploads');

export default upload;
