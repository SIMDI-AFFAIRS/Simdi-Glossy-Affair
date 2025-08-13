// server.js (ES module version with import statements)
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to your React app's public folder
const uploadDir = path.join(__dirname, 'public', 'img', 'shopItems');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = req.body.filename || `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Upload endpoint
app.post('/api/upload-image', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const publicUrl = `/img/shopItems/${req.file.filename}`;
    
    console.log(`File uploaded: ${req.file.filename}`);
    console.log(`Saved to: ${req.file.path}`);
    
    res.json({
      message: 'File uploaded successfully',
      url: publicUrl,
      filename: req.file.filename
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Upload server is running',
    uploadDir: uploadDir
  });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  console.error(error);
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Upload server running on port ${PORT}`);
  console.log(`Saving files to: ${uploadDir}`);
});