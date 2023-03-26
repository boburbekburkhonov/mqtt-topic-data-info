import { model, Schema, Types } from "mongoose";

const newScheme = new Schema({
  id: {
    type: String,
    required: true,
  },
  receive_message: {
    type: String,
    required: true
  }
}, {
  collection: 'new'
})

export default model('new', newScheme)