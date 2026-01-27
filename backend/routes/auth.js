const express = require('express');
const router = express.Router();
const User = require('../models/User');

//Create a user using: POST "/api/auth". Does not require Auth

router.post('/create', (req, res)=>{
    console.log(req.body);
    const user = User(req.body);
    user.save();
    res.send(req.body);
})

router.get('/login', (req, res)=>{
   

    console.log(req.body);
    res.send(req.body);
    // obj = {
    //     msg: 'This is Login Route',
    //     number: 34
    // }
    // res.json(obj);
})

router.get('/signup', (req, res)=>{
    res.send("Hello Signup");
})


module.exports = router;