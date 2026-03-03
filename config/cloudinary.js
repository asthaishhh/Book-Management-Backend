import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: 'duswqkqs8',
  api_key: '117478643227311',
  api_secret: '26YjW3nd4eiXCMQlo2BhJhZCRXs',
});

export default cloudinary;
