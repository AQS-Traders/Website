const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, '../')));

// Contact Form Handler
app.post('/api/contact', (req, res) => {
    const { name, phone, email, service, message } = req.body;

    console.log('--- New Contact Submission ---');
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email}`);
    console.log(`Service: ${service}`);
    console.log(`Message: ${message}`);
    console.log('------------------------------');

    // Here you would typically send an email using nodemailer
    // For now, we simulate success

    res.status(200).json({ success: true, message: 'Message received successfully!' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
