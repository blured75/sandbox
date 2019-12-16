const { Client } = require('pg')

// pools will use environment variables
// for connection information

const client = new Client({
    user: 'dboutin',
    host: 'localhost',
    database: 'articles',
    password: '',
    port: 5432,
})
client.connect()

// callback
client.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log("1. connect & select now()")
      console.log(res.rows[0])
    }
})

// promise
client
  .query('SELECT NOW() as now')
  .then(res => { 
    console.log("2. promise & select now()")
    console.log(res.rows[0]) 
  })
  .catch(e => console.error(e.stack))

let text = 'CREATE TABLE if not exists users(name text, email text)'

// Create table user
client.query(text, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log("3. Table users created (if needed)")
    }
})

text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
const values = ['brianc', 'brian.m.carlson@gmail.com']

for (let i = 0 ; i < 1000 ; i++) {
  // callback
  client.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        if (i == 0) {
          console.log("4. INSERT INTO users with callback")
          console.log(res.rows[0])
        } 
      }
  })
}

// promise
client
  .query(text, values)
  .then(res => {
    console.log("5. INSERT INTO users with promise")
    console.log(res.rows[0])
  })
  .catch(e => console.error(e.stack))

console.log("1")

// promise select * from users
const text_select = 'SELECT * from users'
client
  .query(text_select)
  .then(res => {
    console.log("5.1. SELECT * FROM users with promise")
    console.log(res.rows.length)
    console.log(res.rows[1])
  })
  .catch(e => console.error(e.stack))

console.log("2")

// promise select * from users
client
  .query(text_select)
  .then(res => {
    console.log("5.2. SELECT * FROM users with promise")
    console.log(res.rows.length)
    console.log(res.rows[1])
  })
  .catch(e => console.error(e.stack))

console.log("3")

// async/await
async function taMere() {
    try {
        const res = await client.query(text, values)
        console.log('6. INSERT INTO users with await')
        console.log(res.rows[0])
    } catch (err) {
        console.log(err.stack)
    }
}
taMere()

query = {
    text: 'INSERT INTO users(name, email) VALUES($1, $2)',
    values: ['brianc', 'brian.m.carlson@gmail.com'],
}
// callback
client.query(query, (err, res) => {
    if (err) {
        console.log(err.stack)
    } else {
        console.log("7. INSERT INTO users with callback and query object")
    }
})

query = {
  //text: 'SELECT $1::text as first_name, select $2::text as last_name',
  text: 'SELECT $1::text as first_name, $2::text as last_name',
  values: ['Brian','Ute'],
  rowMode: 'array',
}
// callback
client.query(query, (err, res) => {
  if (err) {
    console.log("erreur de query")
    console.log(err.stack)
  } else {
    console.log("8. SELECT $1 $2 with callback & params")
    console.log(res.fields.map(f => f.name)) // ['first_name', 'last_name']
    console.log(res.rows[0]) // ['Brian', 'Carlson']
    client.end()
  }
})

//client.end()