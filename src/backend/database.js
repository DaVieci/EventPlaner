const mongoose = require('mongoose');

const mongopw = 'MAC@nuf0peal-thon';
const dbURI = 'mongodb+srv://bela_and_viet:' + mongopw + '@cluster0.tiroe.mongodb.net/eventplanner?retryWrites=true&w=majority';

/** Function to connect to mongodb */
function connect() {
    return new Promise((resolve, reject) => {

        console.log(process.env.NODE_ENV);

        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose;
            const mockgoose = new Mockgoose(mongoose);

            mockgoose.prepareStorage()
                .then(() => {
                    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
                        .then((res, err) => {
                            if (err) return reject(err);
                            resolve();
                        })
                })
        } else {
            mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
                .then((res, err) => {
                    if (err) return reject(err);
                    resolve();
                })
        }
    });
}

/** Function to close mongodb connection */
function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };