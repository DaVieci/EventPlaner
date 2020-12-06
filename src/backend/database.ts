var MongoClient = require('mongodb').MongoClient;

//Insert Document
var insertDocument = function(db, callback){
    var collection = db.collection('events');

    collection.insert({ title: 'Party', date: Date()});

    db.collection('events').count(function (err, count) {
        if (err) throw err;
        
        console.log('Total Rows: ' + count);
    });
}

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/eventplanner", function(err, db){
    if (err) throw err;
    console.log("it is working");
    db.close();
    //insertDocument(client.db('eventplanner'), function() {
      //  db.close();
    //});
})