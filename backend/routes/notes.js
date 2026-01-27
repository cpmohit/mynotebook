const express = require('express');
const router = express.Router();

router.get('/all', (req, res)=>{
    //res.send("Hello Login");
    obj = {
        msg: 'This is notebook Route',
        number: 34
    }
    res.json(obj);
})

module.exports = router;