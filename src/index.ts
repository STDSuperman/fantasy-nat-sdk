import EventEmitter from 'events';
import { DefaultConfig, config, AskForPortsInfo, LocalServerConfig, FinalLog, CustomConfig } from './config/defaultConfig'
import { tryCallFunction, connectRemoteServer, createServer } from './utils/utils'

interface FantasyNatService {
    on(event: 'connectRemoteSuc', listener: (ports: Array<AskForPortsInfo>) => void): this;
    on(event: 'error', listener: (error: string) => void): this;
    on(event: 'connect', listener: () => void): this;
    on(event: 'final', listener: (finalLog: FinalLog[]) => void): this;
}
class FantasyNatService extends EventEmitter {
    public readonly config: DefaultConfig;
    private exportPorts: Array<AskForPortsInfo> = [];
    constructor(props: CustomConfig) {
        super()
        this.config = {
            ...config,
            ...props
        }
        this.run()
    }
    public async run(): Promise<void> {
        try {
            await this._askForExportsPort()
            await this._connect();
            this._finalConsole()
        } catch (err) {
            console.log(err)
            return;
        }
    }
    /**
     * 批量申请对外暴露的端口
     * @returns 申请是否顺利完成
     */
    private async _askForExportsPort(): Promise<boolean> {
        if (!this.config.localServerConfig || !this.config.localServerConfig.length) {
            this.emit('error', '本地服务信息未配置!')
            return Promise.reject(false);
        }
        const p = this.config.localServerConfig.map(_ => {
            return tryCallFunction(this.config.remoteServerConnectTimeout, connectRemoteServer(this.config.remoteServerIp, this.config.remoteServerPort))
        })
        return new Promise((resolve, reject) => {
            Promise.all(p).then((res) => {
                this.exportPorts = res;
                this.emit('connectRemoteSuc', this.exportPorts)
                resolve(true)
            }, rej => {
                this.emit('error', rej)
                reject(false)
            })
        })

    }
    /**
     * 批量连接本地server
     * @returns 
     */
    private async _connect(): Promise<Boolean> {
        const p = this.exportPorts.map((item: AskForPortsInfo, index: number) => {
            const { ip, port } = this.config.localServerConfig[index]
            return createServer(item.localPort, port, ip)
        })
        return new Promise((resolve, reject) => {
            Promise.all(p).then(_ => {
                this.emit('connect')
                resolve(true)
            }, rej => {
                this.emit('error', rej)
                reject(false)
            })
        })

    }
    /**
     * 最终输出
     */
    private _finalConsole() {
        const finalLog: FinalLog[] = this.config.localServerConfig.map((item: LocalServerConfig, index: number) => {
            const exportItem = this.exportPorts[index]
            return {
                serverAlias: item.serverAlias,
                accessUrl: `http://${exportItem.ipv4}:${exportItem.exportPort}`
            }
        })
        this.emit('final', finalLog)
        console.log('operation success,click these url to show', finalLog)
    }

}
new FantasyNatService(
    {
        localServerConfig:
            [
                // {
                //     serverAlias: 'remote',
                //     ip: '192.168.31.214',
                //     port: 3389,
                //     timeout: 5000,
                //     heartBeat: 5000
                // },
                {
                    serverAlias: 'remote2',
                    ip: '192.168.31.214',
                    port: 8080
                }
            ]


    })
export {
    FantasyNatService
}