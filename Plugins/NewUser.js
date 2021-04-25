const Api = require('../SendMsg')
const { createCanvas, registerFont, loadImage } = require('canvas')
registerFont('./Plugins/utils/fonts/TechnoHideo.ttf', { family: 'Comic Sans' })
const canvas = createCanvas(350, 100)
const ctx = canvas.getContext('2d')

let NewUser = {
	get(GroupId, UserId, Code) {
		try {
			ctx.font = '65px "Comic Sans"'
			setTimeout(() => {
				loadImage('./Plugins/utils/background.png').then((image) => {
					ctx.drawImage(image, 0, 0, 350, 100)
					ctx.fillText(Code, 10, 70)
					ctx.beginPath()
					ctx.stroke()
					// console.log('<img src="' + canvas.toDataURL() + '"/>')
				})
			}, 1000)
			setTimeout(() => {
				let base64 = canvas.toDataURL().replace("data:image/png;base64,", "")
				// console.log(base64);
				let params = {
					"toUser": GroupId,
					"sendToType": 2,
					"sendMsgType": "PicMsg",
					"content": "[ATUSER(" + UserId + ")]请3分钟内验证！",
					"groupid": 0,
					"picBase64Buf": base64
				}
				Api.SendMsg(params, GroupId)
			}, 2000)
		} catch (e) {
			console.error(e.message);
		}

	}
}
module.exports = NewUser
