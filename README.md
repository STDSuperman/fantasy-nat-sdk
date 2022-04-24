# NAT-Tool
- 用来把本地server暴露在公网的sdk
- heartBeat还没做，下一版再做,配置上也无所谓
- **重要！！！如果第一次使用不成功，需要设置路由器的DMZ，将本机内网ip暴露出去，否则会被路由器拦截**
```js
let f = new FantasyNatService(
    {
        
        ...config, //这个默认配置先不用写，后面暴露出来给自定义配置
        localServerConfig: [
            {
                ip: '192.168.31.214',
                port: 8080,
                timeout: 5000,
                heartBeat: 2000,
                serverAlias: 'server1'
            },
            {
                ip: '192.168.31.214',
                port: 8081,
                timeout: 5000,
                heartBeat: 2000,
                serverAlias: 'server2'
            }
        ]
    }
)
//启动
f.run()
//连接到公网主机成功
f.on('connectRemoteSuc', (data) => {
    console.log('hi', data)
})
//各种报错
f.on('error', (err) => {
    console.log(err)
})
//启动本地中介server成功，连接到本地server成功
f.on('connect', () => {
    console.log('connect')
})
//最终都成功辣
f.on('final', (finalLog) => {
    console.log(finalLog)
})
