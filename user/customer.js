const express=require('express');
const bcrypt=require('bcryptjs');
const customer=express.Router();
customer.use(express.json());

customer.post('/login',function(req,res){
    res.send('EEU login for EEU');
});

customer.post('/signup', function(req, res){
    res.send('EEU signup for EEU');
});

customer.get('/dashboard', function(req, res){
    res.send('EEU dashboard');
});

user.get('/dashboard/products', function (req, res){
    res.send('View Products')
});
user.get('/dashboard/products/reserve', function (req, res){
    res.send('Reserve products')
});
user.get('/dashboard/products/cancelreserve', function (req, res){
    res.send('cancel reserved products')
});
user.get('/dashboard/products/reserve/paymentslip', function (req, res){
    res.send('View payment slip')
});

module.exports = customer;

const {Schema} = mongoose

const studentSchema = new Schema({
        name:{
            type:String,
            required: true
        },
        section:{
            type:String,
            required: true
        },
        gender:{
            type:String,
            required: true
        },
        hobby:{
            type:String
            
        }
})

const studentModel = mongoose.model('student', studentSchema);

export default studentModel;