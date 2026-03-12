'use client';

import { useState, useRef } from 'react';
import { Upload, Film, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminVideosPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files[0];
        if (dropped && dropped.type.startsWith('video/')) {
            setFile(dropped);
            setError('');
            setResult(null);
        }
    };

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setError('');
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');
        setResult(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';
            const formData = new FormData();
            formData.append('video', file);

            const res = await fetch(apiUrl + '/videos/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setResult({ url: data.url, filename: data.filename });
            setFile(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Film className="text-primary w-8 h-8" /> Video Upload Pipeline
                </h1>
                <p className="text-slate-600">
                    Upload lesson videos. They will be compressed with FFmpeg and stored in Supabase Storage.
                </p>
            </div>

            {/* Drop Zone */}
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className="bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary p-12 text-center cursor-pointer transition-colors mb-6"
            >
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-700 mb-1">
                    {file ? file.name : 'Drop a video file here or click to browse'}
                </p>
                <p className="text-sm text-slate-500">
                    {file
                        ? formatSize(file.size)
                        : 'Supports MP4, WebM, MOV, AVI — up to 500MB'}
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleSelect}
                    className="hidden"
                />
            </div>

            {/* Upload Button */}
            {file && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Compressing & Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Upload & Compress
                        </>
                    )}
                </button>
            )}

            {/* Success */}
            {result && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-800">Upload Complete!</span>
                    </div>
                    <p className="text-sm text-green-700 mb-2">Filename: {result.filename}</p>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-xs text-slate-500 mb-1">Public URL:</p>
                        <code className="text-sm text-slate-800 break-all">{result.url}</code>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-bold text-red-800">{error}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
