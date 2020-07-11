const mongoose = require('mongoose')
const fs = require('fs')
const config = JSON.parse(fs.readFileSync('config.json'))
const mongodbUrl = config.MONGODBURL
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
},(err)=>{
  if(err){
    console.log(err)
    return
  }
  console.log('连接成功')
})

// 有账号密码
// mongoose.connect('mongodb://Test:Test@localhost/db1', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })

module.exports = mongoose