require('dotenv').config();
import express from 'express';
import path from 'path';
import logger from 'morgan';
import mongoose from 'mongoose';

import { appErrorHandler } from './handlers/ErrorHandler';
import usersRouter from './routes/users';

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'web/dist')));

mongoose.set('debug', true);

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('database connection succeeded');
});

app.use('/api/users', usersRouter);

// Error handler
app.use(appErrorHandler);

module.exports = app;
