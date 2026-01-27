const connectToMongo = require("./db");
connectToMongo();

const express = require("express");
const app = express(); 

app.use(express.json()); //Enable JSON body parsing for all incoming requests // To Use Middleware

// app.get('/api/v1/login', (req, res)=>{
//     res.send("Hello Login");
// })
// app.get('/api/v1/signup', (req, res)=>{
//     res.send("Hello Signup");
// })

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
  