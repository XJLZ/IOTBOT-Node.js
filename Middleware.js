const Aword = require('./Plugins/AWord')
const Morning = require('./Plugins/Morning')
const Baike = require('./Plugins/Baike')
const Translate = require('./Plugins/Translate')
const Translate2En = require('./Plugins/Translate2En')
const History = require('./Plugins/History')
const Constellation = require('./Plugins/Constellation')
const HPicture = require('./Plugins/HPicture');
const Collection = require('./Plugins/Collection');

let Plugins = {
	Aword(GroupId){
		Aword.get(GroupId)
	},
	Morning(GroupId,UserId){
		Morning.get(GroupId,UserId)
	},
	Baike(GroupId, Content){
		Baike.get(GroupId, Content)
	},
	Translate(GroupId, Content){
		Translate.get(GroupId,Content)
	},
	Translate2En(GroupId, Content){
		Translate2En.get(GroupId,Content)
	},
	History(GroupId){
		History.get(GroupId)
	},
	Constellation(GroupId, Content){
		Constellation.get(GroupId,Content)
	},
	HPicture(GroupId, Content, arr){
		HPicture.get(GroupId,Content,arr)
	},
	Collection(GroupId){
		Collection.get(GroupId)
	}
}

module.exports = Plugins