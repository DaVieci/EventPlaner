require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.js');

const router = express.Router();

//get all users
router.get('/users', (req, res) => {
    User.find()
      .then(result => {
        res.send(result);
      }).catch(err => console.log(err));
});

//create new user
router.post('/users/sign-up', async (req, res) => {

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    req.body.confirmPassword = hashedPassword;

    const user = new User(req.body);
  
    user.save()
      .then(result => {
        console.log('user created');
        const username = req.body.email;
        const user = {email: username};

        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.send({token: accessToken});
      }).catch(err => console.log(err));
  } catch {res.status(500).send()}

});

//user login
router.post('/users/login', async (req, res) => {
  const user = await User.findOne({email: req.body.email});

  if (user == null) {
    return res.status(400).send('Cannot find user');
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {

      const username = req.body.email;
      const user = {email: username};

      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.send({token: accessToken});
    } else {
      res.send('not allowed');
    }
  } catch {res.status(500).send()}
});

//get user by id
router.get('/users/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
      .then(result => {
        res.send(result);
      }).catch(err => console.log(err));
});

//delete use by id
router.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
      .then(result => {
        res.send(result);
      }).catch(err => console.log(err));
});

module.exports = router;