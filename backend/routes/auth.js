const express = require("express");
const { body, validationResult } = require("express-validator"); // add validator package
const router = express.Router();
const User = require("../models/User");
const bcrypt = require ("bcryptjs");
const jwt = require('jsonwebtoken');
//Create a user using: POST "/api/auth". Does not require Auth

// Create a user using: POST "/api/auth/createUser"
// Does not require authentication
router.post(
  "/createUser",
  [
    body("name", "Name must be at least 5 characters").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const JWT_SECRET_KEY = 'mohit@12345';
    // If there are errors return Bad request and the errors
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    //const user = User(req.body);
    //user.save();

    try {
      // handling try catch

      // Check whether user with this email exist already
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        res.status(400).json({ error: "User already exist with this email." });
      }
      // Create a user into schema named User

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      const securePAss = hash;

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePAss,
      });

      const data = {
        user:{
            id:user.id
        }
      }
      // TO generate JWT Token
      const JwtData = jwt.sign(data,JWT_SECRET_KEY); // already a ascn method
      
      res.status(200).json({'authToken': JwtData});

      // .then(user=>res.status(200).json(user))
      // .catch(err=> {
      //     console.log(err)
      //     res.json({error: 'Please enter a unique value for email', message: err.message })
      // })
      // For now just returning request body
      //res.status(200).json(req.body);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Somethng went wrong! Please try again later.");
    }
  }
);

router.get("/login", (req, res) => {
  console.log(req.body);
  res.send(req.body);
  // obj = {
  //     msg: 'This is Login Route',
  //     number: 34
  // }
  // res.json(obj);
});

router.get("/signup", (req, res) => {
  res.send("Hello Signup");
});

module.exports = router;
