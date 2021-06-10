const io = require('socket.io-client')
const Plugin = require('./Middleware')
const fs = require('fs')
const random = require('string-random')
const Api = require('./SendMsg')
let NewUsers = new Map()
// 读取配置文件
const config = JSON.parse(fs.readFileSync('./config.json'))
const WS_API = "http://" + config.HOST
const QQ = config.QQ
const user = config.USER
const pass = config.PASS
const pattern = config.PATTERN
const Authorization = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64')
const socket = io(WS_API, {
	transports: ['websocket'],
	extraHeaders: {
		Authorization
	}
})

socket.on('connect', e => {
	console.log('WS已连接')
	socket.emit('GetWebConn', '' + QQ, (data) => console.log(data))
})

socket.on('disconnect', e => console.log('WS已断开', e))

socket.on('OnGroupMsgs', async data => {
	console.log('>>OnGroupMsgs', JSON.stringify(data, null, 2))
	let { FromGroupId, FromUserId, Content, MsgType, MsgSeq, MsgRandom } = data.CurrentPacket.Data
	if (MsgType == 'PicMsg') {
		//if(FromUserId == 1468557975 && FromGroupId != 578111062 && Content != null){
		//await setTimeout(() => {
		//	 Plugin.RevokePic(FromGroupId, MsgSeq,MsgRandom);
		//  }, 20000);
		//}
		// let MsgDate = JSON.parse(Content)
		// console.log(MsgDate.GroupPic[0].Url)
	} else {
		switch (Content) {
			//case '18':
			//	await Plugin.Setu(FromGroupId)
			//	break
			//case '色图':
			//	await Plugin.Aword(FromGroupId)
			//	break
			case '早':
				await Plugin.Morning(FromGroupId, FromUserId)
				break
			case '历史上的今天':
				await Plugin.History(FromGroupId)
				break
			case '作者':
				await Plugin.Authors(FromGroupId)
				break
		}
		if (Content.indexOf("百科") == 0) {
			await Plugin.Baike(FromGroupId, Content)
		}
		if (Content.indexOf("运势") == 0) {
			await Plugin.Constellation(FromGroupId, Content)
		}
		if (Content.match(pattern)) {
			await Plugin.HPicture(FromGroupId, Content, Content.match(pattern))
		}
		if (NewUsers.get(FromUserId) == Content) {
			await Plugin.Welcome(FromGroupId, FromUserId)
			NewUsers.delete(FromUserId)
		}
		if (NewUsers.has(FromUserId) != null && Content == '看不清') {
			const Code = random(6, { letters: false })
			NewUsers.set(FromUserId, Code)
			console.log(NewUsers)
			await Plugin.NewUser(FromGroupId, FromUserId, Code)
		}
	}
})

socket.on('OnFriendMsgs', async data => {
	console.log('>>OnFriendMsgs', JSON.stringify(data, null, 2))
})

socket.on('OnEvents', async data => {
	console.log('>>OnEvents', JSON.stringify(data, null, 2))
	let { EventData, EventName, EventMsg } = data.CurrentPacket.Data
	if (EventName == 'ON_EVENT_GROUP_JOIN') {
		let UserId = EventData.UserID
		let GroupId = EventMsg.FromUin
		const Code = random(6, { letters: false })
		NewUsers.set(UserId, Code)
		console.log(NewUsers)
		await Plugin.NewUser(GroupId, UserId, Code)
		setTimeout(() => {
			if (NewUsers.has(UserId)) {
				// 踢人
				let params = {
					"toUser": GroupId,
					"sendToType": 2,
					"sendMsgType": "TextMsg",
					"content": "[ATUSER(" + UserId + ")]由于您没有及时验证，将立即将你移除该群！",
					"groupid": 0,
					"atUser": 0
				}
				Api.SendMsg(params, GroupId)
				setTimeout(() => { Api.RemoveAway(GroupId, UserId) }, 5000)

			}
		}, 1000 * 60 * 3)
	}
})

function getConnect() {
	socket.emit('GetWebConn', '' + QQ, (data) => console.log('心跳成功!'))
}
// 保持连接 每隔30s
setInterval(() => {
	getConnect()
}, 30000)
