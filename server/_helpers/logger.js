import morgan from 'morgan'
import path from 'path'
import fs from 'fs'
import rfs from 'rotating-file-stream'
import winston from 'winston'

const logLevel = process.env.LOG_LEVEL

const filenameGenerator = () => {
  const dateiso = new Date().toISOString()
  const datestr = dateiso.substr(0, 10)
  const timestr = dateiso.substr(11, 8).replace(/:/g,'.')
  return `${datestr}_${timestr}.log`
}

// Ensure /logs directory exists
const rootLogDir = path.join(__dirname, '/../logs')
fs.existsSync(rootLogDir) || fs.mkdirSync(rootLogDir)
const logDirectoryInfo = path.join(__dirname, '/../logs/info')
fs.existsSync(logDirectoryInfo) || fs.mkdirSync(logDirectoryInfo)
const logDirectoryCron = path.join(__dirname, '/../logs/cron')
fs.existsSync(logDirectoryCron) || fs.mkdirSync(logDirectoryCron)

// Enable winston logging for levels of logging
export const winstonLogger = winston.createLogger({
  level: logLevel,
  format: winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  transports: [
    new winston.transports.Console({
      format : winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    })
  ]
})

// Disable winston logging on console for production
if (process.env.NODE_ENV === 'production') {
  winstonLogger.clear()
  winstonLogger.add(new winston.transports.File({ 
    format : winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
    filename: logDirectoryInfo+'/'+filenameGenerator()
  }))
}

// Winston logging for Cron
export const winstonLoggerCron = winston.createLogger({
  level: logLevel,
  format: winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  transports: [
    new winston.transports.Console({ 
      format : winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    })
  ]
})

// Disable winston logging on console for production
if (process.env.NODE_ENV === 'production') {
  winstonLogger.clear()
  winstonLoggerCron.add(new winston.transports.File({
    format : winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
    filename: logDirectoryCron+'/'+filenameGenerator()
  }))
}

// Direct stream to stdout in development
let logStream = process.stdout
let format = 'dev'

// Create a rotating write stream in production
if (process.env.NODE_ENV === 'production') {
  logStream = rfs(filenameGenerator(), {
    interval: '7d', // rotate weekly
    path: logDirectoryInfo
  })
  format = 'combined'
}

export const morganLogger = morgan(format, { stream: logStream })
