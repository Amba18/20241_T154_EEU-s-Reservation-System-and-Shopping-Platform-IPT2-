import mongoose from "mongoose";

const CathSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    uses: {
        type: String,
        required: true,
    },
    photos: {
        type: [String],
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    products: {
        type: [String],
    },
    cheapestPrice: {
        type: Number,
        required: true,
    },
    featured: {
        type: Boolean,
        required: false,
    }
});

export default mongoose.model("Category", CathSchema);
