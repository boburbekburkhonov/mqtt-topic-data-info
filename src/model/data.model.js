import { model, Schema } from "mongoose";

const dataScheme = new Schema({
  id: {
    type: String,
    required: true,
  },
  data_message: {
    type: String,
    required: true
  }
}, {
  collection: 'data'
})

export default model('data', dataScheme)