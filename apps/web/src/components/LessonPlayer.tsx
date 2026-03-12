'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, Type, Eye } from 'lucide-react';

interface LessonPlayerProps {
    lessonId: string;
    videoUrl: string;
    nslVideoUrl?: string; // Nigerian Sign Language overlay video URL
    transcript?: string;
    title: string;
    description: string;
}

export default function LessonPlayer({
    videoUrl,
    nslVideoUrl,
    transcript,
    title,
    description
}: LessonPlayerProps) {
    const mainVideoRef = useRef<HTMLVideoElement>(null);
    const nslVideoRef = useRef<HTMLVideoElement>(null);

    const [showNsl, setShowNsl] = useState(!!nslVideoUrl);
    const [isReadingAloud, setIsReadingAloud] = useState(false);

    // Sync the picture-in-picture NSL video with the main video 
    useEffect(() => {
        const mainVid = mainVideoRef.current;
        const nslVid = nslVideoRef.current;

        if (!mainVid || !nslVid) return;

        const onPlay = () => { nslVid.play(); };
        const onPause = () => { nslVid.pause(); };
        const onSeek = () => { nslVid.currentTime = mainVid.currentTime; };

        mainVid.addEventListener('play', onPlay);
        mainVid.addEventListener('pause', onPause);
        mainVid.addEventListener('seeked', onSeek);

        return () => {
            mainVid.removeEventListener('play', onPlay);
            mainVid.removeEventListener('pause', onPause);
            mainVid.removeEventListener('seeked', onSeek);
        };
    }, [nslVideoUrl]);

    const handleReadAloud = () => {
        if (!transcript) return;

        if (isReadingAloud) {
            window.speechSynthesis.cancel();
            setIsReadingAloud(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(transcript);
            // Optional: Try to set voice to a locale that sounds best, e.g. en-NG if available
            utterance.onend = () => setIsReadingAloud(false);
            window.speechSynthesis.speak(utterance);
            setIsReadingAloud(true);
        }
    };

    return (
        <div className="flex flex-col gap-6">

            {/* Video Player Container */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg group">

                {/* Main Video */}
                <video
                    ref={mainVideoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    controls={true}
                    controlsList="nodownload"
                >
                    {/* Note: VTT Captions could be injected here via <track> */}
                    <track kind="captions" srcLang="en" label="English" default={true} />
                </video>

                {/* NSL Overlay (Picture-in-Picture logic) */}
                {nslVideoUrl && showNsl && (
                    <div className="absolute bottom-[20%] right-4 w-1/4 aspect-video bg-black/80 rounded-lg overflow-hidden border-2 border-white/20 shadow-xl z-10 transition-transform hover:scale-105">
                        <video
                            ref={nslVideoRef}
                            src={nslVideoUrl}
                            className="w-full h-full object-cover"
                            muted // Main audio governs
                            playsInline
                        />
                    </div>
                )}
            </div>

            {/* Custom Accessibility Controls Bar */}
            <div className="flex flex-wrap gap-4 items-center bg-card p-4 rounded-xl border">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mr-auto">
                    Accessibility Options
                </div>

                {nslVideoUrl && (
                    <button
                        onClick={() => setShowNsl(!showNsl)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-colors ${showNsl ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        <Eye className="w-4 h-4" />
                        Sign Language (NSL)
                    </button>
                )}

                {transcript && (
                    <button
                        onClick={handleReadAloud}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-colors ${isReadingAloud ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        <Volume2 className="w-4 h-4" />
                        {isReadingAloud ? 'Stop Reading' : 'Read Transcript Aloud'}
                    </button>
                )}
            </div>

            <div className="mt-4">
                <h1 className="text-3xl font-extrabold mb-2">{title}</h1>
                <p className="text-lg text-muted-foreground mb-8">{description}</p>

                {transcript && (
                    <div className="bg-slate-50 border rounded-xl p-6 prose prose-slate max-w-none">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                            <Type className="h-5 w-5 text-primary" />
                            Full Transcript
                        </h3>
                        <div className="whitespace-pre-wrap font-medium leading-relaxed text-slate-700">
                            {transcript}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
