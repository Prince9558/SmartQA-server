require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose= require('mongoose');
const roomRoutes= require('./src/routes/roomRoutes');

const app = express(); // create instance of express to setup the server

// Middlewares
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log('MongoDB Connected'))
.catch((error)=>console.log('Error connecting to DB', error));

const corsConfig = {
    origin: process.env.CLIENT_URL,
    Credentials: true
};
app.use(cors(corsConfig));

app.use('/room',roomRoutes);

// start the server
const PORT = process.env.PORT;
app.listen(PORT,(error)=>{
    if(error){
        console.log('Server not started due to: ', error);
    } else{
        console.log(`server running at port: ${PORT}`)
    }
});