const { Pool ,Client } = require('pg')

// pools will use environment variables
// for connection information

const pool = new Pool({
    user: 'dboutin',
    host: 'localhost',
    database: 'articles',
    password: '',
    port: 5432,
})

let client 

async function getConn() {
  // Promise chain for pg Pool client
  client = await pool
    .connect()
    .then((turlutte) => {
      console.log("connection done")
      return turlutte
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

    console.log("returning client")

    return client
}

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