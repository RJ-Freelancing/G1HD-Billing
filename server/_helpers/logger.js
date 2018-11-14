import morgan from 'morgan'
import path from 'path'
import fs from 'fs'
import rfs from 'rotating-file-stream'


const filenameGenerator = () => {
  const dateiso = new Date().toISOString()
  const datestr = dateiso.substr(0, 10)
  const timestr = dateiso.substr(11, 8).replace(/:/g,'.')
  return `${datestr}_${timestr}.log`
}

// Ensure /logs directory exists
const logDirectory = path.join(__dirname, '/../logs')

// Direct stream to stdout in development
let logStream = process.stdout
let format = 'dev'

// Create a rotating write stream in production
if (process.env.NODE_ENV === 'development') {
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
  logStream = rfs(filenameGenerator, {
    interval: '7d', // rotate weekly
    path: logDirectory
  })
  format = 'combined'
}


export default morgan(format, { stream: logStream })