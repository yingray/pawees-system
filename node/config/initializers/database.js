import mongoose from 'mongoose'
import logger from 'winston'

module.exports = function(cb) {
  'use strict'
  // Initialize the component here then call the callback
  // More logic
  mongoose.Promise = global.Promise
  const db = mongoose.connect('mongodb://localhost:27017/pawees', {
    useMongoClient: true,
    /* other options */
  });
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function() {})
  // Return the call back
  cb(null, db)
  logger.info('[SERVER] Database connection ready')
}
