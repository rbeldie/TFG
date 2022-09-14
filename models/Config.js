import mongoose from "mongoose";


const ConfigSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    value:{
        type:Number,
        required:true
    }
})

const Config = mongoose.model('Config',ConfigSchema);

export default Config;

export { ConfigSchema};