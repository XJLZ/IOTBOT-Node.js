const stringRandom = require('string-random');
const Api = require('../SendMsg')

let Welcome = {
	get(GroupId,UserId) {
		try {
			// 40000 正常
			// 40001 幻影
			// 40002 抖动
			// 40003 生日
			// 40004 爱你
			// 40005 征友
			console.log(UserId)
			let type = ["[秀图40000]","[秀图40001]","[秀图40002]","[秀图40003]","[秀图40004]","[秀图40005]"]
			let index = Math.floor(Math.random() * 6)
			console.log(type[index])
			let url = 'http://q1.qlogo.cn/g?b=qq&nk='+UserId+'&s=640'
			let params = {
				"toUser": GroupId,
				"sendToType": 2,
				"sendMsgType": "PicMsg",
				"content": type[index],
				"groupid": 0,
				"picUrl": url,
				"fileMd5": "",
				"atUser": UserId
			}
			Api.SendMsg(params, GroupId)
		} catch (e) {
			console.error(e.message);
		}
        
	}
}
module.exports = Welcome
