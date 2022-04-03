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
exports.createServer = exports.connectRemoteServer = exports.tryCallFunction = void 0;
const net_1 = __importDefault(require("net"));
function tryCallFunction(timeout, func) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = new Promise((_, reject) => {
            setTimeout(() => {
                reject('');
            }, (timeout));
        });
        return Promise.race([func, t]);
    });
}
exports.tryCallFunction = tryCallFunction;
function connectRemoteServer(host, port) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const conn = net_1.default.createConnection({
                host: host,
                port: port
            });
            conn.on('connect', () => {
                conn.write('sun');
            });
            conn.on('data', (data) => {
                const result = JSON.parse(data.toString());
                resolve({
                    localPort: conn.localPort || 0,
                    exportPort: Number(result.exportPort),
                    ipv4: result.ipv4
                });
            });
            conn.on('error', (err) => {
                reject(err);
            });
        });
    });
}
exports.connectRemoteServer = connectRemoteServer;
function createServer(exportsLocalPort, localServicePort, localServiceHost) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const server = net_1.default.createServer((s) => {
                const conn = net_1.default.connect({
                    port: localServicePort,
                    host: localServiceHost
                }, () => {
                    conn.on('data', (data) => {
                        s.write(data);
                    });
                });
                s.on('data', (data) => {
                    conn.write(data);
                });
            }).listen(exportsLocalPort);
            server.on('listening', () => {
                resolve(true);
            });
            server.on('error', (err) => {
                reject(err);
            });
        });
    });
}
exports.createServer = createServer;
net_1.default.Socket;
