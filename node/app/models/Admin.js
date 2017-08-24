import mongoose from 'mongoose'

const AdminSchema = new mongoose.Schema(
  {
    email: String
  },
  { collection: 'Admin' }
)

module.exports = mongoose.model('Admin', AdminSchema)
