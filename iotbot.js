const io = require('socket.io-client')
const Plugin = require('./Middleware')
const fs = require('fs')
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
	let { FromGroupId, FromUserId, Content, MsgType } = data.CurrentPacket.Data
	if (MsgType == 'PicMsg') {
		let MsgDate = JSON.parse(Content)
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
		if (Content.indexOf("翻译") == 0) {
			await Plugin.Translate(FromGroupId, Content)
		}
		if(Content.indexOf("YSF") == 0){
			await Plugin.Yinfans(FromGroupId,Content)
		}
		if(Content.indexOf("HD") == 0){
			await Plugin.HdMovie(FromGroupId,Content)
		}
		if (Content.indexOf("运势") == 0) {
			await Plugin.Constellation(FromGroupId, Content)
		}
		if (Content.match(pattern)) {
			await Plugin.HPicture(FromGroupId, Content, Content.match(pattern))
		}
	}
})

socket.on('OnFriendMsgs', async data => {
	console.log('>>OnFriendMsgs', JSON.stringify(data, null, 2))
})

socket.on('OnEvents', async data => {
	console.log('>>OnEvents', JSON.stringify(data, null, 2))
})

function getConnect() {
	socket.emit('GetWebConn', '' + QQ, (data) => console.log('心跳成功!'))
}
// 保持连接 每隔30s
setInterval(() => {
	getConnect()
}, 30000)
