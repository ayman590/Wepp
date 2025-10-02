const express = require('express');
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// API endpoint for chat
app.post('/api/chat', (req, res) => {
    const userMessage = req.body.message;
    console.log('Received message:', userMessage);

    // Mock AI Response
    const aiResponse = {
        messages: [
            { type: 'text', content: `You said: "${userMessage}". Here is some code:` },
            { type: 'code', content: 'console.log("Hello from the server!");' }
        ]
    };

    res.json(aiResponse);
});

app.get('/api/download', (req, res) => {
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // Set the content-type and disposition
    res.attachment('project.zip');

    // Pipe the archive data to the response
    archive.pipe(res);

    // --- Create a sample project ---
    const htmlContent = '<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>';
    const cssContent = 'body { background-color: lightblue; }';

    // Append files from string
    archive.append(htmlContent, { name: 'index.html' });
    archive.append(cssContent, { name: 'style.css' });

    // --- Finalize the archive ---
    archive.finalize();
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});