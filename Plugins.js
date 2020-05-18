const http = require('https')
const Api = require('./SendMsg')
const fs = require('fs')
const cheerio = require('cheerio')
const translate = require('google-translate-api')
let Plugins = {
	Aword(GroupId){
		http.get('https://v1.hitokoto.cn/', (res) => {
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
	},
	Morning(GroupId){
		let date = new Date()
		let time = date.getHours() + ":" + date.getMinutes()
		if(date.getHours() == 0) count = 0
		count++
		let welcomeArr = [
		        '要不要和朋友打局LOL',
		        '要不要和朋友打局王者荣耀',
		        '几天没见又更好看了呢😍',
		        '今天在群里吹水了吗',
		        '今天吃了什么好吃的呢',
		        '今天您微笑了吗😊',
		        '今天帮助别人解决问题了吗',
		        '准备吃些什么呢',
		        '周末要不要去看电影？'
		      ]
		let index = Math.floor((Math.random() * welcomeArr.length))
		if(date.getHours() < 9){
			let params = {
				  "toUser":GroupId,
				  "sendToType": 2,
				  "sendMsgType": "TextMsg",
				  "content": "现在时间" + time + ",你是第" +count+ "个起床的boy," + welcomeArr[index],
				  "groupid": 0,
				  "atUser": 0
			}
			Api.SendMsg(params, GroupId)
		}else if(date.getHours() < 12){
			let params = {
				  "toUser":GroupId,
				  "sendToType": 2,
				  "sendMsgType": "TextMsg",
				  "content": "上午好！今天又写了几个Bug🐞呢？中午准备吃些什么呢？" ,
				  "groupid": 0,
				  "atUser": 0
			}
			Api.SendMsg(params, GroupId)
		}else if(date.getHours() < 18){
			let params = {
				  "toUser":GroupId,
				  "sendToType": 2,
				  "sendMsgType": "TextMsg",
				  "content": "早个鸡儿！！已经" +time+ "了," + welcomeArr[index],
				  "groupid": 0,
				  "atUser": 0
			}
			Api.SendMsg(params, GroupId)
		}else if(date.getHours() < 22){
			let params = {
				  "toUser":GroupId,
				  "sendToType": 2,
				  "sendMsgType": "TextMsg",
				  "content": "晚上好！一天的工作终于结束了！不打算吃顿好的犒劳一下自己？[表情178]" ,
				  "groupid": 0,
				  "atUser": 0
			}
			Api.SendMsg(params, GroupId)
		}else if(date.getHours() < 24){
			let params = {
				  "toUser":GroupId,
				  "sendToType": 2,
				  "sendMsgType": "TextMsg",
				  "content": "已经很晚了，早点休息吧，还是说你的夜生活才刚刚开始？？[表情178]" ,
				  "groupid": 0,
				  "atUser": 0
			}
			Api.SendMsg(params, GroupId)
		}
		if(count == 1){
			setTimeout(function(){
				let params = {
					  "toUser":GroupId,
					  "sendToType": 2,
					  "sendMsgType": "VoiceMsg",
					  "content": "",
					  "groupid": 0,
					  "atUser": 0,
						"voiceUrl": "https://sound-ks1.cdn.missevan.com/aod/202005/15/1f2c3edc2557cf0161fd20dcfebbf0e5130012-128k.m4a",
						"voiceBase64Buf": ""
				}
				Api.SendMsg(params, GroupId)
			},2000)
		}
	},
	Baike(GroupId, Content){
		let keyWord = Content.substring(2)
		http.get('https://baike.baidu.com/item/' + keyWord, (res) => {
			const { statusCode } = res
			const contentType = res.headers['content-type']
			let error;
			if (statusCode !== 200) {
				error = new Error('请求失败\n' + `状态码: ${statusCode}`)
				let params = {
					  "toUser":GroupId,
					  "sendToType": 2,
					  "sendMsgType": "TextMsg",
					  "content": error.message,
					  "groupid": 0,
					  "atUser": 0
				}
				Api.SendMsg(params, GroupId)
			} 
			if (error) {
				console.error(error.message)
				// 消费响应数据来释放内存。
				res.resume()
				return
			}
			let html = ''
			// 数据分段 只要接收数据就会触发data事件  chunk：每次接收的数据片段
			res.on('data', (chunk)=>{
				html += chunk.toString('utf-8')
			})
			// 数据流传输完毕
			res.on('end', ()=>{
				console.log('数据传输完毕！')
				try {
					let $ =  cheerio.load(html)
					let content = ''
					$('div.lemma-summary > div.para').each((index, el)=>{
						content += $(el).text()
					})
					console.log(content)
					content = content.replace(/\[.*\]/g,'').replace(/[\r\n]/g,'')
					let params = {
						  "toUser":GroupId,
						  "sendToType": 2,
						  "sendMsgType": "TextMsg",
						  "content": content,
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
	},
	Translate(GroupId, Content){
		let keyWord = Content.substring(2)
		translate(keyWord, {to: 'zh-cn'}).then(res => {
		    console.log(res.text)
				let params = {
					  "toUser":GroupId,
					  "sendToType": 2,
					  "sendMsgType": "TextMsg",
					  "content": res.text,
					  "groupid": 0,
					  "atUser": 0
				}
				Api.SendMsg(params, GroupId)
		}).catch(err => {
		    console.error(err);
		});
	}
}

module.exports = Plugins