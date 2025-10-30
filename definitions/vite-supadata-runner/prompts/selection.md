# Template Selection Guidelines

This template provides a production-ready web scraping application built with Supadata SDK, enabling comprehensive data extraction from websites and social media platforms deployed on Cloudflare Workers.

* Use this template when you need:
  * Web scraping and data extraction from any website URL
  * YouTube video transcript extraction and metadata retrieval
  * TikTok video data and analytics scraping
  * X (Twitter) profile, tweet, and timeline data extraction
  * Social media content aggregation (profiles, channels, playlists)
  * Real-time data collection from social platforms
  * API-powered web content extraction and parsing
  * Building dashboards or tools that aggregate social media data

* Do not use it for:
  * Simple static websites without data scraping needs
  * Applications that don't require external data extraction
  * Real-time chat applications or messaging systems
  * Projects requiring AI/LLM capabilities (use vite-cfagents-runner instead)
  * Complex data processing without scraping requirements

**IMPORTANT NOTE: Only use this template if you NEED web scraping or social media data extraction capabilities. For web, YouTube, TikTok, X and Twitter data scraping, this template uses the @supadata/js npm package.**

* Built with:
  * **@supadata/js SDK** for powerful web and social media scraping
  * **React + Vite** for fast, modern frontend development
  * **Cloudflare Workers** for edge-deployed scraping infrastructure
  * **Tailwind CSS** with responsive design and modern styling
  * **Framer Motion** for smooth UI animations and transitions
  * **Shadcn/UI** components for polished interface elements
  * **TypeScript** for type safety and extensible architecture
  * **Zod** for data validation and schema parsing