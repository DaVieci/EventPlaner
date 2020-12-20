const express = require('express');
const Category = require('../models/categories.js');

const router = express.Router();

/** route to get categories for dropdownbox */
router.get('/categories', (req, res) => {
    Category.find()
        .then(result => {
            res.send(result);
        }).catch(err => console.log(err))
});

/** route to add new categories (didnt get that far) */
router.post('/categories', (req, res) => {
    if (Category.find({ catType: req.body.type })) {
        res.send('Category already exists')
    }

    const category = new Category(req.body);

    category.save()
        .then(result => {
            console.log('New category created');
        }).catch(err => console.log(err));
})

module.exports = router;