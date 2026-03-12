import { Router, Request, Response } from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variable CLOUDINARY_URL
// Format: cloudinary://my_key:my_secret@my_cloud_name
cloudinary.config({
    secure: true,
});

export const videosRouter: Router = Router();

// Configure multer for temp file storage
const upload = multer({
    dest: '/tmp/ally-uploads/',
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
    fileFilter: (_req, file, cb) => {
        const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only video files (mp4, webm, mov, avi) are allowed'));
        }
    },
});

// Helper: compress video with FFmpeg
function compressVideo(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions([
                '-c:v libx264',
                '-crf 28',
                '-preset fast',
                '-c:a aac',
                '-b:a 128k',
                '-movflags +faststart', // Enable progressive playback
            ])
            .output(outputPath)
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .run();
    });
}

// Helper: clean up temp files
function cleanup(...paths: string[]) {
    for (const p of paths) {
        try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch { /* ignore */ }
    }
}

// POST /v1/videos/upload
videosRouter.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'No video file provided' });
    }

    const inputPath = file.path;
    const fileId = Date.now().toString() + '-' + Math.round(Math.random() * 1e9);
    const outputFilename = fileId + '.mp4';
    const outputPath = path.join('/tmp/ally-uploads/', outputFilename);

    try {
        if (!process.env.CLOUDINARY_URL) {
            cleanup(inputPath);
            return res.status(500).json({ error: 'Server misconfiguration: Missing CLOUDINARY_URL' });
        }

        // Step 1: Compress with FFmpeg
        let uploadFilePath = inputPath;
        try {
            await compressVideo(inputPath, outputPath);
            uploadFilePath = outputPath;
            console.log('[Video Pipeline] Compression complete:', outputFilename);
        } catch (ffmpegError) {
            // FFmpeg not available or failed — upload original
            console.warn('[Video Pipeline] FFmpeg unavailable, uploading original:', ffmpegError);
            // Still use original file
        }

        // Step 2: Upload to Cloudinary
        console.log('[Video Pipeline] Uploading to Cloudinary...');

        const uploadResult = await cloudinary.uploader.upload(uploadFilePath, {
            resource_type: 'video',
            folder: 'ally-ability/lessons',
            public_id: fileId,
            // Automatically transcode to optimal formats for web viewing
            eager: [
                { format: 'mp4', video_codec: 'auto' }
            ],
            eager_async: true,
        });

        // Cleanup temp files
        cleanup(inputPath, outputPath);

        const originalSize = file.size;
        const compressedSize = fs.existsSync(outputPath) ? 0 : uploadResult.bytes;

        console.log('[Video Pipeline] Upload complete (Cloudinary):', uploadResult.secure_url);

        return res.json({
            success: true,
            url: uploadResult.secure_url,
            filename: outputFilename,
            original_size: originalSize,
            compressed_size: compressedSize,
            storage_path: uploadResult.public_id,
        });
    } catch (error) {
        cleanup(inputPath, outputPath);
        console.error('[Video Pipeline] Error:', error);
        res.status(500).json({ error: 'Video processing failed. ' + String(error) });
    }
});
