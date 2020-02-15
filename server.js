const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const path = require('path')

require('dotenv').config()

const authRouter = require('./router/authRouter')
const appRouter = require('./router/appRouter')
const { authorized} = require('./auth/auth')
const passport = require('passport')


// establishing the I/O port
const PORT = process.env.PORT || 4567

// initializing the express app
const app = express()

// configure middleware
app.use(logger('dev'))
app.use(cors())

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
// Static hosting for built files
app.use(express.static(path.join(__dirname, './client/build')));

app.use('/auth', authRouter)
app.use('/app',  authorized, appRouter)
app.use(passport.initialize())


app.get('/', async (request, response) => {
  try {
    response.json({message: 'Welcome to Express Auth App!'})
  } catch (e) {
    response.status(e.status).json({ message: e.status }) 
  }
})

// In production, any request that doesn't match a previous route
// should send the front-end application, which will handle the route.
if (process.env.NODE_ENV == "production") {
  app.use('*', (req, res) => res.sendFile(path.join(__dirname, './client/build', "index.html")));
}


app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message})
})

 app.listen(PORT, () => console.log(`App is up and running listening on port ${PORT}`))
