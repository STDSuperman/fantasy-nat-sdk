
interface LocalServerConfig {
    ip: string
    port: number
    /**连接本地server超时时间 */
    timeout?: number
    /**连接本地server的心跳频率 */
    heartBeat?: number
    /**本地server别名 */
    serverAlias: string
}
interface CustomConfig {
    /**本地server信息 */
    localServerConfig: Array<LocalServerConfig>
}

interface DefaultConfig extends CustomConfig {
    /**远程公网主机ip */
    remoteServerIp: string
    /**远程公网主机端口*/
    remoteServerPort: number
    /**远程公网主机连接超时时间 */
    remoteServerConnectTimeout: number

}

interface AskForPortsInfo {
    localPort: number;
    exportPort: number;
    ipv4: string;
}
interface FinalLog {
    serverAlias: string
    accessUrl: string
}
const config: DefaultConfig = {
    remoteServerIp: '124.222.17.161',
    remoteServerPort: 9600,
    remoteServerConnectTimeout: 3000,
    localServerConfig: []
}

export {
    config,
    DefaultConfig,
    AskForPortsInfo,
    LocalServerConfig,
    FinalLog,
    CustomConfig
}