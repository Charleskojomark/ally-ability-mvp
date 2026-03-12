/** @type {import('next').NextConfig} */
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts',
                expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 }
            }
        },
        {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'images',
                expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }
            }
        },
        {
            urlPattern: /\.(mp4|webm)$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'videos',
                expiration: { maxEntries: 20, maxAgeSeconds: 30 * 24 * 60 * 60 },
                rangeRequests: true
            }
        },
        {
            urlPattern: /\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-responses',
                expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
                networkTimeoutSeconds: 10
            }
        }
    ]
});

const nextConfig = {};

export default withPWA(nextConfig);
