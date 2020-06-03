const translate_open = require('google-translate-open-api').default
const Api = require('../SendMsg')
let Translate2En = {
    async get(GroupId, Content){
		let keyWord = Content.substring(2).trim()
			let result = await translate_open(keyWord, {
			  tld: "cn",
			  to: "en"
			})
			let {data} = result
			console.log(data[0])
			let params = {
					"toUser":GroupId,
					"sendToType": 2,
					"sendMsgType": "TextMsg",
					"content": data[0],
					"groupid": 0,
					"atUser": 0
			}
			Api.SendMsg(params, GroupId)
	}
}
module.exports = Translate2En