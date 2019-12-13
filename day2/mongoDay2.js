const MongoClient = require('mongodb').MongoClient

function findAll() {
    let url = "mongodb://localhost:27017/test"
    MongoClient.connect(url).then(db => {
        //converted
        db.collection("chienne").find({}).toArray().
        then(data => {
            console.log(data)
            db.close()
        }).
        catch(err => {//failure callback
            console.log(err)
        });
    }).catch(err => { console.log(err) })
}

function insert(object) {
    let url = "mongodb://localhost:27017/test"
    MongoClient.connect(url).then(db => {
        //converted
        db.collection("chienne").insert(object).
        then(result => {
            console.log(result)
            console.log(`object_id : ${object._id}`)
            db.close()
        }).
        catch(err => {//failure callback
            console.log(err)
        });
    }).catch(err => { console.log(err) })
}

insert({"benjamin":"sac à main"})
findAll()