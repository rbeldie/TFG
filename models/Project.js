import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true,
        unique:true
    },
    budget:{
        type:Number,
        required:true
    },
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    },
    coordinator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Worker',
    },
    workers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Worker',
        }
    ],
    costs:[]
})

const Project = mongoose.model('Project',ProjectSchema);

export default Project;

export { ProjectSchema};