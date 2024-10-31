import Customer from '../models/customer.js';
import bcrypt from 'bcrypt'; // Make sure to import bcrypt for password hashing and comparison

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving customers" });
    }
};

const getCustomerByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving customer" });
    }
};

// Shared function for signup and login
const postCustomer = async (req, res) => {
    console.log("Received request:", req.body); // Log request body

    const { firstName, lastName, email, password } = req.body;

    // Check if it's a signup or login based on the presence of firstName and lastName
    if (firstName && lastName) {
        // Signup logic
        try {
            // Check if all fields are provided
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required for signup" });
            }

            // Check if a customer with the email already exists
            const existingCustomer = await Customer.findOne({ email });
            if (existingCustomer) {
                return res.status(400).json({ message: "Email already in use" });
            }

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            const customer = new Customer({ firstName, lastName, email, password: hashedPassword });
            const savedCustomer = await customer.save();
            console.log("Customer saved successfully:", savedCustomer);
            return res.status(201).json({ message: "Signup successful!" });
        } catch (error) {
            console.error("Error during signup:", error);
            return res.status(500).json({ message: "Error saving customer" });
        }
    } else {
        // Login logic
        try {
            // Check if all fields are provided
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required for login" });
            }

            // Find the customer by email
            const customer = await Customer.findOne({ email });
            if (!customer) {
                return res.status(400).json({ message: "Invalid email or password." });
            }

            // Compare the provided password with the hashed password
            const isPasswordValid = await bcrypt.compare(password, customer.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid email or password." });
            }

            // Login successful
            return res.status(200).json({ message: "Login successful!", customer });
        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ message: "Error logging in" });
        }
    }
};

// Update customer by email
const updateCustomer = async (req, res) => {
    const { email } = req.params;

    try {
        const updatedCustomer = await Customer.findOneAndUpdate({ email }, req.body, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating customer" });
    }
};

// Delete customer by email
const deleteCustomer = async (req, res) => {
    const { email } = req.params;

    try {
        const deletedCustomer = await Customer.findOneAndDelete({ email });

        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting customer" });
    }
};

export { getCustomers, getCustomerByEmail, postCustomer, updateCustomer, deleteCustomer };
