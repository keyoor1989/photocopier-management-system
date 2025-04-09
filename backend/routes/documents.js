const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Documents only!');
    }
  }
});

// Import controllers (we'll create these next)
const {
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  getDocumentsByType,
  getDocumentsByEntity
} = require('../controllers/documents');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getDocuments)
  .post(authorize('admin', 'manager'), upload.single('document'), uploadDocument);

router.route('/:id')
  .get(getDocument)
  .put(authorize('admin', 'manager'), updateDocument)
  .delete(authorize('admin'), deleteDocument);

// Additional document-specific routes
router.get('/:id/download', downloadDocument);
router.get('/type/:type', getDocumentsByType);
router.get('/entity/:entityType/:entityId', getDocumentsByEntity);

module.exports = router; 