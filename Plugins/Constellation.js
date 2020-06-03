const https = require('https')
const cheerio = require('cheerio')
const Api = require('../SendMsg')
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
let Constellation = {
    get(GroupId, Content) {
        let keyWord = Content.substring(2).trim()
        https.get('https://www.xzw.com/fortune/' + map.get(keyWord) + '/', res => {
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
                        "toUser": GroupId,
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
        }).on('error', (e) => {
            console.error(`出现错误: ${e.message}`);
        })

    }
}
module.exports = Constellation