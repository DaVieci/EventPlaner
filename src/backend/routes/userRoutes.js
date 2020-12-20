require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.js');

const router = express.Router();

/** route to get all users (just for testing during backend creation) */
router.get('/users', (req, res) => {
  User.find()
    .then(result => {
      res.send(result);
    }).catch(err => console.log(err));
});

/** route to create a new user */
router.post('/users/sign-up', async (req, res) => {

  const user = await User.findOne({ email: req.body.email });

  if (user != null) {
    return res.send('This e-mail address is already in use');
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    req.body.confirmPassword = hashedPassword;

    const user = new User(req.body);

    user.save()
      .then(result => {
        console.log('user created');
        const email = req.body.email;
        const fullName = user.fullName;
        const userToken = { email: email, fullName: fullName };

        const accessToken = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7200s' });
        res.send({ token: accessToken });
      }).catch(err => console.log(err));
  } catch { res.status(500).send() }

});

/** rout to login as existing user */
router.post('/users/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user == null) {
    return res.status(400).send('Cannot find user');
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {

      const email = req.body.email;
      const fullName = user.fullName;
      const userToken = { email: email, fullName: fullName };

      const accessToken = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7200s' });
      res.send({ token: accessToken });
    } else {
      res.send('not allowed');
    }
  } catch { res.status(500).send() }
});

/** route to get a user by its id (not in use) */
router.get('/users/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(result => {
      res.send(result);
    }).catch(err => console.log(err));
});

/** route to send resnponse after logout */
router.post('/users/logout', (req, res) => {
  res.status(200).send('logout successful');
})

/** route to delete a user */
router.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then(result => {
      res.send(result);
    }).catch(err => console.log(err));
});

module.exports = router;