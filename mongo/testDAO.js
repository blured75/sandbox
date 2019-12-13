const myDB = require('./db')

function insert(object) {
    let connection = null;

    myDB.open()
    .then((conn)=>{
        connection = conn;
        return conn.collection('chienne')    
    })
    .then((collection)=>{
        return collection.insert(object)
    })
    .then((result)=>{
        console.log(result)
        connection.close()
    })
    .catch((err)=>{
        console.error(err)
    })
}

function findAll() {
    let connection = null;

    return myDB.open()
    .then((conn)=>{
        connection = conn
        return conn.collection('chienne')    
    })
    .then((collection)=>{
        return collection.find({}).toArray()
    })
    .then((result)=>{
        console.log(result)
        connection.close()

        return result
    })
    .catch((err)=>{
        console.error(err)
    })
}

insert({"tamere":"la ute"})
insert({"tamere":"la ute2"})
insert({"tamere":"celle là elle est pour Nicolas"})

findAll().then((result) => console.log(result.length))