const io = require('socket.io-client')
const http = require('http')
const Plugin = require('./Plugins')
const fs = require('fs')
// 读取配置文件
const config = JSON.parse(fs.readFileSync('./config.json'))
const WS_API = "http://" + config.HOST
const QQ = config.QQ
const user = config.USER
const pass = config.PASS
const Authorization = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64')
const url = '/v1/RefreshKeys?qq='+ QQ
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
	}else{
		switch(Content){
			case '一言':
				await Plugin.Aword(FromGroupId)
				break
			case '早':
				await Plugin.Morning(FromGroupId,FromUserId)
				break
		}
		if(Content.indexOf("百科") == 0){
			Plugin.Baike(FromGroupId,Content)
		}
		if(Content.indexOf("翻译") == 0){
			Plugin.Translate(FromGroupId,Content)
		}
		if(Content.indexOf("翻英") == 0){
			Plugin.Translate2En(FromGroupId,Content)
		}
	}
})

socket.on('OnFriendMsgs', async data => {
	console.log('>>OnFriendMsgs', JSON.stringify(data, null, 2))
})

socket.on('OnEvents', async data => {
	console.log('>>OnEvents', JSON.stringify(data, null, 2))
})

// 刷新Key
function RefreshKeys(){
	// 构建请求体
	let options = {
		hostname: config.HOST,
		port: config.PORT,
		path: url,
		method: 'GET',
		headers: {
			'Authorization': Authorization
		}
	}
	// 发送请求
	let req = http.request(options, (res)=>{
		
		res.setEncoding('utf8')
		let rawData = ''
		res.on('data', (chunk)=>{
			rawData += chunk.toString('utf-8')
		})
		res.on('end', () => {
			let {Ret} = JSON.parse(rawData)
			if(Ret == 'ok'){
				console.log('心跳成功!')
			}
		})
	})
	
	req.on('error', (e) => {
		console.error(`请求遇到问题: ${e.message}`)
	})
	req.end()
}
// 刷新Key 每隔30s
setInterval(()=>{
	RefreshKeys()
},30000)
