const express = require('express');
const Event = require('../models/events.js');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/events', authenticateToken, (req, res) => {
    Event.find({user: res.body.email})
      .then(result => {
        res.send(result);
      }).catch(err => console.log(err));
});
  
router.post('/events', authenticateToken, (req, res) => {
    const event = new Event(req.body);
    event.save()
      .then(result => {
        res.send('saved to DB');
      }).catch(err => console.log(err));
});
  
router.get('/events/:id', (req, res) => {
    const id = req.params.id;
    Event.findById(id)
      .then(result => {
        res.send(result);
      }).catch(err => console.log(err));
});
  
router.delete('/events/:id', authenticateToken, (req, res) => {
    const id = req.params.id;
    Event.findByIdAndDelete(id)
      .then(result => {
        res.redirect('/events');
      }).catch(err => console.log(err));
});

module.exports = router;