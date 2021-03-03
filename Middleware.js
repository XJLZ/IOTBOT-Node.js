const Aword = require('./Plugins/AWord')
const Morning = require('./Plugins/Morning')
const Baike = require('./Plugins/Baike')
const Yinfans = require('./Plugins/Yinfans')
const History = require('./Plugins/History')
const Constellation = require('./Plugins/Constellation')
const HPicture = require('./Plugins/HPicture');
const Setu = require('./Plugins/Setu')
const Authors = require('./Plugins/Authors')

let Plugins = {
	Authors(GroupId){
		Authors.get(GroupId)
	},
	Aword(GroupId){
		Aword.get(GroupId)
	},
	Setu(GroupId){
		Setu.get(GroupId)
	},
	Morning(GroupId,UserId){
		Morning.get(GroupId,UserId)
	},
	Baike(GroupId, Content){
		Baike.get(GroupId, Content)
	},
	Yinfans(GroupId, Content){
		Yinfans.get(GroupId,Content)
	},
	History(GroupId){
		History.get(GroupId)
	},
	Constellation(GroupId, Content){
		Constellation.get(GroupId,Content)
	},
	HPicture(GroupId, Content, arr){
		HPicture.get(GroupId,Content,arr)
	}
}

module.exports = Plugins