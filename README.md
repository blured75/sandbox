# sandbox
Prérequis : 
node 8 minimum et maximum :)

Un mongo installé en local, sans auth et qui écoute sur 27017

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

-- Day 1

Dossier firstSample/

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

Je viens de trouver la solution je suis passé de l'écoute de Meddle à Moustaki. Y aurait il un lien de causalité ?

Il suffit de retourner la promesse un niveau plus haut (avant MongoClient.connect)

```js
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
```

J'ai décidé d'ajouter un comptage de concepts dans mongodb par lettre de début de mots (compter le nombre de concepts commençant par A, par B, par C etc...)

Et bien un effet de bord marrant, le db.close() ferme la connexion trop tôt.. 
```js
function fetchAllHeadings() {
    //Step 1: declare promise
    return new Promise((resolve, reject) => {
        
        MongoClient.connect(connectionStr, mongoOptions, function(err, db) {
            assert.equal(null, err)

            db
            .collection('content_concept')
            .find({ }, 
                {"content.labels":1})
            .toArray((err, docs) => {
                err 
                    ? reject(err) 
                    : resolve(docs)

                    
            })
           
               
        })
        
    })
```

L'erreur obtenue est la suivante
```js
node:36513) UnhandledPromiseRejectionWarning: MongoError: connection destroyed, not possible to instantiate cursor
    at nextFunction (/Users/dboutin/dev/sandbox/node_modules/mongodb-core/lib/cursor.js:616:55)
    at Cursor.next [as _next] (/Users/dboutin/dev/sandbox/node_modules/mongodb-core/lib/cursor.js:701:3)
    at fetchDocs (/Users/dboutin/dev/sandbox/node_modules/mongodb/lib/cursor.js:857:10)
    at /Users/dboutin/dev/sandbox/node_modules/mongodb/lib/cursor.js:880:7
```

Faudrait il lancer une promise dans la promise ??? NON !

1 ère solution :

passer les objets db et docs en tableau à la méthode resolve, le then de la promesse y aura accès et il pourra fermer la connexion

```js
function fetchAllHeadings() {
    //Step 1: declare promise
    return new Promise((resolve, reject) => {
        
        MongoClient.connect(connectionStr, mongoOptions, function(err, db) {
            assert.equal(null, err)

            db
            .collection('content_concept')
            .find({ }, 
                {"content.labels":1})
            .toArray((err, docs) => {
                err 
                    ? reject(err) 
                    : resolve([docs, db])
            })
        })
        
    })
}
```

Pour le fun ajout d'une méthode qui itère directement sur le curseur plutôt que sur un tableau en mémoire

2ème solution :

Dossier mongo/
Refactoring et utilisation de modules

db.js : module retournant une connexion vers un mongo local
testDAO.js : 
    mise à disposition des méthodes insert(object) et findAll() qui travaillent sur la base test

    les functions insert et findAll sont appelées directment dans ce même fichier à des fins de tests

    Et bim ! Encore un truc bizarre : nodeJS ne rend jamais la main après l'appel de $ node testDAO.js


Next step :
    Mettre en place un modèle plus objet pour gérer les accès mongo à DAO style


--- Day 2

Problème de nodejs qui ne rend pas la main résolu.
La connection n'était jamais fermée réellement
L'idée du db.close() était un peu merdique

Du coup dans l'objet db je ne laisse l'accès qu'à open()
La promise renvoie la connection qu'il faut penser à fermer dans la classe appelante


Bon c'était bien marrant mais en fait c'est portnawak parce que mongoclient fournit déjà des promesses nativement si on n'utilise pas de callback

Dossier day2

mongoDay2.js
    1 function simple d'insert et 1 function simple de find

* Implementing an ArticleAPI with MongoDB
    model/Article.js
    articleTest.js

* Sample of Redis usage
    redis/channelPubSub.js
    redis/testRedis.js

* Test of serialization / deserialization perf
    serialization.js 

* Test on webStorage implementation for node
    usage of node webStorage

Pourquoi ne pas passer en anglais de temps en temps, ça passe bien


day 3
* Test postgres access
    day3/postgres/testPostgres.js

    On a une série d'ordre SQL lancés sous forme de callback et de promises et de divers autres traitements. Comment ordonnancer tout ça ?
    
    Pour l'instant ça s'exécute séquentiellement, j'ai l'impression que c'est un coup de chance

A priori le client.query est asynchrone donc le console.log("..... between 2 queries ....") va s'éxécuter avant les 2 requêtes.
```js
    client.query(query, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log("1. bla")
        }
    })

    console.log(".... between 2 queries ...")

    client.query(query, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log("2. bli")
        }
    })
```

day4
Si on veut chainer ces requêtes et être sur que tout se déroule dans l'ordre définit


Ce type d'écriture est un peu bizarre mais ça fonctionne
```js
getConn().
then(async() => {
  console.log("avant 1st selectNow2")
  await selectNow2()
  console.log("after 1st selectNow2")
})
.then(async() => {
  console.log("avant 2nd selectNow2")
  await selectNow2()
  console.log("after 2nd selectNow2")
})

async function selectNow2() {
  await client.query('SELECT NOW()')
  .then(res => {
    console.log(res.rows[0])
  })
  .catch(err => {
    console.log(err.stack)
  })
  
  console.log("1. connect & select now()")
}
```

Une manière plus simple de faire la même chose
```js
async function performQuery(){
  await getConn();
  console.log("before 1st selectNow2");
  await selectNow2();
  console.log("after 1st selectNow2");
  console.log("before 2nd selectNow2");
  await selectNow2();
  console.log("after 2nd selectNow2");
}


async function selectNow2() {
  console.log("1. connect & select now()")
  await client.query('SELECT NOW()')
  .then(res => {
    console.log(res.rows[0])
  })
  .catch(err => {
    console.log(err.stack)
  })
  
}

performQuery().then(() => {
  console.log("DONE")
  client.end()
})
```


day5 : Express / Connect + postgres

day5/testConnect.js

day6/
* handlingErrors.js
    error handling defined in errorHandler.js

* expressTest.js

* completeExpressSite/shoutBox
    Implementation of a kind of twitter in node
    Using express, ejs

Now, it is time to provide an external api to shoutBox

