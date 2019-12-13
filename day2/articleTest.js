const db = require('./model/Article')

db().then(() => {
    db.Article.create({title: 'An article!'}).then(() => {
        db.Article.all().then(articles => {
            console.log(articles)
            db.Article.close()
        })
    })
})