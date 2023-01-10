const db = require('./db/connect.js');
const express = require('express');
const app = express();
const startInquirer = require('./library/company.js');
// testing port from challenge in the other folder
const PORT = process.env.PORT || 3001;

// middleware/ using false to move it throguh the query string
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// response to throw an error is anything else is requested

app.use((req, res) => {
    res.status(404).end();
});

// running server after connected to database

db.connect(err => {
    if (err) 
    throw err;
    app.listen(PORT, () =>{
        console.log(`server is running on ${PORT}`);
        startInquirer();
    });
});
