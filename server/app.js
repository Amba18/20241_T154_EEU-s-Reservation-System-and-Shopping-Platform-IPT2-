const express = require ('express');
const bcrypt = require ('bcryptjs');
const app=express();
app.use(express.json());

const customer = require('./Customer');
const admin = require('./admin');

app.use('', customer);
app.use('', admin);

const PORT=8000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});


