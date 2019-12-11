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
    
    
    return () => {
        MongoClient.connect(connectionStr, mongoOptions, function(err, db) {
            //assert.equal(null, err)
            
            //Step 1: declare promise
            console.log("rereerer")

            

                return new Promise((resolve, reject) => {
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
                })
            
        })
    }
    
}

console.log(fetchGalliceBC())

fetchGalliceBC()().then(docs => {
    console.log("**** after the query call and after the obtention of results ****")
    countNumberOfKeywordsPerDoc(docs)
    db.close()
    writeStream.end()
})
.catch(err => {
    throw err
})
  

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
            writeStream.write('"%s";"%s";"%s";"%s";"%s";"%s";"%s";"%s"', doc.content.uid, doc.content.sid, doc.content.companyName, doc.content.offerCode, doc.content.articles[3].advText === undefined ? "0" : doc.content.articles[3].advText.length, doc.content.articles[3].keywords.length, nbHea, nbSkd)
        }
        catch (err) {
            console.log(err)
        }
    })
}