/// <reference types="node" />
import EventEmitter from 'events';
import { DefaultConfig, AskForPortsInfo, FinalLog } from './config/defaultConfig';
interface FantasyNatService {
    on(event: 'connectRemoteSuc', listener: (ports: Array<AskForPortsInfo>) => void): this;
    on(event: 'error', listener: (error: string) => void): this;
    on(event: 'connect', listener: () => void): this;
    on(event: 'final', listener: (finalLog: FinalLog[]) => void): this;
}
declare class FantasyNatService extends EventEmitter {
    readonly config: DefaultConfig;
    private exportPorts;
    private pipeTunnelSockets;
    constructor(props: DefaultConfig);
    run(): Promise<void>;
    /**
     * 批量申请对外暴露的端口
     * @returns 申请是否顺利完成
     */
    private _askForExportsPort;
    /**
     * 批量连接本地server
     * @returns
     */
    private _connect;
    /**
     * 最终输出
     */
    private _finalConsole;
}
export { FantasyNatService };
