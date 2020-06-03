const http = require('http')
const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./config.json'))
const Authorization = 'Basic ' + Buffer.from(config.USER + ':' + config.PASS).toString('base64')

let Api = {
	SendMsg(params, GroupId){
		params = JSON.stringify(params)
		// 构建请求体
		let options = {
			hostname: config.HOST,
			port: config.PORT,
			path: config.URI + 'qq='+ config.QQ + '&funcname=SendMsg&timeout=10',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': Authorization
			}
		}
		// 发送消息
		let req = http.request(options, (res)=>{
			res.setEncoding('utf8')
			let rawData = ''
			res.on('data', (chunk)=>{
				rawData += chunk.toString('utf-8')
			})
			res.on('end', () => {
				console.log('响应中已无数据')
			})
		})
		
		req.on('error', (e) => {
		  console.error(`请求遇到问题: ${e.message}`)
		})
		
		// 将数据写入请求主体。
		req.write(params)
		req.end()
	}
}


module.exports = Api