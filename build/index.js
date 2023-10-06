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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const database_1 = __importDefault(require("./database/database"));
const PORT = (_a = config_1.server.port) !== null && _a !== void 0 ? _a : 3000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.sync({ force: false });
            app_1.default.listen(PORT, () => {
                console.log(`Service running in port ${PORT}`);
            });
        }
        catch (error) {
            console.log('fallo la db');
        }
    });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
