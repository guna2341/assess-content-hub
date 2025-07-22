const express = require('express');

require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/uploads',express.static(path.join(__dirname,"uploads")));

const PORT = process.env.PORT || 5000 ;



app.listen(PORT, () => {
    console.log(`connected to port :${PORT}`);
});