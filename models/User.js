import mongoose from 'mongoose';
import uuidv4 from 'uuid/v4';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  status: String,
  name: String,
  email: String,
  phoneNumber: String,
  notes: [{
    _id: {
      type: String,
      default: () => uuidv4()
    },
    body: String,
    date: {
      type: Date,
      default: () => new Date()
    }
  }],
  notesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
