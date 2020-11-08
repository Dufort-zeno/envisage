const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config()

const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, 'build')));

app.listen(PORT);
console.log(`Server running on port ${PORT}`);