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
                        sendPic(GroupId,arr[2])
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
        Pixiv.find({ tags: tag }, (err, res) => {
            if (err) {
                console.log(err)
                return
            }
						console.log("tags1\n",'-------'+res.length+'------------')
            if (res.length === 0) {
							console.log('==============')
                Pixiv.find({ "author.name": tag }, (err, res) => {
										console.log("name\n",'-------'+res.length+'------------')
                    if (err) {
                        console.log(err)
                        return
                    }
                    if (res.length === 0) {
												msg(GroupId)
												return
                    }
                    pic(GroupId,res)
										return
                })
            }
					pic(GroupId,res)
        })
    }else{
				msg(GroupId)
    }
}

function pic(GroupId,res){
    let index = Math.floor((Math.random() * res.length))
    console.log(res[index].url);
    let params = {
        "toUser": GroupId,
        "sendToType": 2,
        "sendMsgType": "PicMsg",
        "content": "",
        "groupid": 0,
        "atUser": 0,
        "picUrl": res[index].url,
        "picBase64Buf": "",
        "fileMd5": ""
    }
    Api.SendMsg(params, GroupId)
}
function msg(GroupId){
    let params = {
        "toUser": GroupId,
        "sendToType": 2,
        "sendMsgType": "PicMsg",
        "content": "未收录该系列插画！",
        "groupid": 0,
        "atUser": 0
    }
    Api.SendMsg(params, GroupId)
}

module.exports = HPicture
