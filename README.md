# sandbox

Alors ça ça marche

```
MongoClient.connect(connectionStr, mongoOptions, function(err, db) {
        assert.equal(null, err);
        
        //Step 1: declare promise
        let fetchBC = () => {
        return new Promise((resolve, reject) => {
            db
            .collection('content_businesscard')
            .find({ $or: [ {"content.articles.keywords.cptId":78922} , { "content.articles.keywords.cptId":78923 }] , 
                            "content.portfolio":"EUR"}, 
                  {"content.articles":1, "content.uid":1, "content.":1, "content.sid":1, "content.offerCode":1, "content.companyName":1})
            .toArray((err, docs) => {
                err 
                    ? reject(err) 
                    : resolve(docs);
            });
        }); 
    };

    //Step 3: make the call
    fetchBC().then(docs => {
        console.log("**** after the query call and after the obtention of results ****")
        countNumberOfKeywordsPerDoc(docs)
        db.close();
     })
  }); //end mongo client
  ```

  Je voudrais mettre ce bloc dans une function
  ```
MongoClient.connect(connectionStr, mongoOptions, function(err, db) {
        assert.equal(null, err);
        
        //Step 1: declare promise
        let fetchBC = () => {
        return new Promise((resolve, reject) => {
            db
            .collection('content_businesscard')
            .find({ $or: [ {"content.articles.keywords.cptId":78922} , { "content.articles.keywords.cptId":78923 }] , 
                            "content.portfolio":"EUR"}, 
                  {"content.articles":1, "content.uid":1, "content.":1, "content.sid":1, "content.offerCode":1, "content.companyName":1})
            .toArray((err, docs) => {
                err 
                    ? reject(err) 
                    : resolve(docs);
            });
        });
    };
```

Mais ça chie des bulles

```
function fetchGalliceBC() {
    
    
    return () => {
        MongoClient.connect(connectionStr, mongoOptions, function(err, db) {
            //assert.equal(null, err)
            
            //Step 1: declare promise
            console.log("rereerer")

            return () => {
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
            }
            
        })
    }
    
}

console.log(fetchGalliceBC())

fetchGalliceBC().then(docs => { ....
```