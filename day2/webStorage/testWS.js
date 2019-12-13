const LocalStorage = require('node-localstorage').LocalStorage

const examplePreferences = {
    temperature: 'Celcius'
}
localStorage = new LocalStorage('bre')

localStorage.setItem('preferences', JSON.stringify(examplePreferences))
const preferences = localStorage.getItem('preferences')
console.log('Loaded preferences:', preferences)
