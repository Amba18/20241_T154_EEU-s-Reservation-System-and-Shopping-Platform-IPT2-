import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
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
        unique: true, // Ensure that email is unique
    },
    password: {
        type: String,
        required: true,
    },
});

// Create a Customer model based on the schema
const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
