
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  cloudinary_url: process.env.CLOUDINARY_URL, 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wonderlust_DEV', 
    allowed_formats: ["jpg", "jpeg", "png"],   
  },
});
module.exports = { cloudinary, storage };
