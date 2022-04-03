import { AskForPortsInfo } from '../config/defaultConfig';
export declare function tryCallFunction(timeout: number, func: Promise<AskForPortsInfo>): Promise<AskForPortsInfo>;
export declare function connectRemoteServer(host: string, port: number): Promise<AskForPortsInfo>;
export declare function createServer(exportsLocalPort: number, localServicePort: number, localServiceHost: string): Promise<Boolean>;
