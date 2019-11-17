'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/users', require('./routes/users'))

app.use('/', express.static('build'))

app.use('*', express.static(
  path.join(__dirname, '../build/index.html')
))

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    const errors = [
      { message: 'unauthorized' },
    ];

    res.status(401).json({ errors });
  }
});

module.exports = app;
