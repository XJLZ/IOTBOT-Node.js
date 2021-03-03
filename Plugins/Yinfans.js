const https = require('https')
const cheerio = require('cheerio')
const Api = require('../SendMsg')
let Yinfans = {
	async get(GroupId, Content) {
		let keyWord = Content.substring(3).trim()
		console.log(keyWord);
		https.get('https://www.yinfans.me/?s=' + keyWord, (res) => {
			const { statusCode } = res
			const contentType = res.headers['content-type']
			let error;
			console.log(statusCode);
			if (statusCode !== 200) {
				error = new Error('请求失败\n' + `状态码: ${statusCode}`)
			}
			if (error) {
				console.error(error.message)
				// 消费响应数据来释放内存。
				res.resume()
				return
			}
			let html = ''
			// 数据分段 只要接收数据就会触发data事件  chunk：每次接收的数据片段
			res.on('data', (chunk) => {
				html += chunk.toString('utf-8')
			})
			// 数据流传输完毕
			res.on('end', () => {
				console.log('数据传输完毕！')
				try {
					let $ = cheerio.load(html)
					let content = ''
					$('#post_container > li').each((index, el) => {
						let a = cheerio.load($(el).toString())
						// console.log(a.html());
						let href = a('body > li > div.thumbnail > a').attr('href')
						let title = a('body > li > div.thumbnail > a').attr('title')
						let img = a('body > li > div.thumbnail > a > img').attr('src').replace("-yfss3", "")
						console.log(href);
						console.log(title);
						console.log(img);
						let params = {
							"toUser": GroupId,
							"sendToType": 2,
							"sendMsgType": "PicMsg",
							"content": href + '\n' + title,
							"groupid": 0,
							"atUser": 0,
							"picUrl": img,
							"picBase64Buf": "",
							"fileMd5": ""
						}
						Api.SendMsg(params, GroupId)
					})
					// console.log(content)
				} catch (e) {
					console.error(e.message);
				}
			})
		}).on('error', (e) => {
			console.error(`出现错误: ${e.message}`);
		})

	}
}
module.exports = Yinfans