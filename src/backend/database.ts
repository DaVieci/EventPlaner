const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
var db;

const testDocument = ({
    title: 'Sleep',
    body: 'pls goto sleep',
    date: Date(),
    user: {
        name: 'Viet'
    }
})

function insertOneDoc(client, collection, data) {
    collection.insertOne(data);
    client.close();
}

// Connect to the db
MongoClient.connect(url).then(client => {
    db = client.db('eventplanner'); //select DB
    console.log('DB selected');
    const collection = db.collection('events'); //select collection
    console.log('collection selected');
    return insertOneDoc(client, collection, testDocument);
}).then(response => {
    console.log('New document inserted: \n', testDocument);
})
.catch(error => {
    console.log(error);
});