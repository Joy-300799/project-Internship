const express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./routes/route.js');
var multer = require('multer');
const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(multer().any());

mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/Joy_Bhattacharya-DB?authSource=admin&replicaSet=atlas-wwe75z-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true", { useNewUrlParser: true })
    .then(() => console.log('MongoDB is ready for action !'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(port, function () {
    console.log('Express app running on port ' + port)
});