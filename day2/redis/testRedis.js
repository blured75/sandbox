const redis = require('redis')
const db = redis.createClient(6379, '127.0.0.1')

// Basic stuffs
db.on('connect', () => console.log('Redis client connected to server.'))
db.on('ready', () => console.log('Redis server is ready.'))
db.on('error', () => console.log('Redis error.', error))

db.set('color', 'red', err => {
    if (err) throw err
})
db.get('color', (err, value) => {
    if (err) throw err
    console.log(`Got ${value}`)
})

db.exists('color', (err, doesExists) => {
    if (err) throw err
    console.log(`color exists ${doesExists}`)
})

db.exists('wtf', (err, doesExists) => {
    if (err) throw err
    console.log(`wtf exists ${doesExists}`)
})

db.set('greeting', '𤽜', redis.print)
db.get('greeting', redis.print)

db.set('colors', 1, err => {
    if (err) throw err
})
db.get('colors', (err, value) => {
    if (err) throw err
    console.log(`Got ${value} as ${typeof value}`)
})

db.set('users', ['Alice', 'Bob'], redis.print)
db.get('users', redis.print)

db.set('users', JSON.stringify({nounours:'jsuis dans lbento'}))
db.get('users', (err, value) => {
    if (err) throw err
    let aUser = JSON.parse(value)

    console.log(aUser.nounours)
})

db.lpush('tasks', 'Paint in red', redis.print)
db.lpush('tasks', 'Paint in green', redis.print)
db.lrange('tasks', 0, -1, (err, items) => {
    if (err) throw err
    items.forEach(item => console.log(`${item}`))
})

db.sadd('admins', 'La chêvre', redis.print)
db.sadd('admins', 'ute', redis.print)
db.sadd('admins', 'Jul God', redis.print)
db.smembers('admins', (err, members) => {
    if (err) throw err
    console.log(members)
})


db.quit()