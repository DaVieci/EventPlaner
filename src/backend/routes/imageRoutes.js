const express = require('express');
const Image = require('../models/images.js');
const authenticateToken = require('../middleware/auth');
const fs = require('fs');
const { parse } = require('path');

const router = express.Router();

const image_path = '../frontend/src/assets/event_pics/';

router.get('/images/:imgId', (req, res) => {
    // const imgId = req.params.imgId;
    // Image.findById(imgId)
    //     .then(result => {
    //         res.send(result.base64img);
    //     }).catch(err => console.log(err));

    const imgId = req.params.imgId;
    var imgPath = image_path+imgId;

    // var img = fs.readFile(imgPath, 'base64', (res, err) => {
    //     if(err) console.log(err);
    // });

    res.send(imgPath);
})

router.post('/images', authenticateToken, (req, res) => {
    // const image = new Image(req.body);
    // image.save()
    //     .then(result => {
    //         res.send(result._id);
    //     }).catch(err => console.log(err));

    var img = req.body;
    // strip off the data: url prefix to get just the base64-encoded bytes
    //var data = img.replace(/^data:image\/\w+;base64,/, "");
    var data = JSON.stringify(img).replace(new RegExp(/^data:image\/\w+;base64,/), "");
    //var buf = new Buffer.from(data, 'base64');
    var imgName = 'img_'+Date.now();
    var imgPath = image_path+imgName;

    //save img as PNG

    res.send(imgName);
})

module.exports = router;