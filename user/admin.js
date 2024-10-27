const express = require('express');
const bcrypt = require('bcryptjs');
const admin = express.Router();
admin.use(express.json());


admin.post('/admin/login', function(req, res) {
    res.send('Admin login for EEU');
});

admin.get('/admin/customer', function(req, res) {
    res.send('Admin retrieve all registered users')
});

admin.post('/admin/product', function(req, res) {
    res.send('Admin add new product')
});

admin.put('/admin/product/:product_id', function(req, res) {
    res.send('Admin updates the details of existing product')
});

admin.delete('/admin/product/:product_id', function(req, res) {
    res.send('Admin deletes a product')
});

admin.get('/admin/orders', function(req, res) {
    res.send('Admin view all customer orders')
});

admin.put('/admin/orders/:order_id', function(req, res) {
    res.send('Admin updates the status of an order')
});

admin.get('/admin/sales', function(req, res) {
    res.send('Admin view sales statistics')
});


module.exports = admin;