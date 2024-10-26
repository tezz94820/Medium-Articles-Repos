const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { createClient } = require('redis');

const app = express();
const PORT = 3000;

app.use(cors());

// Create a new Redis client instance
const redisClient = createClient({
    url: 'redis://localhost:6379', 
});

// Connect to Redis
redisClient.connect();

// Handle connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis!');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

app.get('/link-preview', async (req, res) => {
    //getting the URL from the request query
    const { url } = req.query;

    //if url is not prevoded then give 400 error.
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Check if URL metadata is in cache
        const cachedData = await redisClient.get(url);

        if (cachedData) {
            console.log('Cache hit for URL:', url);
            return res.json(JSON.parse(cachedData));
        }

        // If not cached, fetch the webpage content
        // Fetch the webpage content
        // Set a timeout for the HTTP request to avoid hanging on unresponsive URL servers.
        const { data: html } = await axios.get(url, { timeout: 5000 });
        const $ = cheerio.load(html);

        const metaTags = {
            title: $('meta[property="og:title"]').attr('content') || $('title').text(),
            description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
            image: $('meta[property="og:image"]').attr('content'),
            url: $('meta[property="og:url"]').attr('content') || url
        };

        await redisClient.set(url, JSON.stringify(metaTags), {
            EX: 86400 // Set cache expiration time to 1 day (86400 seconds)
        });

        console.log('Cache miss. Fetched and cached URL:', url);
        res.json(metaTags);

    } catch (error) {
        console.error('Error fetching URL:', error.message);
        res.status(500).json({ error: 'Failed to fetch URL' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

