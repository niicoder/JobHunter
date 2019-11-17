// Require mongoose 
const mongoose = require('mongoose')

// Store reference to mongoose.Scheme in variable
const Schema = mongoose.Schema

// Define the schema

const interactionSchema = new Schema({
    kind: String,
    date: Date,
    info: String,
    followups: [Date]
})

const progressSchema = new Schema({
    status: {
        type: String,
        default: 'applied',
    },
    interactions: [interactionSchema]
})

const jobAppSchema = new Schema({
    position: {
        type: String,
        required: true
    },
    company: {
        type: String,
    },
    contactEmail: {
        type: String,
    },
    contactFirstName: {
        type: String,
    },
    contactLastName: {
        type: String,
    },
    jobBoard: {
        type: String,
    },
    postingUrl: {
        type: String,
    },
    postDate: {
        type: Date,
    },
    comments: {
        type: String
    },
    progress: progressSchema
})

const userSchema = new Schema({
    googleSub: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    jobApps: [jobAppSchema]
})

module.exports = {
    User: mongoose.model('User', userSchema),
    JobApp: mongoose.model('JobApp', jobAppSchema),
    Progress: mongoose.model('Progress', progressSchema),
    Interaction: mongoose.model('Interaction', interactionSchema)
}