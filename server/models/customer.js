import mongoose from "mongoose";

const { Schema } = mongoose;

const customerSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const customerModel = mongoose.model('customer', customerSchema);
export default customerModel; // Export the model, not the schema
