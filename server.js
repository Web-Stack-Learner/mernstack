const express = require('express')

const app = express()

const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })

const indexRouter = require('./router/index')

app.use(express.json())

//DATABASE
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (err) => {
  console.error(err)
})
db.once('open', () => {
  console.log('connected')
})

//Route
app.use('/', indexRouter)
app.get('/', (req, res) => {
  res.cookie('jwt', 'thapa')
  res.send('This Is From Server')
})

app.listen(process.env.PORT)
