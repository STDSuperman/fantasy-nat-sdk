interface LocalServerConfig {
    ip: string;
    port: number;
    /**连接本地server超时时间 */
    timeout: number;
    /**连接本地server的心跳频率 */
    heartBeat?: number;
    /**本地server别名 */
    serverAlias: string;
    /**暴露的端口号 */
    natPort?: number;
}
interface DefaultConfig {
    /**远程公网主机ip */
    remoteServerIp: string;
    /**远程公网主机端口*/
    remoteServerPort: number;
    /**远程公网主机连接超时时间 */
    remoteServerConnectTimeout: number;
    /**本地server信息 */
    localServerConfig: Array<LocalServerConfig>;
}
interface AskForPortsInfo {
    localPort: number;
    exportPort: number;
    ipv4: string;
}
interface FinalLog {
    serverAlias: string;
    accessUrl: string;
}
declare const config: DefaultConfig;
export { config, DefaultConfig, AskForPortsInfo, LocalServerConfig, FinalLog };
