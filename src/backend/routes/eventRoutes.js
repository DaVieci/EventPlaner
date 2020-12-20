const express = require('express');
const Event = require('../models/events.js');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

/** route to get events as logged in user with token */
router.get('/events', authenticateToken, (req, res) => {
  Event.find({ user: res.body.email })
    .then(result => {
      res.send(result);
    }).catch(err => console.log(err));
});

/** route to create a new event */
router.post('/events', authenticateToken, (req, res) => {
  const event = new Event(req.body);
  event.save()
    .then(result => {
      res.send('saved to DB');
    }).catch(err => console.log(err));
});

/** route to get an event by its id */
router.get('/events/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  Event.findById(id)
    .then(result => {
      res.send(result);
    }).catch(err => console.log(err));
});

/** route to update an existing event */
router.put('/events/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  Event.updateOne({ _id: id }, req.body)
    .then(result => {
      res.send('saved to DB');
    }).catch(err => console.log(err));
});

/** route to delete an event */
router.delete('/events/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  Event.findByIdAndDelete(id)
    .then(result => {
      res.redirect('/events');
    }).catch(err => console.log(err));
});

module.exports = router;