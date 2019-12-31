const app = require('connect')()
const { Pool } = require('pg')
const compression = require('compression')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const errorHandler = require('./errorHandler')

app.use(errorHandler)

app.use(compression())
app.use(cookieSession({ keys: ['secret1', 'secret2'] }))
app.use(bodyParser.urlencoded({extended: false}))

app.use('/favicon.ico', function barMiddleware(req, res, next) {
    console.log("favicon.ico asked stopping there")
})

app.use('/', (req, res, next) => {
    performQuery().then(jour => {
        res.end(`Nous sommes le ${jour}`)
    })
})

app.use(setup({truc:"machin"}))

function setup(format) {
    const regexp = /:(\w+)/g
    return function createLogger(req, res, next) {
        const str = format.replace(regexp, (match, property) => {
            return req[property]
        })
        console.log(str)
        next()
    }
}


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
    host: 'db',
    port: 5432
})

async function getConn() {
  console.log(process.env)
  // Promise chain for pg Pool client
  let retry = 5
  let conn2

    while (retry) {
        try {
            conn2 = await pool
                    .connect()
                    .then((conn) => {
                        console.log("connection done")
                        return conn
                    })
                    .catch(err => {
                        console.log("\nclient.connect():", err.name)
                        console.log(err)

                        // iterate over the error object attributes
                        for (item in err) {
                            if (err[item] != undefined) {
                                process.stdout.write(item + " - " + err[item] + " ")
                            }
                        }
                    })
            break
        }
        catch (err) {
            console.log(err)
            retries -= 1
            console.log(`retries left ${retries}`)
            // Wait for 5 second
            await new Promise(res => setTimeout(res, 5000))
        }

    }

  return conn2
}

app.listen(3000)