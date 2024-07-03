import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        require: true,
    },
    date: {
        type: Date,
        require: true,
    },
    estimatedDuration: {
        type: Number,
        require: true,
    },
    finalTime: {
        type: Number,
        require: true,
    },
    status: {
        type: String,
        require: true,
    },
    comment: {
        type: String,
        require: true,
    },
    reply: {
        type: String,
        require: true,
    },
    qa: {
        type: Boolean,
        require: true,
    },
    codeQuality: {
        type: Boolean,
        require: true,
    },
    approvedByClient: {
        type: Boolean,
        require: true,
    },
    developerName: {
        type: String,
        require: true,
    },
});

const Task = mongoose.models.tasks || mongoose.model('tasks', taskSchema);

export default Task;