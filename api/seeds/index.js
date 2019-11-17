// seeds/index.js
const { User, JobApp, Progress } = require('../models/User')
// const { JobApp } = require('../models/JobApp')
const users = require('./users')
// const jobApps = require('./jobApps')
const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27017/jobhunter'

// truncate is just a fancy word for 'delete all of'
const truncateDatabase = async () => {
    // here we delete all our users and posts so we can start with fresh data
    return Promise.all([User.deleteMany(), JobApp.deleteMany()])
}

const makeSeeds = async () => {
    // connect to our mongo database
    await mongoose.connect(uri)
    // delete all old data in the database
    await truncateDatabase()
    // save all our users into the database
    await Promise.all(users.map(user => user.save()))
    // save our seeded post into the database
    // await Promise.all(jobApps.map(jobApp => jobApp.save()))
    // that's it! close the connection
    mongoose.connection.close()
}

makeSeeds()
