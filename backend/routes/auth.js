const express = require("express");
const { body, validationResult } = require("express-validator"); // add validator package
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET_KEY = "mohit@12345";

// Route-1 : Create a user using: POST "/api/auth". Does not require Auth

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
        user: {
          id: user.id,
        },
      };
      // TO generate JWT Token
      const JwtData = jwt.sign(data, JWT_SECRET_KEY); // already a ascn method

      res.status(200).json({ authToken: JwtData });

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

//Route-2 : Authenticate a User using: POST method /api/auth/login
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    // If there are errors in validation return Bad request and the errors
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body; // destructuring of request body

    try {
      // handling try catch

      // Check whether user is exist in db
      let user = await User.findOne({ email: email });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct login details" });
      }

      // Compare the password

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct login details" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      // TO generate JWT Token
      const JwtData = jwt.sign(payload, JWT_SECRET_KEY); // already a async method

      res.status(200).json({ authToken: JwtData });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Somethng went wrong! Please try again later.");
    }
  }
);

//Route-3 : Get logged In User detail using: POST method /api/auth/getUserDetail  // Login required

router.post("/getUserDetail", fetchuser, async (req, res) => {
  
  try {
   //return res.status(200).send(req.user);
    
    const userId = req.user.id; 
   
    // Check whether user id exist in db
    let user = await User.findById(userId).select("-password"); // fetch record by id except password
    
    if (!user) {
      return res
        .status(401)
        .json({ error: "Please try to login with correct login details." });
    }

    return res.status(200).send(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Somethng went wrong! Please try again later.");
  }
});

module.exports = router;
