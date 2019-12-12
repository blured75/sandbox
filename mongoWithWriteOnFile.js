const MongoClient = require("mongodb").MongoClient
const assert = require("assert")
const fs = require('fs')

const filePath = '/tmp/list_gallician_wine.csv'
const connectionStr = "mongodb://prodmongodb2.production.europages.com:27017/onlinedb"
const mongoOptions = {native_parser:true}

let writeStream = fs.createWriteStream(filePath, "utf8")

writeStream.on('error', function (err) {
    console.log(err);
})

// the finish event is emitted when all data has been flushed from the stream
writeStream.on('finish', () => {
    console.log('wrote all data to file');
})

function fetchGalliceBC() {
    //Step 1: declare promise
    return new Promise((resolve, reject) => {
        MongoClient.connect(connectionStr, mongoOptions, function(err, db) {
            assert.equal(null, err)
            
            db
            .collection('content_businesscard')
            .find({ $or: [ {"content.articles.keywords.cptId":78922} , { "content.articles.keywords.cptId":78923 }] , 
                            "content.portfolio":"EUR"}, 
                {"content.articles":1, "content.uid":1, "content.":1, "content.sid":1, "content.offerCode":1, "content.companyName":1})
            .toArray((err, docs) => {
                err 
                    ? reject(err) 
                    : resolve(docs)
            })
            db.close()
        })
    })
}

function fetchGalliceWithCursor() {
    //Step 1: declare promise
    return new Promise((resolve, reject) => {
        MongoClient.connect(connectionStr, mongoOptions, function(err, db) {
            assert.equal(null, err)
            
            let cursor = db
            .collection('content_businesscard')
            .find({ $or: [ {"content.articles.keywords.cptId":78922} , { "content.articles.keywords.cptId":78923 }] , 
                            "content.portfolio":"EUR"}, 
                {"content.articles":1, "content.uid":1, "content.":1, "content.sid":1, "content.offerCode":1, "content.companyName":1})
            
            resolve(cursor)

            db.close()
        })
    })
}



function countNumberOfKeywordsPerDoc(docs) {
    docs.forEach(doc => {
        // get the number of Headings
        let nbHea = 0
        let nbSkd = 0

        doc.content.articles[3].keywords.forEach(keyword => {
            // Count number of heading & skd
            if (keyword.type == 2) {
                nbHea++
            }
            if (keyword.type == 3) {
                nbSkd++
            }
        })
        try {
            writeStream.write(`${doc.content.uid};${doc.content.sid};${doc.content.companyName};${doc.content.offerCode};`
                             +`${doc.content.articles[3].advText === undefined ? "0" : doc.content.articles[3].advText.length};${nbHea};${nbSkd}\n`)
        }
        catch (err) {
            console.log(err)
        }
    })
}

fetchGalliceBC().then(docs => {
    countNumberOfKeywordsPerDoc(docs)
    writeStream.end()
})
.catch(err => {
    throw err
})

fetchAllHeadings().then(docs => {
    let beginWithA = 0
    let beginWithB = 0
    let beginWithC = 0
    let beginWithD = 0
    let beginWithE = 0
    let beginWithF = 0
    docs.forEach(doc => {
        if (doc.content) {
            let label = doc.content.labels[3]
            if (label) {
                //console.log(`label ${label}`)
                if (label.match(/^A/)) beginWithA++
                if (label.match(/^B/)) beginWithB++
                if (label.match(/^C/)) beginWithC++
                if (label.match(/^D/)) beginWithD++
                if (label.match(/^E/)) beginWithE++
                if (label.match(/^F/)) beginWithF++
            }
        }
    })

    console.log(`A ${beginWithA}
                 B ${beginWithB}
                 C ${beginWithC}
                 D ${beginWithD}
                 E ${beginWithE}
                 F ${beginWithF}`)
})

function fetchAllHeadings() {
    //Step 1: declare promise
    return new Promise((resolve, reject) => {
        
        MongoClient.connect(connectionStr, mongoOptions, function(err, db) {
            assert.equal(null, err)
            
            db1 = db

            db
            .collection('content_concept')
            .find({ }, 
                {"content.labels":1})
            .toArray((err, docs) => {
                err 
                    ? reject(err) 
                    : resolve(docs)
            })
           
            db.close()    
        })
        
    })
}