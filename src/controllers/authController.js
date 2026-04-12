const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.googleAuth = async (req, res) => {
    try {
        const { access_token } = req.body;
        
        // 1. Fetch user securely from Google using their access token
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        
        const { email, given_name, family_name, picture, sub: googleId } = data;
        
        // 2. Check if the user already exists in your Mongo Database
        let user = await User.findOne({ email });
        
        if (!user) {
            // IF NOT: Create a brand new user (Google Signup)
            user = await User.create({
                firstName: given_name || 'User',
                lastName: family_name || '',
                email: email,
                googleId: googleId,
                profilePicture: picture,
                password: Math.random().toString(36).slice(-8)
            });
        }
        
        // 3. Login the user by generating a JWT token that your React app understands
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        
        res.status(200).json({ 
            message: "Login successful",
            token, 
            user: { 
                id: user._id, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                email: user.email, 
                profilePicture: user.profilePicture 
            } 
        });
        
    } catch (error) {
        console.error("Google Auth Controller Error:", error);
        res.status(500).json({ message: "Server encountered an error during Google authentication." });
    }
};
