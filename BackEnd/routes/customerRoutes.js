const express = require ('express');
const bcrypt = require ('bcryptjs');
const app=express();
import {postCustomer, getCustomer} from '../controller/customerController.js'
app.use(express.json());

const customer = require('./Customer');
const admin = require('./admin');

app.post('/customer', postCustomer);
app.get('')


const PORT=8000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});


import express from 'express'
import { getStudents,getStudent,postStudent } from '../controller/studentController.js'
const router = express.Router()

router.get('/',getStudents)

router.get('/:id', getStudent)

router.post('/',postStudent);


export default router