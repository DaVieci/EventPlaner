const jwt = require('jsonwebtoken');
require('dotenv').config();

/** Function to check if token is valid */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).send('you dont have access');

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send('token not valid');
    res.body = user;

    next();
  })
}

module.exports = authenticateToken;