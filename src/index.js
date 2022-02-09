const express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./routes/route.js');
var multer = require('multer');
const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(multer().any());

mongoose.connect("mongodb+srv://Joy-DB:joy123@cluster0.e8rbz.mongodb.net/Internship", { useNewUrlParser: true })
    .then(() => console.log('MongoDB is ready for action !'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(port, function () {
    console.log('Express app running on port ' + port)
});