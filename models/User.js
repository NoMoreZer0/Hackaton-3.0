const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    unique_string: {
      type: String,
      required: false
    },
    is_confirmed: {
      type: Boolean,
      required: false
    }
  }
)

const model = mongoose.model('UserSchema', userSchema);

module.exports = model