const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.header['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if(token == null) return res.status(401).send('you dont have access');
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.staus(403).send('token not valid');
  
      req.user = user;
      next();
    })
  }
  
  module.exports = authenticateToken;