const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = './uploads/';
    
    // Change destination based on file type
    if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    } else if (file.mimetype === 'application/pdf') {
      uploadPath += 'documents/';
    } else {
      uploadPath += 'others/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const filetypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv/;
  
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);
  
  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file format'));
  }
};

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

module.exports = upload; 