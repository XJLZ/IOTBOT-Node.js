const https = require('https')
const Api = require('../SendMsg')
let AWord = {
    get(GroupId){
        https.get('https://v1.hitokoto.cn/', (res) => {
			const { statusCode } = res
			const contentType = res.headers['content-type']
			let error;
			if (statusCode !== 200) {
				error = new Error('请求失败\n' + `状态码: ${statusCode}`)
			} else if (!/^application\/json/.test(contentType)) {
				error = new Error('无效的 content-type.\n' + 	`期望的是 application/json 但接收到的是 ${contentType}`)
			}
			if (error) {
				console.error(error.message)
				// 消费响应数据来释放内存。
				res.resume()
				return
			}
			let rawData = ''
			// 数据分段 只要接收数据就会触发data事件  chunk：每次接收的数据片段
			res.on('data', (chunk)=>{
				rawData += chunk.toString('utf-8')
			})
			// 数据流传输完毕
			res.on('end', ()=>{
				console.log('数据传输完毕！')
				try {
					let parsedData = JSON.parse(rawData)
					let hitokoto = parsedData.hitokoto
					let from = parsedData.from
					let params = {
						  "toUser":GroupId,
						  "sendToType": 2,
						  "sendMsgType": "TextMsg",
						  "content": hitokoto + '\n------' + from,
						  "groupid": 0,
						  "atUser": 0
					}
					Api.SendMsg(params, GroupId)
				} catch (e) {
					console.error(e.message);
				}
			})
		}).on('error', (e)=>{
				console.error(`出现错误: ${e.message}`);
		})
    }
}
module.exports = AWord