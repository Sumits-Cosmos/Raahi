const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectToDB = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');

connectToDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('welcome to the backendserver');
})

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);


module.exports = app;