const io = require('socket.io-client')
const Plugin = require('./Plugins')
const fs = require('fs')
// 读取配置文件
const config = JSON.parse(fs.readFileSync('./config.json'))
const WS_API = "http://" + config.HOST
const QQ = config.QQ
const user = config.USER
const pass = config.PASS
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
	let { FromGroupId, Content, MsgType } = data.CurrentPacket.Data
	// 处理图片信息
	if (MsgType == 'PicMsg') {
		let MsgDate = JSON.parse(Content)
		// console.log(MsgDate.GroupPic[0].Url)
	}else{
		switch(Content){
			case '一言':
				await Plugin.Aword(FromGroupId)
				break
			case '早':
				await Plugin.Morning(FromGroupId)
				break
		}
	}
})

socket.on('OnFriendMsgs', async data => {

})

socket.on('OnEvents', async data => {
	console.log('>>OnEvents', JSON.stringify(data, null, 2))
})
