const app = require('connect')()
const { Pool } = require('pg')
const compression = require('compression')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')

app.use(function middleware1(req, res, next) {
    console.log(`req.path ${req.path}`)
    console.log("second middleware")
    next()
})
app.use(function middleware2(req, res, next) {
    console.log("third middleware")
    next()
})
app.use(compression())
app.use(cookieSession({ keys: ['secret1', 'secret2'] }))
app.use(bodyParser.urlencoded({extended: false}))
app.use('/foo', function fooMiddleware(req, res, next) {
    console.log("interception of /foo url type")
    // req.url starts with "/foo"
    //next();
    res.end("ute")
})
app.use('/bar', function barMiddleware(req, res, next) {
    console.log("interception of /bar url type")
    // req.url starts with "/bar"
    //next();
    res.end("ca alors")
})
app.use('/favicon.ico', function barMiddleware(req, res, next) {
    console.log("favicon.ico asked stopping there")
})
app.use(setup(':method Pouet :url'))
app.use('/appli', (req, res, next) => {
    console.log("first middleware")
    //throw err
    performQuery().then(jour => {
        res.end(`Ta mere le ${jour}`)
    })
})
// Génération d'une erreur interne au serveur
app.use((req,res) => {
    foo();
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
})



function setup(format) {
    const regexp = /:(\w+)/g;
    return function createLogger(req, res, next) {
        const str = format.replace(regexp, (match, property) => {
            return req[property]
        })
        console.log(str)
        next()
    }
}


app.use(setup({truc:"machin"}))


async function performQuery() {
    return await getConn().
    then(client => {return selectNow2(client)})
}

async function selectNow2(client) {
    console.log('1. connect & select now()')
    return await client.query('SELECT NOW() as jour')
        .then(res => {
        console.log(`result in selectNow2() ${res.rows[0].jour}`)
        return res.rows[0].jour
        })
        .catch(err => {
        console.log(err.stack)
        })
}

const pool = new Pool({
    user: 'dboutin',
    host: 'localhost',
    database: 'articles',
    password: '',
    port: 5432,
})

async function getConn() {
  // Promise chain for pg Pool client
  return await pool
    .connect()
    .then((conn) => {
      console.log("connection done")
      return conn
    })
    .catch(err => {
      console.log("\nclient.connect():", err.name);
      console.log(err)

      // iterate over the error object attributes
      for (item in err) {
        if (err[item] != undefined) {
          process.stdout.write(item + " - " + err[item] + " ");
        }
      }
    })
}

app.listen(3000)