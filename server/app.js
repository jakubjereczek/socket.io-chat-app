const express = require('express');
const app = express();

// errors handler 
app.use((req, res, next) => {
    res.status(404).json({
        message: "The request was not found!"
    })
});

module.exports = app;