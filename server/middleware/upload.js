import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recipe-app/avatars', // Cloudinary folder name
    allowed_formats: ['jpeg', 'jpg', 'png'], // Allowed image types
    transformation: [{ width: 300, height: 300, crop: 'fill' }], // Resize image
  },
});

const upload = multer({ storage });
upload.single('avatar'); // Debugging 
console.log('✅ Multer is ready for uploads');

export default upload;
