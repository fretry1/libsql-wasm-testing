// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        sveltekit(),

        // Injects COOP/COEP headers in dev server
        {
            name: 'cross-origin-isolation',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
                    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
                    next();
                });
            },
            // Also covers `vite preview`
            configurePreviewServer(server) {
                server.middlewares.use((req, res, next) => {
                    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
                    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
                    next();
                });
            },
        },
    ],
    worker: {
        format: "es",
    },
    build: {
        target: "esnext",
    },
    optimizeDeps: {
        // Prevent Vite from trying to pre-bundle the WASM client
        exclude: ['@libsql/client-wasm'],
    },
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
    },
    preview: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
    },
});
