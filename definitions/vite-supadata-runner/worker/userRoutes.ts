import { Hono } from "hono";
import {
  Crawl,
  CrawlJob,
  JobResult,
  Map,
  Scrape,
  Supadata,
  Transcript,
  TranscriptOrJobId,
  YoutubeChannel,
  YoutubePlaylist,
  YoutubeVideo,
} from '@supadata/js';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";

async function getUserAPIKey(request: any) {
    const res = await fetch(`https://dash.supadata.ai/api/get-api-key`, {
    headers: {
        'Content-Type': 'application/json',
        // If this API is called in the Cloudflare Worker, Cookie need to be passed.
        'Cookie': request.headers.get('Cookie') || ''
    }
    })

    const data = await res.json()
    const apiKey = data.data.apiKey
    return apiKey
}

export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Add your routes here
    /**
     * Get transcript from any supported platform (YouTube, TikTok, Instagram, Twitter) or file
     * POST /api/supadata/transcript
     */
    app.post('/api/supadata/transcript', async (c) => {
        let apiKey = ''
        let e = {} as any
        try {
            e = await c.req.json();
            // GET API KEY BY THIS METHOD. DO NOT GET API KEY FROM ENV.
            apiKey = await getUserAPIKey(c.req);

            // Initialize the client
            const supadata = new Supadata({
                apiKey,
            });

            const transcriptResult = await supadata.transcript({
                url: e.url,
                lang: 'en', // optional
                text: true, // optional: return plain text instead of timestamped chunks
                mode: 'auto', // optional: 'native', 'auto', or 'generate'
            });

            return transcriptResult
        } catch (error: any) {
            console.error('Supdata routing error:', error);
            return c.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }
    });

    /**
     * Get YouTube transcript
     * POST /api/supadata/youtube/transcript
     */
    app.post('/api/supadata/youtube/transcript', async (c) => {
        try {
            const e = await c.req.json();
            // GET API KEY BY THIS METHOD. DO NOT GET API KEY FROM ENV.
            const apiKey = await getUserAPIKey(c.req);

            // Initialize the client
            const supadata = new Supadata({
                apiKey,
            });

            const transcriptResult: Transcript = await supadata.youtube.transcript({
                url: e.url,
            });

            return transcriptResult
        } catch (error: any) {
            console.error('Supdata routing error:', error);
            return c.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }
    });

    /**
     * Translate YouTube transcript
     * POST /api/supadata/translate
     */
    app.post('/api/supadata/youtube/translate', async (c) => {
        try {
            const e = await c.req.json();
            // GET API KEY BY THIS METHOD. DO NOT GET API KEY FROM ENV.
            const apiKey = await getUserAPIKey(c.req);

            // Initialize the client
            const supadata = new Supadata({
                apiKey,
            });

            const translated: Transcript = await supadata.youtube.translate({
                videoId: e.videoId,
                lang: 'es',
            });

            return translated
        } catch (error: any) {
            console.error('Supdata routing error:', error);
            return c.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }
    });

    /**
     * Get a YouTube Video metadata
     * POST /api/supadata/youtube/video
     */
    app.post('/api/supadata/youtube/video', async (c) => {
        try {
            const e = await c.req.json();
            // GET API KEY BY THIS METHOD. DO NOT GET API KEY FROM ENV.
            const apiKey = await getUserAPIKey(c.req);

            // Initialize the client
            const supadata = new Supadata({
                apiKey,
            });

            const res = await supadata.youtube.video({
                id: e.videoId,
            });

            return res
        } catch (error: any) {
            console.error('Supdata routing error:', error);
            return c.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }
    });

    /**
     * Get a YouTube channel metadata
     * POST /api/supadata/youtube/channel
     */
    app.post('/api/supadata/youtube/channel', async (c) => {
        try {
            const e = await c.req.json();
            // GET API KEY BY THIS METHOD. DO NOT GET API KEY FROM ENV.
            const apiKey = await getUserAPIKey(c.req);

            // Initialize the client
            const supadata = new Supadata({
                apiKey,
            });

            const res = await supadata.youtube.channel({
                id: e.videoId,
            });

            return res
        } catch (error: any) {
            console.error('Supdata routing error:', error);
            return c.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }
    });

    /**
     * Get a list of video IDs from a YouTube channel
     * POST /api/supadata/youtube/videos
     */
    app.post('/api/supadata/youtube/videos', async (c) => {
        try {
            const e = await c.req.json();
            // GET API KEY BY THIS METHOD. DO NOT GET API KEY FROM ENV.
            const apiKey = await getUserAPIKey(c.req);

            // Initialize the client
            const supadata = new Supadata({
                apiKey,
            });

            const res = await supadata.youtube.videos({
                id: e.videoId, // can be url, channel id, handle
                type: e.type || 'all', // 'video', 'short', 'live', 'all'
                limit: e.limit || 10,
            });

            return res
        } catch (error: any) {
            console.error('Supdata routing error:', error);
            return c.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }
    });

    /**
     * Get the metadata of a YouTube playlist
     * POST /api/supadata/youtube/playlist
     */
    app.post('/api/supadata/youtube/playlist', async (c) => {
        try {
            const e = await c.req.json();
            // GET API KEY BY THIS METHOD. DO NOT GET API KEY FROM ENV.
            const apiKey = await getUserAPIKey(c.req);

            // Initialize the client
            const supadata = new Supadata({
                apiKey,
            });

            const res = await supadata.youtube.playlist({
                id: e.videoId, // can be url or playlist id
            });

            return res
        } catch (error: any) {
            console.error('Supdata routing error:', error);
            return c.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }
    });

    /**
     * Scrape web content
     * POST /api/supadata/web/scrape
     */
    app.post('/api/supadata/web/scrape', async (c) => {
        try {
            const e = await c.req.json();
            // GET API KEY BY THIS METHOD. DO NOT GET API KEY FROM ENV.
            const apiKey = await getUserAPIKey(c.req);

            // Initialize the client
            const supadata = new Supadata({
                apiKey,
            });

            const webContent: Scrape = await supadata.web.scrape(e.url);

            return webContent
        } catch (error: any) {
            console.error('Supdata routing error:', error);
            return c.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }
    });

    /**
     * Map website URLs
     * POST /api/supadata/web/map
     */
    app.post('/api/supadata/web/map', async (c) => {
        try {
            const e = await c.req.json();
            // GET API KEY BY THIS METHOD. DO NOT GET API KEY FROM ENV.
            const apiKey = await getUserAPIKey(c.req);

            // Initialize the client
            const supadata = new Supadata({
                apiKey,
            });

            const siteMap: Map = await supadata.web.map(e.url);

            return siteMap
        } catch (error: any) {
            console.error('Supdata routing error:', error);
            return c.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }
    });

    /**
     * Crawl website
     * POST /api/supadata/web/crawl
     */
    app.post('/api/supadata/web/crawl', async (c) => {
        try {
            const e = await c.req.json();
            // GET API KEY BY THIS METHOD. DO NOT GET API KEY FROM ENV.
            const apiKey = await getUserAPIKey(c.req);

            // Initialize the client
            const supadata = new Supadata({
                apiKey,
            });

            const crawl: Map = await supadata.web.crawl({
                url: e.url,
                limit: e.limit || 10,
            });

            return crawl
        } catch (error: any) {
            console.error('Supdata routing error:', error);
            return c.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }
    });
}
