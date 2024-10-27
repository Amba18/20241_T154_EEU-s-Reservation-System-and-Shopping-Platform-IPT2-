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
    try {
        const customer = new Customer(req.body);
        const savedCustomer = await customer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        console.error(error);
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
