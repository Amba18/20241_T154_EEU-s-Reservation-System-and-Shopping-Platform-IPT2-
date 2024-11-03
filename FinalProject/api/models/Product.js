import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        
    },
    price:{
        type: Number,
        required: true,
    },
    maxPurchase:{
        type: Number,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    count:{
        type: Number,
        required: true,
    }
    
},
{timestamps:true}
);

export default mongoose.model("Product", ItemSchema)
