const Api = require('../SendMsg')
let RevokePic = {
    get(GroupId, MsgSeq, MsgRandom) {
        try {
            let params = {
                "GroupID": GroupId,
                "MsgSeq": MsgSeq,
                "MsgRandom": MsgRandom
            }
            Api.Revoke(params)
        } catch (e) {
            console.error(e.message);
        }
    }
}
module.exports = RevokePic
