import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from 'fs'; // file system default comes with node js

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload files
        cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        //file has been uploaded successfully
        console.log(`file has been uploaded successfully.`);
        console.log(response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file
        return null;
    }
}


export {
    uploadOnCloudinary
}
