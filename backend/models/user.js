const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  passwordResetToken: { type: String },
  notes: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Note' }],
});

module.exports = mongoose.model('User', userSchema);
