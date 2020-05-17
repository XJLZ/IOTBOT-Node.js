const io = require('socket.io-client')
const Plugin = require('./Plugins')
const fs = require('fs')
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
	if (MsgType == 'PicMsg') {
		let MsgDate = JSON.parse(Content)
		// Api.PicMsg(p)
		// console.log(MsgDate.GroupPic[0].Url)
	}else{
		switch(Content){
			case '一言':
				Plugin.Aword(FromGroupId)
				break
			case '早':
				Plugin.Morning(FromGroupId)
				break
		}
	}
	
	
})

socket.on('OnFriendMsgs', async data => {
	console.log('>>OnFriendMsgs', JSON.stringify(data, null, 2))
	let { FromUin, MsgType, Content } = data.CurrentPacket.Data
	if (MsgType !== 'TextMsg') return
	console.log()
	const params = {
		toUser: FromUin,
		sendToType: 1,
		sendMsgType: 'TextMsg',
		content: reply,
		groupid: 0,
		atUser: 0
	}
	const resp = await callApi('SendMsg', params)
	console.log('callApi.result', resp)
})

socket.on('OnEvents', async data => {
	console.log('>>OnEvents', JSON.stringify(data, null, 2))
})
