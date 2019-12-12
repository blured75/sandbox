const db = require('./db')

function insert(object) {
    db.open()
    .then((db)=>{
        return db.collection('chienne')    
    })
    .then((chienne)=>{
        return chienne.insert(object)
    })
    .then((result)=>{
        console.log(result);
        db.close();
    })
    .catch((err)=>{
        console.error(err)
    })
}

function findAll() {
    return db.open()
    .then((db)=>{
        return db.collection('chienne')    
    })
    .then((chienne)=>{
        return chienne.find({}).toArray()
    })
    .then((result)=>{
        console.log(result)
        
        db.close()
        return result
    })
    .catch((err)=>{
        console.error(err)
    })
}

insert({"tamere":"la ute"})
/*insert({"tamere":"la ute2"})
insert({"tamere":"celle là elle est pour Nicolas"})

findAll().then((result) => console.log(result.length))
*/