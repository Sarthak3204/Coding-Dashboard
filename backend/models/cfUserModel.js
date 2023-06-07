import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  handle: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});


const CFUser = mongoose.model("CFUser", userSchema);

export default CFUser;