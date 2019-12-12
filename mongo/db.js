const mongoClient = require('mongodb').MongoClient

// Open a connection to mongo server and return it as a Promise
// When you'll use .then() after calling open() you'll get the db object on which you can act
function open(){
    // Connection URL. This is where your mongodb server is running.
    // TODO : pass it directly through a env variable
    let url = "mongodb://localhost:27017/test"
    return new Promise((resolve, reject)=>{
        // Use connect method to connect to the Server
        mongoClient.connect(url, (err, db) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}

// Close the db connection if opened
function close(db){
    //Close connection
    if(db){
        db.close();
    }
}

let db = {
    open : open,
    close: close
}

// Give for the user an access on a db object which you can open, use and close
module.exports = db;