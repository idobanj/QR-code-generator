/** @format */

import express from 'express';
import bodyParser from 'body-parser';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

// Helper for ES Modules to get __dirname equivalent
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware to serve static files (like index.html)
app.use(express.static('public'));
// Create a 'public' folder and put your index.html there, OR:

// If you want to serve index.html from the root folder:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware to parse URL-encoded bodies (from HTML forms)
app.use(bodyParser.urlencoded({extended: true}));

// 1. Define the POST route that your HTML form targets
app.post('/generate', (req, res) => {
    // 2. The form data is in req.body. The field name is 'data' (from index.html)
    const url = req.body.data;

    if (!url) {
        return res.status(400).send('Please provide data to encode.');
    }

    try {
        // 3. Generate the QR code image stream
        const qr_svg = qr.image(url, {type: 'png'});

        // 4. Set the response headers to deliver an image file
        res.setHeader('Content-Type', 'image/png');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="qrcode.png"'
        );

        // 5. Pipe the image stream directly to the HTTP response
        qr_svg.pipe(res);

        // Optional: Save the URL to a local file (for local reference)
        fs.writeFile('URL_Log.txt', url + '\n', {flag: 'a'}, (err) => {
            if (err) console.error('Error writing URL log:', err);
        });
    } catch (error) {
        console.error('QR Code Generation Error:', error);
        res.status(500).send('Failed to generate QR code.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
