import express from 'express'
import helmet from 'helmet'
import path from 'path'
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
import configRepo from './models/configModel'


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


// Maintenance
app.use('/maintenance', express.static(path.join(__dirname, 'maintenance')))
app.all('*', async function(req, res, next) { 
  winstonLogger.info("Running checkMaintenance Operation.") 
  const isCronRunning = await configRepo.findOne({ configName : "runningCron" })
  if (isCronRunning.configValue) return res.sendFile(path.join(__dirname, 'maintenance', 'index.html'))
  next() 
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/ministra', ministraRoutes)
app.use('/api/config', configRoutes)

// Serve React Frontend at '/' url only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client')));
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });
}

// Swagger Documentation
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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


// Get Maintenance Time
const cronStartTime = process.env.MAINTENANCE_START_TIME
const cronStartHour = parseInt(cronStartTime.substr(0,2))
const cronStartMins = parseInt(cronStartTime.substr(2, 3))

//Maintenance Cron Job Runs everyday Night at 3.
const cronStr = "0 " + (cronStartMins) + " " + cronStartHour + " * * *"
cron.schedule(cronStr, function() {
  nightlyCronJob()
}); 

// Start the server
const port = process.env.API_PORT
app.listen(port, () => console.log(`Server is listening on port ${port}`))

// Export the app for use in tests
export default app
