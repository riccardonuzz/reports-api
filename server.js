// Main starting point of the App
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');
const router = require('./router');

// DB Setup
mongoose.connect(
    `${config.database.uri}:${config.database.port}/${config.database.name}`,
    { useNewUrlParser: true }
);

// App setup
const app = express();
app.disable('x-powered-by');
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
router(app);

// Server setup
app.listen(config.port, () => {
    console.log(`Started up at port ${config.port}`);
});