const app = require('connect')()
const { Pool } = require('pg')

app.use((req, res, next) => {
    performQuery().then(jour => {
        res.end(`Ta mere le ${jour}`)
    })
})

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