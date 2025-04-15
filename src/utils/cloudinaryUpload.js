// const uploadImageToCloudinary = async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', 'ml_default'); // Replace with your Cloudinary upload preset
  
//       const response = await fetch('https://api.cloudinary.com/v1_1/dmkhjn2ii/image/upload', {
//         method: 'POST',
//         body: formData,
//       });
  
//       const data = await response.json();
      
//       if (data.secure_url) {
//         return {
//           success: true,
//           url: data.secure_url,
//           publicId: data.public_id
//         };
//       } else {
//         return {
//           success: false,
//           error: 'Upload failed'
//         };
//       }
//     } catch (error) {
//       console.error('Error uploading to Cloudinary:', error);
//       return {
//         success: false,
//         error: error.message || 'Upload failed'
//       };
//     }
//   };
  
//   export default uploadImageToCloudinary;

  const uploadImageToCloudinary = async (file, folder = 'learning_platform') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Replace with your Cloudinary upload preset
      formData.append('folder', folder);
  
      const response = await fetch('https://api.cloudinary.com/v1_1/dmkhjn2ii/auto/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      
      if (data.secure_url) {
        return {
          success: true,
          url: data.secure_url,
          publicId: data.public_id,
          fileType: data.resource_type
        };
      } else {
        return {
          success: false,
          error: 'Upload failed'
        };
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  };
  
  export default uploadImageToCloudinary;