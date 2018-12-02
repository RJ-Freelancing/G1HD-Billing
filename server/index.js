import express from 'express'
import helmet from 'helmet'
import { morganLogger, winstonLogger } from './_helpers/logger'
import mongoose from 'mongoose'
import cron from 'node-cron'
import userRoutes from './routes/userRoutes'
import transactionRoutes from './routes/transactionRoutes'
import authRoutes from './routes/authRoutes'
import clientRoutes from './routes/clientRoutes'
import ministraRoutes from './routes/ministraRoutes'
import configRoutes from './routes/configRoutes'
import { nightlyCronJob } from './_helpers/cronJob'

let isMaintenance = false

// Use bluebird promise to persist stack trace while using async/await
global.Promise=require('bluebird');

const app = express()

// Sentry: The request handler must be the first middleware on the app
export const Sentry = require('@sentry/node');
Sentry.init({ 
  dsn: process.env.SENTRY_DSN,  
  attachStacktrace: true,
  captureUnhandledRejections: true
});
app.use(Sentry.Handlers.requestHandler());

// MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
mongoose.set('debug', process.env.NODE_ENV === 'development')
mongoose.set('useCreateIndex', true)

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})

// Log all requests and responses
if (process.env.NODE_ENV !== 'test') app.use(morganLogger)

// Secure the app by setting various HTTP headers
app.use(helmet())

// Parse incoming requests with JSON payloads
app.use(express.json({ limit: '10mb' }))


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/ministra', ministraRoutes)
app.use('/api/config', configRoutes)

// Serve React Frontend at '/' url only in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'client')));
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });
}

// Catch 404 Errors
app.use((req, res, next) => {
  const err = new Error('Route not found')
  err.status = 404
  next(err)
})

// The error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler());

// Error handler function
app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ error: err.message })
})

//Maintenance Cron Job Runs everyday Night at 3.
cron.schedule("* * 1 * * *", function() {
  // isMaintenance = nightlyCronJob(isMaintenance)
}); 

// Start the server
const port = process.env.API_PORT
app.listen(port, () => console.log(`Server is listening on port ${port}`))

// Export the app for use in tests
export default app
