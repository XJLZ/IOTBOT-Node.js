const Pixiv = require('./Pixiv')

 Pixiv.find({ "author.name": "wlop" }, (err, res) => {
	 if(err){
		 console.log(err)
		 return
	 }
	 console.log(res)
 })