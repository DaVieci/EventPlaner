const express = require('express');
const Image = require('../models/images.js');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/images/:imgUrl', authenticateToken, (req, res) => {
    const imgUrl = req.params.imgUrl;
    Image.findById(imgUrl)
        .then(result => {
            res.send(result);
        }).catch(err => console.log(err));
})

router.post('/images', (req, res) => {
    const image = new Image(req.body);
    image.save()
        .then(result => {
            res.send('image uploaded');
        }).catch(err => console.log(err));
})