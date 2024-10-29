import express from 'express';
import { getCustomers, getCustomerByEmail, postCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js';

const router = express.Router();

// Route to get all customers
router.get('/', getCustomers);

// Route to get a customer by email
router.get('/email/:email', getCustomerByEmail);

// Route to add a new customer (signup)
router.post('/', postCustomer); // This will handle both signup and login logic in postCustomer

// Route to update a customer by email
router.put('/email/:email', updateCustomer);

// Route to delete a customer by email
router.delete('/email/:email', deleteCustomer);

export default router;
