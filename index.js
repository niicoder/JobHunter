'use strict';

const server = require('./api/server');
const mongoose = require('mongoose')

const { PORT, MONGODB_URI } = require('./api/utils/constants');

mongoose.connect(MONGODB_URI)

server.listen(PORT, async () => {
    await mongoose.connect(MONGODB_URI)
    console.log(`App listening on port ${PORT}`)
});
