"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/resp", (_, res) => {
    console.log("pinged here!");
    res.send("pong");
});
app.listen(4000, () => {
    console.log(`Servicio corriendo en el puerto ${4000}`);
});
