import mongoose from "mongoose";
import {CategorySchema} from "./Category.js";

const WorkerSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    dni:{
        type:String,
        require:true,
        unique:true
    },
    timeToWork:{
        type:Number,
    },
    pwd:{
        type:String,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    projects:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Project'
    }]
})

const Worker = mongoose.model('Worker', WorkerSchema);

export default Worker;