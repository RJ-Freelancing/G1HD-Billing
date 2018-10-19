import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import passport from './config/passport'
import userRoutes from './routes/userRoutes'


const app = express()

// MongoDB
mongoose.connect(process.env.MONGO_URL)
mongoose.set('debug', true)

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})

// Log all requests
app.use(morgan('dev'))

// Parse incoming requests with JSON payloads
app.use(express.json({limit: '10mb'}))

// Authenticate all routes except /auth
app.use('^(?!/auth)', passport.authenticate('jwt', { session: false }))

// Routes
app.use('/auth', userRoutes)


// Catch 404 Errors
app.use((req, res, next) => {
  const err = new Error('Route not found')
  err.status = 404
  next(err)
})

// Error handler function
app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({error: err.message})
})

// Start the server
const port = process.env.API_PORT
app.listen(port, () => console.log(`Server is listening on port ${port}`))