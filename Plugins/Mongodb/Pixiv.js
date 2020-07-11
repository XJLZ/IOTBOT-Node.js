const mongoose = require('./db')

const PixivSchema = mongoose.Schema({
  pid: {
    type: Number
  },
  title: {
    type: String
  },
  author: {
    type: Object
  },
  url: {
    type: String
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  tags: {
    type: Array
  }
})


const PixivModel = mongoose.model("Pixiv", PixivSchema, "pixiv")

module.exports = PixivModel