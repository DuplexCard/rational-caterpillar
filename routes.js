const express = require('express');
const router = express.Router();
const db = require('./database');
const axios = require('axios');

// Botpress API configuration
const BOTPRESS_API_URL = 'https://api.botpress.cloud';
const ACCESS_TOKEN = 'bp_pat_CIJedmF4e1kkg0iSvCn4tL7duG14jc7xJi4C';
const BOT_ID = 'dc85baa6-cc92-48e3-a137-69608f3b3f19';

const botpressAPI = axios.create({
    baseURL: BOTPRESS_API_URL,
    headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

// Define routes
app.post('/phone_number', (req, res) => {
    const phoneNumber = req.body.phone_number;
    if (!phoneNumber) {
        return res.status(400).json({ 'error': 'Phone number is required' });
    }
    
    db.get('SELECT * FROM phone_numbers WHERE number = ?', [phoneNumber], async (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ 'error': 'An error occurred while checking the phone number' });
        }
        
        if (row) {
            // Phone number exists
            const conversationId = row.conversation_id;
            try {
                await botpressAPI.post(`/v1/bots/${BOT_ID}/conversations/${conversationId}/messages`, {
                    type: 'text', // Assuming a text message type
                    text: 'This is a placeholder text for existing users.' // Your placeholder text
                });
                res.status(200).json({ 'message': 'Message sent to existing user.' });
            } catch (apiError) {
                console.error('Error posting message through Botpress API:', apiError.message);
                res.status(500).json({ 'error': 'Failed to send message to existing user.' });
            }
        } else {
            // Phone number does not exist
            // Placeholder for creating a new user and starting a new conversation
            try {
                // This is a conceptual placeholder for the operation.
                // Replace this with actual API calls to create a user and start a conversation in Botpress.
                // The following is just a conceptual example and will not work without proper implementation.
                
                // Example API call to create a new user in Botpress
                const newUserResponse = await botpressAPI.post(`/v1/bots/${BOT_ID}/users`, {
                    // Your payload here
                });
                const newUserId = newUserResponse.data.id;

                // Example API call to create a new conversation in Botpress
                const newConversationResponse = await botpressAPI.post(`/v1/bots/${BOT_ID}/conversations`, {
                    userId: newUserId // Assuming this is required; adjust according to Botpress API
                });
                const newConversationId = newConversationResponse.data.id;

                // Insert new user's phone number and conversation ID into your database
                db.run('INSERT INTO phone_numbers (number, conversation_id) VALUES (?, ?)', [phoneNumber, newConversationId], insertErr => {
                    if (insertErr) {
                        console.error('Error saving new phone number and conversation ID:', insertErr.message);
                        return res.status(500).json({ 'error': 'Failed to save new user information' });
                    }
                    res.status(200).json({ 'message': 'New user and conversation created.' });
                });
            } catch (apiError) {
                console.error('Error creating user/conversation through Botpress API:', apiError.message);
                res.status(500).json({ 'error': 'Failed to create new user and conversation.' });
            }
        }
    });
});


module.exports = router;
