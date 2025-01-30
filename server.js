const express = require('express');
const path = require('path');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes'); // Import your routes

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the routes from cartRoutes
app.use('/api', cartRoutes);  // Mount your routes on '/api'
// Serve index.html as the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
