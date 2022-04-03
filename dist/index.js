"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FantasyNatService = void 0;
const events_1 = __importDefault(require("events"));
const defaultConfig_1 = require("./config/defaultConfig");
const utils_1 = require("./utils/utils");
class FantasyNatService extends events_1.default {
    constructor(props) {
        super();
        this.exportPorts = [];
        this.pipeTunnelSockets = [];
        this.config = Object.assign(Object.assign({}, defaultConfig_1.config), props);
        this.run();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._askForExportsPort();
                yield this._connect();
                this._finalConsole();
            }
            catch (err) {
                console.log(err);
                return;
            }
        });
    }
    /**
     * 批量申请对外暴露的端口
     * @returns 申请是否顺利完成
     */
    _askForExportsPort() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.localServerConfig || !this.config.localServerConfig.length) {
                this.emit('error', '本地服务信息未配置!');
                return Promise.reject(false);
            }
            const p = this.config.localServerConfig.map(_ => {
                return (0, utils_1.tryCallFunction)(this.config.remoteServerConnectTimeout, (0, utils_1.connectRemoteServer)(this.config.remoteServerIp, this.config.remoteServerPort));
            });
            return new Promise((resolve, reject) => {
                Promise.all(p).then((res) => {
                    this.exportPorts = res;
                    this.emit('connectRemoteSuc', this.exportPorts);
                    resolve(true);
                }, rej => {
                    this.emit('error', rej);
                    reject(false);
                });
            });
        });
    }
    /**
     * 批量连接本地server
     * @returns
     */
    _connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const p = this.exportPorts.map((item, index) => {
                const { ip, port } = this.config.localServerConfig[index];
                return (0, utils_1.createServer)(item.localPort, port, ip);
            });
            return new Promise((resolve, reject) => {
                Promise.all(p).then(_ => {
                    this.emit('connect');
                    resolve(true);
                }, rej => {
                    this.emit('error', rej);
                    reject(false);
                });
            });
        });
    }
    /**
     * 最终输出
     */
    _finalConsole() {
        const finalLog = this.config.localServerConfig.map((item, index) => {
            const exportItem = this.exportPorts[index];
            return {
                serverAlias: item.serverAlias,
                accessUrl: `http://${exportItem.ipv4}:${exportItem.exportPort}`
            };
        });
        this.emit('final', finalLog);
        console.log('operation success,click these url to show', finalLog);
    }
}
exports.FantasyNatService = FantasyNatService;
