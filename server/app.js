
// env
require('dotenv').config();

// imports
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// port
const PORT = process.env.PORT || 5000 ;

// initialize app
const app = express();

// body-parser
app.use(express.json());

// cookie-parser
app.use(cookieParser());

// routes
app.use('/uploads',express.static(path.join(__dirname,"uploads")));



// start server
app.listen(PORT, () => {
    console.log(`connected to port :${PORT}`);
});