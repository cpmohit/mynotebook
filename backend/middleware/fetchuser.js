const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "mohit@12345";

const fetchuser = (req, res, next) => {
 //get the JWT token from header and append user Id in response
  const token = req.header("auth-token");
  
  if (!token) {
    return res.status(401).send({ error: "Un-Authorized Access." });
  }

  try {
    const result = jwt.verify(token, JWT_SECRET_KEY); // verify the token with secret key
    req.user = result.user; //fetch all user detail
    //return res.status(200).send(req.user);
    next();
  } catch (err) {
    return res.status(401).send({ error: "Un-Authorized Access." });
  }
};

module.exports = fetchuser;
