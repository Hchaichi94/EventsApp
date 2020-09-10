const express = require('express')
const boyParser = require('body-parser')

const app = express()
app.use(boyParser.json())

app.get('/', (req, res, next) => {
    res.send('hello')
})


app.listen(3000)