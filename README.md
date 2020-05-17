# IOTBOT-Node.js
## 开始

1.首先的有node环境，没有的自行百度安装
2.有环境了，先 npm install 把依赖下载下来
3.由于我使用了Nginx方向代理，所以又得安装Nginx,emmm....这是出于安全性所以才弄的。
4.在nginx的配置文件下的这几个地方添加：

![1589710180346](C:\Users\Admin\AppData\Roaming\Typora\typora-user-images\1589710180346.png)

```
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
```

![1589710223166](C:\Users\Admin\AppData\Roaming\Typora\typora-user-images\1589710223166.png)



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

5.然后在IOTBOT的CoreConf.conf文件下进行如下配置

```
Port = "127.0.0.1:8888"
```

PS：如果是阿里云或者其他云服务器，记得在安全组中添加端口，防火墙也要把端口打开

## 启动

在经过上述配置无误后就可以启动啦：

```
npm start
```

