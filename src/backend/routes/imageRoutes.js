const express = require('express');
const Image = require('../models/images.js');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/images/:imgUrl', (req, res) => {
    const imgUrl = req.params.imgUrl;
    Image.findById(imgUrl)
        .then(result => {
            res.send(result.base64img);
        }).catch(err => console.log(err));
})

router.post('/images', authenticateToken, (req, res) => {
    const image = new Image(req.body);
    image.save()
        .then(result => {
            res.send(result._id);
        }).catch(err => console.log(err));
})

module.exports = router;