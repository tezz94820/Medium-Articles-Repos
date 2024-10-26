# Link Preview Metadata Scraper

For a deeper dive into how link previews work, check out my article on Medium: How Link Preview in WhatsApp Works And Let's Make Our Own Backend Server for It. [Click Here to Access Article for free](#https://medium.com/@tejasitankar94820/how-whatsapp-makes-links-come-to-life-a-developers-guide-to-og-metadata-scraping-in-nodejs-140a06ef7cde?sk=8d3bdbaecfcc9ad4a9360f5342d75c1d)

Welcome to the **Link Preview Metadata Scraper**! 🎉 This project implements a simple metadata scraping server using Node.js, Redis, and the Open Graph protocol to generate rich link previews.

## Table of Contents
- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Performance](#performance)
- [Conclusion](#conclusion)

## Introduction

Have you ever wondered how applications like WhatsApp show you a thumbnail, title, and description for a shared link? 🤔 This project explores the magic behind link previews by scraping metadata from web pages and serving it efficiently.

## Technologies Used
- **Node.js**: The server-side JavaScript runtime.
- **Redis**: For caching metadata and improving performance.
- **Express**: A minimal and flexible Node.js web application framework.
- **Axios**: A promise-based HTTP client for making requests.
- **Cheerio**: A fast and flexible library for parsing HTML and extracting data.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
2. **Install dependencies**:
    ```bash
    npm install
3. **Start the Redis server**: Navigate to the directory containing the docker-compose.yml file and run:
    ```bash
    npm install
    docker-compose up -d
4. **Run the Node.js server**:
    ```bash
    node server.js
## Usage

To get a link preview, make a GET request to the /link-preview endpoint with the URL you want to scrape as a query parameter. For example:
    ```bash
    GET http://localhost:3000/link-preview?url=https://www.example.com

**Example Request**
Using Postman or your browser, enter the following URL:
   ```bash
    http://localhost:3000/link-preview?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```
   
## Usage

1. **Without Caching** : The request takes approximately 6.7 seconds to return metadata.
2. **With Caching** : The same request completes in just 10 milliseconds! 🚀 

## Conclusion

Thanks for checking out the Link Preview Metadata Scraper! With this project, you can impress your friends with snazzy link previews while learning about web scraping and caching. If you have any questions or suggestions, feel free to open an issue or submit a pull request!