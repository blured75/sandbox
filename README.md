# sandbox
Prérequis : 
node 8 minimum et maximum :)

Ce bac à sable à pour vocation de partager des expériences de coding NodeJS

La programmation avec des méthodes asynchrone étant assez particulière avec node, j'ai eu envie de partager mon expérience sur le principe d'intérroger une base mongo, d'écrire le résultat produit dans un fichier csv et aussi dans une base mysql. C'est complétement con me direz vous mais c'est dans les conneries qu'on fait les meilleures confitures.

En tout cas ça reste de l'expérimentation et si ça peut servir ou questionner ça sera tant mieux. Pour l'instant ça me sert de pense bête

Warning, les explications sont pour l'instant aussi bordélique que le niveau de ma compréhension du concept. 

Fichiers disponibles :

. mongoExportAsync.js (version 1 du concept, qui fonctionne mais qui n'est pas géniale)

. mongoWithWriteOnFile.js (version 2 du concept, qui pourrait être bien si j'arrivais à la faire fonctionner)

But : Export sous forme csv des résultats d'une requête Mongo

Utilisation de promise à l'intérieur de la fonction callback passée à MongoClient.connect afin
d'éviter d'avoir à imbriquer les sous-fonction à l'intérieur de cette fonction callback

Un find sur une base mongo est asynchrone comme beaucoup de méthodes disponibles sous nodeJS

On ne peut pas les gérer de la même manière qu'une programmation séquentielle habituelle

Les fonctions callback sont une belle avancée car elles permettent de déclencher des traitements à la suite d'une méthode asynchrone. Le problème c'est que ça devient difficilement gérable lorsque l'on empile et l'on tente d'ordonnencer le tout

Les promises ont été créé depuis ES5 afin de moins se prendre la tête avec le chainage des callback.

Une promesse (une sorte de function) prend en constructeur 2 fonctions de callback (resolve et error). resolve sera à appeler dans la promesse si l'exécution s'est déroulé sans encombre, error dans le cas contraire. Une promesse permet d'englober un code asynchrone et d'appeler la fonction success si tout se passe bien. On passe alors un argument à reject ou success.
A la suite de la promesse on indique .then(...) pour exécuter le code que l'on souhaite et on récupère le paramètre passée à la fonction success.

    
Exemple :
```js
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

    //Step 2: make the real call with a then méthode
    // the argument passed to then is the one passed to the resolve(..) function
    // like some kind of magic
    fetchBC().then(docs => {
        console.log("**** after the query call and after the obtention of results ****")
        countNumberOfKeywordsPerDoc(docs)
        db.close();
     })
  }); //end mongo client
  ```

Le truc qui me déplait c'est que la requête passée à mongo n'est pas dans une function propre. Je souhaiterais pouvoir faire une vrai méthode qui me retourne une liste de docs que je puisse traiter et de ne pas intégrer tout mon traitement dans une grosse méthode difficilement factorisable

Dans l'absolue quelque chose comme ça serait bien
  ```js
    function getGaliceWine() {
        ....
        return docs
    }

    function exportDocs(docs) {
        docs.forEach(...) {
            ...
        }
    }

    let docs = getGaliceWine()
    exportDocs(docs)
  ```

J'ai essayé ce genre de code qui tourne plus à de l'expérimentation wtf avec des instructions non maitrisées de bout en bout 

  ```js
function fetchGalliceBC() {
    return () => {
        MongoClient.connect(connectionStr, mongoOptions, function(err, db) {
            assert.equal(null, err)
            
            //Step 1: declare promise

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


fetchGalliceBC().then(docs => {
    console.log("**** after the query call and after the obtention of results ****")
    countNumberOfKeywordsPerDoc(docs)
    db.close()
    writeStream.end()
}) 
.catch(err => {
    throw err
})
```

Ce code pue méchament surtout les return ()=> placés là au petit bohneur la chance

Mais pourquoi cette méthodes fetchGalliceBC() n'est pas une promesse ? Je suis bloqué sur ce point pour l'instant
```js
/Users/dboutin/dev/sandbox/mongoWithWriteOnFile.js:50
fetchGalliceBC().then(docs => {
                 ^

TypeError: fetchGalliceBC(...).then is not a function
```