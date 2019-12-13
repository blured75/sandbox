const mongoClient = require('mongodb').MongoClient

// Open a connection to mongo server and return it as a Promise
// When you'll use .then() after calling open() you'll get the db object on which you can act
function open(){
    // Connection URL. This is where your mongodb server is running.
    // TODO : pass it directly through a env variable
    let url = "mongodb://localhost:27017/test"
    return new Promise((resolve, reject)=>{
        // Use connect method to connect to the Server
        mongoClient.connect(url, (err, conn) => {
            if (err) {
                reject(err);
            } else {
                resolve(conn);
            }
        });
    });
}

let db = {
    open: open
}

// Give for the user an access on a db object which you can open, use and close
module.exports = db;