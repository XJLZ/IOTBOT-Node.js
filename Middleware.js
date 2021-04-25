const Aword = require('./Plugins/AWord')
const Morning = require('./Plugins/Morning')
const Baike = require('./Plugins/Baike')
const Yinfans = require('./Plugins/Yinfans')
const HdMovie = require('./Plugins/HdMovie')
const History = require('./Plugins/History')
const Constellation = require('./Plugins/Constellation')
const HPicture = require('./Plugins/HPicture');
const Setu = require('./Plugins/Setu')
const Authors = require('./Plugins/Authors')
const RevokePic = require('./Plugins/RevokePic')
const NewUser = require('./Plugins/NewUser')
const Welcome = require('./Plugins/Welcome')
let Plugins = {
	Authors(GroupId) {
		Authors.get(GroupId)
	},
	Aword(GroupId) {
		Aword.get(GroupId)
	},
	Setu(GroupId) {
		Setu.get(GroupId)
	},
	Morning(GroupId, UserId) {
		Morning.get(GroupId, UserId)
	},
	Baike(GroupId, Content) {
		Baike.get(GroupId, Content)
	},
	Yinfans(GroupId, Content) {
		Yinfans.get(GroupId, Content)
	},
	HdMovie(GroupId, Content) {
		HdMovie.get(GroupId, Content)
	},
	History(GroupId) {
		History.get(GroupId)
	},
	Constellation(GroupId, Content) {
		Constellation.get(GroupId, Content)
	},
	HPicture(GroupId, Content, arr) {
		HPicture.get(GroupId, Content, arr)
	},
	RevokePic(GroupId, MsgSeq, MsgRandom) {
		RevokePic.get(GroupId, MsgSeq, MsgRandom)
	},
	Welcome(GroupId,UserId) {
		Welcome.get(GroupId,UserId)
	},
	NewUser(GroupId,UserId,Code) {
		NewUser.get(GroupId,UserId,Code)
	}
}

module.exports = Plugins