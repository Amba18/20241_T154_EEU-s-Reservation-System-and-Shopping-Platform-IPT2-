import Customer from '../models/customer.js';

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
    const { email } = req.params; // Get the email from the route parameters

    try {
        const customer = await Customer.findOne({ email }); // Use findOne to search by email

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving customer" });
    }
};

const postCustomer = async (req, res) => {
    console.log("Received signup request:", req.body); // Log request body

    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if all fields are provided
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if a customer with the email already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Create a new customer
        const customer = new Customer({ firstName, lastName, email, password });
        const savedCustomer = await customer.save();
        console.log("Customer saved successfully:", savedCustomer); // Log successful save
        res.status(201).json({ message: "Signup successful!" });
    } catch (error) {
        console.error("Error during signup:", error); // Log error details
        res.status(500).json({ message: "Error saving customer" });
    }
};


// Update customer by email
const updateCustomer = async (req, res) => {
    const { email } = req.params; // Get the email from the route parameters

    try {
        const updatedCustomer = await Customer.findOneAndUpdate({ email }, req.body, { new: true }); // Update the customer and return the updated document

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
    const { email } = req.params; // Get the email from the route parameters

    try {
        const deletedCustomer = await Customer.findOneAndDelete({ email }); // Delete the customer

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
