# Usage Instructions

You can start customizing the template frontend by modifying `src/App.tsx`. The page auto-updates as you edit the file.

The scraping API is accessible through the worker routes defined in `worker/userRoutes.ts`. Create endpoints to handle different scraping tasks using the Supadata SDK.

The Supadata SDK (@supadata/js) provides comprehensive scraping capabilities for websites and social media platforms. Import and use the SDK functions in your worker routes to extract data.

**IMPORTANT: For web, YouTube, TikTok, X and Twitter data scraping, always use the @supadata/js npm package.**

- Built with:
  * **@supadata/js SDK** for web and social media data scraping
  * **React + Vite** for fast frontend development with hot module replacement
  * **Cloudflare Workers** for edge-deployed scraping infrastructure
  * **Hono** for lightweight and fast HTTP routing in workers
  * **Tailwind CSS** for utility-first styling with responsive design
  * **Framer Motion** for smooth UI animations and transitions
  * **Lucide Icons** (React) for modern, consistent iconography
  * **Shadcn/UI** for accessible UI components built on Radix UI primitives
  * **TypeScript** for type safety and extensible architecture
  * **Zod** for data validation and schema parsing

- Supadata Features:
  * **Website Scraping**: Extract content, metadata, and structured data from any URL
  * **YouTube Integration**: Get video transcripts, metadata, channel info, and playlists
  * **TikTok Scraping**: Extract video data, user profiles, and engagement metrics
  * **X/Twitter Data**: Scrape profiles, tweets, timelines, and social graphs
  * **Social Media APIs**: Unified interface for multiple social platforms
  * **Real-time Data**: Fresh data extraction with caching strategies
  * **Error Handling**: Robust error handling for failed scraping attempts

- Using Supadata SDK:
  * **Step 1**: Import Supadata functions in your worker routes (e.g., `worker/userRoutes.ts`)
  * **Step 2**: Create API endpoints that accept URLs or identifiers to scrape
  * **Step 3**: Call Supadata SDK methods to extract data from target platforms
  * **Step 4**: Return structured JSON responses to your frontend
  * **Best Practice**: Implement proper error handling and rate limiting

- Environment Variables:
  * **SUPADATA_API_KEY**: Supadata API key for authentication (required)
  * Configure additional API keys as needed for specific platforms

- Restrictions:
  * **API keys**: Never expose API keys to client-side - they're server-side only in worker
  * **Rate Limiting**: Implement proper rate limiting to avoid overwhelming target sites
  * **Error Handling**: Validate inputs and handle scraping errors gracefully
  * **Data Privacy**: Respect robots.txt and platform terms of service

- Styling:
  * Must generate **fully responsive** and beautiful UI with modern, clean design
  * Use Shadcn preinstalled components rather than writing custom ones when possible
  * Use **Tailwind's spacing, layout, and typography utilities** for all components
  * Include loading states, error messages, and data visualization for better UX

- Components:
  * All Shadcn components are available and can be imported from `@/components/ui/...`
  * Use: `Button`, `Input`, `Card`, `Table`, `Badge`, `Tabs` for data display
  * Data visualization with `Card`, `Badge`, and custom layouts
  * Do not write custom components if shadcn components are available
  * Icons from Lucide should be imported directly from `lucide-react`

- Animation:
  * Use `framer-motion`'s `motion` components for smooth transitions
  * Animate data loading states, page transitions, and interactive elements
  * Integrate variants and transitions using Tailwind utility classes alongside motion props

- Worker Architecture (Backend, APIs):
  * **`worker/userRoutes.ts`**: HTTP routing for scraping API endpoints
  * **`worker/config.ts`**: Centralized configuration and API settings
  * Create additional route handlers as needed for different scraping tasks

---

Documents of Supadata:
```md
# Supadata JS SDK

[![NPM package](https://img.shields.io/npm/v/@supadata/js.svg?branch=main)](https://www.npmjs.com/package/@supadata/js)
[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](http://opensource.org/licenses/MIT)

The official TypeScript/JavaScript SDK for Supadata.

Get your free API key at [supadata.ai](https://supadata.ai) and start scraping data in minutes.

## Installation

```bash
npm install @supadata/js
```

## Get API Key

```typescript
const res = await fetch(`https://dash.supadata.ai/api/get-api-key`, {
  headers: {
    'Content-Type': 'application/json',
    // If this API is called in the Cloudflare Worker, Cookie need to be passed.
    'Cookie': request.headers.get('Cookie') || ''
  }
})

const data = await res.json()
const apiKey = data.data.apiKey
```

## Usage

### Initialization

```typescript
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

// Initialize the client
const supadata = new Supadata({
  apiKey: 'YOUR_API_KEY',
});
```

### Transcripts

```typescript
// Get transcript from any supported platform (YouTube, TikTok, Instagram, Twitter) or file
const transcriptResult = await supadata.transcript({
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  lang: 'en', // optional
  text: true, // optional: return plain text instead of timestamped chunks
  mode: 'auto', // optional: 'native', 'auto', or 'generate'
});

// Check if we got a transcript directly or a job ID for async processing
if ('jobId' in transcriptResult) {
  // For large files, we get a job ID and need to poll for results
  console.log(`Started transcript job: ${transcriptResult.jobId}`);

  // Poll for job status
  const jobResult = await supadata.transcript.getJobStatus(
    transcriptResult.jobId
  );
  if (jobResult.status === 'completed') {
    console.log('Transcript:', jobResult.result);
  } else if (jobResult.status === 'failed') {
    console.error('Transcript failed:', jobResult.error);
  } else {
    console.log('Job status:', jobResult.status); // 'queued' or 'active'
  }
} else {
  // For smaller files, we get the transcript directly
  console.log('Transcript:', transcriptResult);
}
```

### YouTube

```typescript
// Get YouTube transcript
const transcript: Transcript = await supadata.youtube.transcript({
  url: 'https://youtu.be/dQw4w9WgXcQ',
});

// Translate YouTube transcript
const translated: Transcript = await supadata.youtube.translate({
  videoId: 'dQw4w9WgXcQ',
  lang: 'es',
});

// Get a YouTube Video metadata
const video: YoutubeVideo = await supadata.youtube.video({
  id: 'dQw4w9WgXcQ', // can be url or video id
});

// Get a YouTube channel metadata
const channel: YoutubeChannel = await supadata.youtube.channel({
  id: 'https://youtube.com/@RickAstleyVEVO', // can be url, channel id, handle
});

// Get a list of video IDs from a YouTube channel
const channelVideos: VideoIds = await supadata.youtube.channel.videos({
  id: 'https://youtube.com/@RickAstleyVEVO', // can be url, channel id, handle
  type: 'all', // 'video', 'short', 'live', 'all'
  limit: 10,
});

// Get the metadata of a YouTube playlist
const playlist: YoutubePlaylist = await supadata.youtube.playlist({
  id: 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI', // can be url or playlist id
});

// Get a list of video IDs from a YouTube playlist
const playlistVideos: VideoIds = await supadata.youtube.playlist.videos({
  id: 'https://www.youtube.com/playlist?list=PLlaN88a7y2_plecYoJxvRFTLHVbIVAOoc', // can be url or playlist id
  limit: 10,
});

// Start a YouTube transcript batch job
const transcriptBatch = await supadata.youtube.transcript.batch({
  videoIds: ['dQw4w9WgXcQ', 'xvFZjo5PgG0'],
  // playlistId: 'PLlaN88a7y2_plecYoJxvRFTLHVbIVAOoc' // alternatively
  // channelId: 'UC_9-kyTW8ZkZNDHQJ6FgpwQ' // alternatively
  lang: 'en',
});
console.log(`Started transcript batch job: ${transcriptBatch.jobId}`);

// Start a YouTube video metadata batch job
const videoBatch = await supadata.youtube.video.batch({
  videoIds: ['dQw4w9WgXcQ', 'xvFZjo5PgG0', 'L_jWHffIx5E'],
  // playlistId: 'PLlaN88a7y2_plecYoJxvRFTLHVbIVAOoc' // alternatively
  // channelId: 'UC_9-kyTW8ZkZNDHQJ6FgpwQ' // alternatively
});
console.log(`Started video batch job: ${videoBatch.jobId}`);

// Get results for a batch job (poll until status is 'completed' or 'failed')
const batchResults = await supadata.youtube.batch.getBatchResults(
  transcriptBatch.jobId
); // or videoBatch.jobId
if (batchResults.status === 'completed') {
  console.log('Batch job completed:', batchResults.results);
  console.log('Stats:', batchResults.stats);
} else {
  console.log('Batch job status:', batchResults.status);
}

// Search YouTube for videos, channels, and playlists
const searchResults = await supadata.youtube.search({
  query: 'never gonna give you up',
  type: 'video', // optional: 'all', 'video', 'channel', 'playlist', 'movie'
  uploadDate: 'all', // optional: 'all', 'hour', 'today', 'week', 'month', 'year'
  duration: 'all', // optional: 'all', 'short', 'medium', 'long'
  sortBy: 'relevance', // optional: 'relevance', 'rating', 'date', 'views'
  features: ['hd'], // optional: array of special video features
  limit: 20, // optional: max results (1-5000)
  nextPageToken: '...', // optional: for pagination
});

// Search for channels
const channelSearch = await supadata.youtube.search({
  query: 'fireship',
  type: 'channel',
  limit: 5,
});

// Search for playlists
const playlistSearch = await supadata.youtube.search({
  query: 'javascript tutorials',
  type: 'playlist',
  limit: 10,
});
```

### Web

```typescript
// Scrape web content
const webContent: Scrape = await supadata.web.scrape('https://supadata.ai');

// Map website URLs
const siteMap: Map = await supadata.web.map('https://supadata.ai');

// Crawl website
const crawl: JobId = await supadata.web.crawl({
  url: 'https://supadata.ai',
  limit: 10,
});

// Get crawl job results
const crawlResults: CrawlJob = await supadata.web.getCrawlResults(crawl.jobId);
```

## Error Handling

The SDK throws `SupadataError` for API-related errors. You can catch and handle these errors as follows:

```typescript
import { SupadataError } from '@supadata/js';

try {
  const transcript = await supadata.youtube.transcript({
    videoId: 'INVALID_ID',
  });
} catch (e) {
  if (e instanceof SupadataError) {
    console.error(e.error); // e.g., 'video-not-found'
    console.error(e.message); // Human readable error message
    console.error(e.details); // Detailed error description
    console.error(e.documentationUrl); // Link to error documentation (optional)
  }
}
```

## Example

See the [example](./example) directory for a simple example of how to use the SDK.

## API Reference

See the [Documentation](https://supadata.ai/documentation) for more details on all possible parameters and options.

## License

MIT
```

Components available:
```sh
$ ls -1 src/components/ui
accordion.tsx
alert-dialog.tsx
alert.tsx
aspect-ratio.tsx
avatar.tsx
badge.tsx
breadcrumb.tsx
button.tsx
calendar.tsx
card.tsx
carousel.tsx
chart.tsx
checkbox.tsx
collapsible.tsx
command.tsx
context-menu.tsx
dialog.tsx
drawer.tsx
dropdown-menu.tsx
form.tsx
hover-card.tsx
input-otp.tsx
input.tsx
label.tsx
menubar.tsx
navigation-menu.tsx
pagination.tsx
popover.tsx
progress.tsx
radio-group.tsx
resizable.tsx
scroll-area.tsx
select.tsx
separator.tsx
sheet.tsx
sidebar.tsx
skeleton.tsx
slider.tsx
sonner.tsx
switch.tsx
table.tsx
tabs.tsx
textarea.tsx
toast.tsx
toggle-group.tsx
toggle.tsx
tooltip.tsx
```

# Important Notes
- Build your scraping UI with proper error handling and user feedback
- Display scraped data in organized, readable formats using tables, cards, or lists
- Implement caching strategies to reduce redundant scraping requests
- Consider adding export functionality (JSON, CSV) for scraped data

# Example Use Cases
- **Transcript**: Get transcript from any supported platform (YouTube, TikTok, Instagram, Twitter) or file
- **Get YouTube transcript**: Get YouTube transcript
- **Translate YouTube transcript**: Translate YouTube transcript
- **Get a YouTube channel metadata**: Get a YouTube channel metadata
- **Get a list of video IDs from a YouTube channel**: Get a list of video IDs from a YouTube channel
- **Get the metadata of a YouTube playlist**: Get the metadata of a YouTube playlist
- **Get a list of video IDs from a YouTube playlist**: Get a list of video IDs from a YouTube playlist
- **Search YouTube for videos, channels, and playlists**: Search YouTube for videos, channels, and playlists
- **Search for channels**: Search for channels
- **Search for playlists**: Search for playlists
- **Scrape web content**: Scrape web content
- **Map website URLs**: Map website URLs
- **Crawl website**: Crawl website