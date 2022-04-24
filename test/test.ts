import { CustomConfig, FantasyNatService } from '../src/index'
const config: CustomConfig = {
    localServerConfig: [
        {
            serverAlias: 'server1',
            ip: '192.168.31.214',
            port: 8080
        },
        {
            serverAlias: 'serverDll',
            ip: "192.168.31.214",
            port: 5500
        }
    ]
}
new FantasyNatService(config).run()