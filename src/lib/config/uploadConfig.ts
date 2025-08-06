import multer, { DiskStorageOptions, FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

// Define types for Multer configuration
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Create storage configuration with proper typing
const storageOptions: DiskStorageOptions = {
  destination: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) => {
    const uploadDir = 'uploads/';

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
};

// File filter for additional validation (optional)
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: Only image files are allowed!'));
};

// Multer configuration with type safety
const upload = multer({
  storage: multer.diskStorage(storageOptions),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

export default upload;
