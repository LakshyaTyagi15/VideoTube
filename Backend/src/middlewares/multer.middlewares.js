import multer from "multer";
import path from "path";
import { APIError } from "../utils/APIError.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

// Allowed MIME types
const imageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
];

const videoMimeTypes = [
    'video/mp4',
    'video/mpeg',
    'video/webm',
    'video/quicktime',     // .mov (common on iPhones)
    'video/x-msvideo',     // .avi
    'video/x-matroska',    // .mkv
    'video/3gpp',          // .3gp (common on mobile)
    'video/3gpp2',         // .3g2
    'video/ogg',
    'video/mp2t',          // .ts
];

const fileFilter = (req, file, cb) => {
    const allowedTypes = [...imageMimeTypes, ...videoMimeTypes];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new APIError(400, `Invalid file type: ${file.mimetype}. Only image and video files are allowed.`), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max file size
    }
});