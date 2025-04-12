import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    console.log(`Processing file: ${file.originalname} (${file.mimetype})`);
    
    return {
      folder: 'calendar-events',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4'],
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    };
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Invalid file type. Only images (JPEG, PNG, GIF) and MP4 videos are allowed.');
    error.code = 'LIMIT_FILE_TYPE';
    return cb(error, false);
  }
  
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 1 
  },
  onError: (err, next) => {
    console.error('Multer error:', err);
    next(err);
  }
});

const uploadMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('mediaUrl');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message);
      
      if (err.code === 'LIMIT_FILE_TYPE') {
        return res.status(400).json({ 
          success: false,
          message: err.message
        });
      }
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 20MB.'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'File upload failed',
      });
    }
    
    if (req.file) {
      console.log('Successfully uploaded:', {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        cloudinaryUrl: req.file.path
      });
    } else {
      console.log('No file uploaded (optional)');
    }
    
    next();
  });
};

export default uploadMiddleware;