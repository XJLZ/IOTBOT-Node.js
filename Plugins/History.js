const http = require('http')
const cheerio = require('cheerio')
const Api = require('../SendMsg')
let History = {
    get(GroupId) {
        let date = new Date()
        let day = date.getDay()
        let month = date.getMonth()
        if (day < 10) {
            day = "0" + day
        }
        if (month < 10) {
            month = "0" + (month + 1)
        }
        let url = 'http://www.people.com.cn/GB/historic/' + month + day
        console.log(url);
        http.get(url, (res) => {
            const { statusCode } = res
            const contentType = res.headers['content-type']
            let error;
            if (statusCode == 500 || statusCode == 404) {
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
                    $('body > center > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(4) > table > tbody > tr > td > a').each((index, el) => {
                        content += $(el).text().replace(/[\n\t]/g, '') + '\n'
                    })
                    console.log(content)
                    let params = {
                        "toUser": GroupId,
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
        }).on('error', (e) => {
            console.error(`出现错误: ${e.message}`);
        })
    }
}
module.exports = History