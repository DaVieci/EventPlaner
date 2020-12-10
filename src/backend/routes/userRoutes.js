const express = require('express');
const User = require('../models/users.js');

const router = express.Router();

router.get('/users', (req, res) => {
    User.find()
      .then(result => {
        res.send(result);
      }).catch(err => console.log(err));
});
  
router.post('/users', (req, res) => {
    const user = new User(req.body);
  
    user.save()
      .then(result => {
        console.log('user created');
        res.send(result);
      }).catch(err => console.log(err));
});
  
router.get('/users/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
      .then(result => {
        res.send(result);
      }).catch(err => console.log(err));
});
  
router.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
      .then(result => {
        res.send(result);
      }).catch(err => console.log(err));
});

module.exports = router;