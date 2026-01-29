const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "mohit@12345";

const fetchuser = (req, res, next) => {
  //get the user from JWT token and append the ID in response
  const token = req.header("auth-token");
  
  if (!token) {
    return res.status(401).send({ error: "Un-Authorized Access." });
  }

  try {
    const result = jwt.verify(token, JWT_SECRET_KEY);
    req.user = result.user;
    //return res.status(200).send(req.user);
    next();
  } catch (err) {
    return res.status(401).send({ error: "Un-Authorized Access." });
  }
};

module.exports = fetchuser;
