import express from 'express';
import { getCustomers, getCustomerByEmail, postCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js';

const router = express.Router();

// Route to get all customers
router.get('/', getCustomers);

// Route to get a customer by email
router.get('/email/:email', getCustomerByEmail);

// Route to add a new customer
router.post('/', postCustomer);

// Route to update a customer by email
router.put('/email/:email', updateCustomer);

// Route to delete a customer by email
router.delete('/email/:email', deleteCustomer);

router.get('/', async (req, res) => {
    try {
        const postCustomer = async (req, res) => {
            console.log("Signup request received:", req.body); 
        };        
        const customers = await Customer.find();
        console.log("Fetched customers from MongoDB:", customers); // Log fetched data
        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: error.message });
    }
});





export default router;
