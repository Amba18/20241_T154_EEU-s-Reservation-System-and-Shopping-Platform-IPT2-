import Customer from '../models/customer.js';

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        console.error("Error retrieving customers:", error);
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
        console.error("Error retrieving customer:", error);
        res.status(500).json({ message: "Error retrieving customer" });
    }
};

const postCustomer = async (req, res) => {
    console.log("Received signup request:", req.body);

    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if all fields are provided
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if a customer with the email already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(409).json({ message: "Customer with this email already exists" });
        }

        // Create a new customer
        const customer = new Customer({ firstName, lastName, email, password });
        const savedCustomer = await customer.save();
        console.log("Customer saved successfully:", savedCustomer);
        res.status(201).json({ message: "Signup successful!", customer: savedCustomer });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Error saving customer" });
    }
};

const updateCustomer = async (req, res) => {
    const { email } = req.params;

    try {
        const updatedCustomer = await Customer.findOneAndUpdate(
            { email },
            req.body,
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Error updating customer" });
    }
};

const deleteCustomer = async (req, res) => {
    const { email } = req.params;

    try {
        const deletedCustomer = await Customer.findOneAndDelete({ email });

        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Error deleting customer" });
    }
};

export { getCustomers, getCustomerByEmail, postCustomer, updateCustomer, deleteCustomer };
