const https = require('https')
const http = require('http')
const Api = require('./SendMsg')
const fs = require('fs')
const cheerio = require('cheerio')
const request = require('request')
const translate_open = require('google-translate-open-api').default
const qs = require('querystring')
const map = new Map ([
    ['白羊座','aries'],
    ['金牛座','taurus'],
    ['双子座','gemini'],
    ['巨蟹座','cancer'],
    ['狮子座','leo'],
    ['处女座','virgo'],
    ['天平座','libra'],
    ['天蝎座','scorpio'],
    ['射手座','sagittarius'],
    ['摩羯座','capricorn'],
    ['水瓶座','aquarius'],
    ['双鱼座','pisces']
])
let Users = []
let Plugins = {
	Aword(GroupId){
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
	},
	Morning(GroupId,UserId){
		console.log(Users)
		let flag = false
		// 防止重复问候
		if(Users.length != 0){
			for (let index in Users) {
				for (let index2 in Users[index].User) {
					if(Users[index].Group == GroupId && Users[index].User[index2] == UserId){
						let params = {
							  "toUser":GroupId,
							  "sendToType": 2,
							  "sendMsgType": "TextMsg",
							  "content": "你已经问候过了，请不要重复问候哦！",
							  "groupid": 0,
							  "atUser": UserId
						}
						Api.SendMsg(params, GroupId)
						flag = true
						break
					}
				}
			}
		}
		if(flag) return
		let yes = false
		if(Users.length == 0){
			let obj = {
			Group: GroupId,
			User: [UserId],
			Count: 0
		}
		Users.push(obj)
		}else{
			for (let index in Users) {
				if(Users[index].Group == GroupId){
					Users[index].User.push(UserId)
					yes = true
					break;
				}
			}
			console.log(yes)
			if(!yes){
				let obj = { 
					Group: GroupId,
					User: [UserId],
					Count: 0
				}
				Users.push(obj)	
			}
		}
		
		console.log(Users)
		let date = new Date()
		let time = date.toString().split(" ")[4]
		if(date.getHours() == 0) User = []
		let welcomeArr = [
		        '要不要和朋友打局LOL',
		        '要不要和朋友打局王者荣耀',
		        '几天没见又更好看了呢😍',
		        '今天在群里吹水了吗？',
		        '今天吃了什么好吃的呢',
		        '今天您微笑了吗😊',
		        '今天帮助别人解决问题了吗',
		        '来点色图',
		        '周末要不要去看电影？'
		      ]
		let index = Math.floor((Math.random() * welcomeArr.length))

		if(date.getHours() < 9){
			for (const index in Users) {
				if(Users[index].Group == GroupId){
					if( Users[index].Count == 0){
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
						},3000)
					}
					Users[index].Count++
					let params = {
						  "toUser":GroupId,
						  "sendToType": 2,
						  "sendMsgType": "TextMsg",
						  "content": "现在时间" + time + ",你是第" + Users[index].Count + "个起床的boy," + welcomeArr[index],
						  "groupid": 0,
						  "atUser": 0
					}
					Api.SendMsg(params, GroupId)
				}
			}
			
		}else if(date.getHours() < 12){
			let params = {
				  "toUser":GroupId,
				  "sendToType": 2,
				  "sendMsgType": "TextMsg",
				  "content": "上午好！今天又写了几个Bug🐞呢？中午准备吃些什么呢？" + welcomeArr[index] ,
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
				  "content": "已经很晚了，早点休息吧，还是说你的夜生活才刚刚开始？？[表情178]来3张色图先！！" ,
				  "groupid": 0,
				  "atUser": 0
			}
			Api.SendMsg(params, GroupId)
		}
	},
	Baike(GroupId, Content){
		let keyWord = Content.substring(2)
		keyWord = qs.escape(keyWord)
		// 获取重定向后的url
		var find_link = function(link, collback) {
			var f = function(link) {
				var options = {
					url: link,
					followRedirect: false,
					method: 'GET'
				}
		
				request(options, (error, response, body)=>{
					console.log(response.statusCode)
					if (response.statusCode == 301 || response.statusCode == 302) {
					    var location = response.headers.location;
					    console.log('location: ' + location)
					    f("https://baike.baidu.com" + location)
					} else {
					    collback(link)
					}
				})
			}
		
			f(link)
		}
		find_link("https://baike.baidu.com/item/" + keyWord, function(link) {
			https.get(link, (res) => {
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
		})
	},
	async Translate(GroupId, Content){
		let keyWord = Content.substring(2)
			let result = await translate_open(keyWord, {
			  tld: "cn",
			  to: "zh-CN"
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
	},
	async Translate2En(GroupId, Content){
		let keyWord = Content.substring(2)
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
	},
	History(GroupId){
		// windows
		// let date = new Date().toLocaleString().split(' ')[0].substring(4).replace(/-/g,'/')
		// linux/centos
		let date = new Date().toLocaleString().split('/')
		date = date[0] + '/' + date[1] + '/'
		// console.log(date)
		https.get('https://www.lssdjt.com/' + date, (res) => {
				const { statusCode } = res
				const contentType = res.headers['content-type']
				let error;
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
				res.on('data', (chunk)=>{
					html += chunk.toString('utf-8')
				})
				// 数据流传输完毕
				res.on('end', ()=>{
					console.log('数据传输完毕！')
					try {
						let $ =  cheerio.load(html)
						let content = ''
						$('body > div.w730.mt5.clearfix > div.l.w515 > div > div.main > ul.list.clearfix > li').each((index, el)=>{
							content += $(el).text().replace(/[\n\t]/g,'') + '\n'
						})
						console.log(content)
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
	Constellation(GroupId, Content){
		let keyWord = Content.substring(2)
		https.get('https://www.xzw.com/fortune/'+ map.get(keyWord) +'/', res => {
    const { statusCode } = res
    const contentType = res.headers['content-type']
    let error;
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
            let value = []
            let key = []
            let title = ''
            $('#view > div.c_main > div.top > strong').each((index, el) => {
                title = ($(el).text().replace(/[\n\t]/g, ''))
            })
            $('#view > div.c_main > div.c_box > div.c_cont strong').each((index, el) => {
                key.push($(el).text().replace(/[\n\t]/g, '') + '\n')
            })
            $('#view > div.c_main > div.c_box > div.c_cont span').each((index, el) => {
                value.push($(el).text().replace(/[\n\t]/g, '') + '\n')
            })
            let content = ''
            for (let index in key) {
                content += key[index] + value[index]
            }
			console.log(title + content)
			let params = {
				"toUser":GroupId,
				"sendToType": 2,
				"sendMsgType": "TextMsg",
				"content": title + '\n' + content,
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

module.exports = Plugins