import mongoose from 'mongoose';
const moment = require('moment')
const Schema = mongoose.Schema;


const projectSchema = new Schema({
    projectName: {
        type: String,
        require: true,
    },
    technology: {
        type: String,
        require: true,
    },
    projectManager: {
        type: String, // Changed from String to ObjectId
        ref: 'users', // Reference to the users collection
        required: true,
    },
    startDate: {
        type: Date,
        require: true,
    },
    endDate: {
        type: Date,
        require: true,
    },
    members: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true,
    },
    details: {
        type: String,
        require: true,
    },
});

const Project = mongoose.models.projects || mongoose.model('projects', projectSchema);

export default Project;