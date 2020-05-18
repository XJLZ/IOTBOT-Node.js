# IOTBOT-Node.js
## 开始

1.首先的有node环境，没有的自行百度安装。  
2.有环境了，先 npm install 把依赖下载下来。  
3.由于我使用了Nginx方向代理，所以又得安装Nginx,emmm....这是出于安全性所以才弄的。   
4.在nginx的配置文件下的这几个地方添加：  

![YRC9Ff.png](https://s1.ax1x.com/2020/05/17/YRC9Ff.png)
```
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
```

![YRCklQ.png](https://s1.ax1x.com/2020/05/17/YRCklQ.png)


    location /socket.io/ {
        if ($http_authorization != "这里是你的令牌") {
        	return 401;
    	}
        proxy_pass http://localhost:8888;
        proxy_redirect    off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Origin "";
    }
    
    location /v1/ {
    	proxy_http_version 1.1;
        if ($http_authorization != "这里是你的令牌") {
    		return 401;
    	}
        proxy_pass http://localhost:8888;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
PS:令牌生成:

```
let Authorization = 'Basic ' + Buffer.from('root':'root').toString('base64')
```
俩root可随意  
如果嫌麻烦的话可以不用配置以上，代码应该不用修改，配置文件的USER和PASS别空着就行。。。虽然我没试过，但感觉行得通233333  


5.然后在IOTBOT的CoreConf.conf文件下进行如下配置

```
Port = "127.0.0.1:8888"
```

PS：如果是阿里云或者其他云服务器，记得在安全组中添加端口，防火墙也要把端口打开

6.使用Google翻译的话，在node_modules目录下找到google-translate-api和google-translate-token这两个文件夹，将里面index.js里的几个https://translate.google.com全部替换为 https://translate.google.cn，就能不翻墙使用这个谷歌翻译api了，跟cn网站那个是同一个服务器。需要替换域名的两个文件路径为：node_modules/google-translate-api/index.js 和 node_modules/google-translate-token/index.js  

7.最后记得在config.json文件中填写配置

## 启动

在经过上述配置无误后就可以启动啦：

```
npm start
```

## 开发

在Plugins文件中，按照例子进行开发即可。。。。

## 相关文章

❤️以下文章或项目排名不分先后 🙏感谢贡献 ❤️

- **😄 [实现一个“人工智能”QQ机器人！](https://segmentfault.com/a/1190000021259760)**
- **😄 [实现一个“人工智能”QQ机器人！续](https://segmentfault.com/a/1190000021350469)**
