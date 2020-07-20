const Api = require('../SendMsg')
const Pixiv = require('./Mongodb/Pixiv');

let HPicture = {
    get(GroupId) {
        Pixiv.aggregate([
            { $group: { _id : '$author.name', count: { $sum : 1 } } },
            { $match: { count: { $gt : 1} } }
          ],(err,res)=>{
            console.log(res)
            let params = {
                "toUser": GroupId,
                "sendToType": 2,
                "sendMsgType": "TextMsg",
                "content": res,
                "groupid": 0,
                "atUser": 0
            }
            Api.SendMsg(params, GroupId)
          })
    }
        
}
module.exports = Collection