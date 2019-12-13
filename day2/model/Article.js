const { MongoClient, ObjectID } = require('mongodb')
let db

module.exports = () => {
    return MongoClient
        .connect('mongodb://localhost:27017/articles')
        .then((client) => {
            db = client
        })
}
module.exports.Article = {
    all() {
        return db.collection("articles").find().sort({ title: 1 }).toArray() 
    },
    find(_id) {
        if (typeof _id !== 'object') _id = ObjectID(_id)
        return db.collection('articles').findOne({_id})
    },
    create(data) {
        return db.collection('articles').insertOne(data, {w: 1})
    },
    delelete(_id) {
        if (typeof _id !== 'object') _id = ObjectID(_id)
        return db.collection('articles').deteleOne({_id}, {w: 1})
    },
    close() {
        db.close()
    }
}