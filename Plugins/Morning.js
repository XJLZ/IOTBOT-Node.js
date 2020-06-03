const Api = require('../SendMsg')
let Users = []
let Morning = {
    get(GroupId,UserId){
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
    }
}
module.exports = Morning