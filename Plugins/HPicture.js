const Api = require('../SendMsg')
const Pixiv = require('./Mongodb/Pixiv');

let HPicture = {
    get(GroupId, Content, arr) {
        console.log(arr)
        if (arr[1]) {
            let num = Number(arr[1])
            console.log(num)
            if (num && num <= 3) {
                if (arr[2]) {
                    for (let i = 0; i < num; i++) {
			//setTimeout(function () {
				sendPic(GroupId,arr[2])
   			//}, 5000);
                    }
                }else{
                    sendPic(GroupId,false)
                }
            }

        }
    }
}

function sendPic(GroupId,tag) {
    console.log(tag);
    if(tag){
	tag = new RegExp(tag) //模糊查询参数
        Pixiv.find({ tags: tag }, (err, res) => {
					console.log(res.length)
            if (err) {
                console.log(err)
                return
            }else if (res.length === 0) {
							Pixiv.find({ "author.name": tag }, (err, res) => {
								console.log(res.length)
							    if (err) {
							        console.log(err)
							        return
							    }else if (res.length === 0) {
											msg(GroupId)
											return
							    }else{
										pic(GroupId,res)
									return
									}
							})
            }else{
							pic(GroupId,res)
						}
        })
    }else{
				msg(GroupId)
    }
}

function pic(GroupId,res){
    let index = Math.floor((Math.random() * res.length))
    let url = res[index].url
    url = url.replace("i.pximg.net","i.pixiv.cat")
    console.log(url);
    let params = {
        "toUser": GroupId,
        "sendToType": 2,
        "sendMsgType": "PicMsg",
        "content": "",
        "groupid": 0,
        "atUser": 0,
        "picUrl": url,
        "picBase64Buf": "",
        "fileMd5": ""
    }
    Api.SendMsg(params, GroupId)
}
function msg(GroupId){
    let params = {
        "toUser": GroupId,
        "sendToType": 2,
        "sendMsgType": "TextMsg",
        "content": "未收录该系列插画！",
        "groupid": 0,
        "atUser": 0
    }
    Api.SendMsg(params, GroupId)
}

module.exports = HPicture
