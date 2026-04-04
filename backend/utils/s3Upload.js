const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const path = require('path');

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Upload file to S3
const uploadToS3 = async (file, folder = 'resumes') => {
    try {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;

        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentType: file.mimetype,
            },
        });

        const result = await upload.done();

        // Return the public URL
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error('S3 Upload Error:', error);
        throw new Error('Failed to upload file to S3');
    }
};

// Multer configuration for memory storage (S3 upload)
const multerS3Storage = multer.memoryStorage();

const uploadS3 = multer({
    storage: multerS3Storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
        }
    },
});

module.exports = {
    uploadToS3,
    uploadS3,
    s3Client,
};
