"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const events_1 = __importDefault(require("./routes/events"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'https://video-box-kevoff.vercel.app',
    credentials: true
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/events', events_1.default);
app.get('*', (req, res) => {
    res.send('Api rest VideoBox');
});
const PORT = (_a = config_1.server.port) !== null && _a !== void 0 ? _a : 3000;
app.listen(PORT, () => {
    console.log(`Service running in port ${PORT}`);
});
