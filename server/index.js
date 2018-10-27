import express from 'express'
import helmet from 'helmet'
import logger from './_helpers/logger'
import mongoose from 'mongoose'
import passport from './_helpers/passport'
import userRoutes from './routes/userRoutes'
import exampleRoutes from './routes/exampleRoutes'
import authRoutes from './routes/authRoutes'
import clientRoutes from './routes/clientRoutes'


const app = express()
// MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
mongoose.set('debug', process.env.NODE_ENV==='development')
mongoose.set('useCreateIndex', true)

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})

// Log all requests and responses
if (process.env.NODE_ENV!=='testing') app.use(logger)

// Secure the app by setting various HTTP headers
app.use(helmet())

// Parse incoming requests with JSON payloads
app.use(express.json({limit: '10mb'}))

// Authenticate all routes except /auth
app.use('^(?!/api/auth)', passport.authenticate('jwt', { session: false }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
// app.use('/api/clients', clientRoutes)
app.use('/api/example', exampleRoutes)

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

// Export the app for use in tests
export default app