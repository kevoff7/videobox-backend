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
exports.addUrlImage = exports.revalidateJWT = exports.loginUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
const db_1 = require("../db");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, confirmedPassword } = req.body;
    try {
        const user = yield db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length !== 0) {
            return res.status(400).json({
                ok: false,
                msg: [{ message: 'A user exists with this email' }]
            });
        }
        if (password !== confirmedPassword) {
            return res.status(400).json({
                ok: false,
                msg: [{ message: 'Passwords are not the same' }]
            });
        }
        const salt = bcryptjs_1.default.genSaltSync();
        const encryptedPassword = bcryptjs_1.default.hashSync(password, salt);
        const { rows } = yield db_1.pool.query('INSERT INTO users (email, password, name) VALUES($1, $2, $3) RETURNING *', [email, encryptedPassword, name]);
        const token = yield (0, jwt_1.default)(rows[0].id, rows[0].name);
        return res.status(201).json({
            ok: true,
            name: rows[0].name,
            id: rows[0].id,
            urlimage: rows[0].urlimage,
            follows: rows[0].follows,
            liked_videos: rows[0].liked_videos,
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: [{ message: 'Please speak to an administrator' }]
        });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const { rows } = yield db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: [{ message: 'There is no user with email' }]
            });
        }
        const validPassword = bcryptjs_1.default.compareSync(password, rows[0].password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: [{ message: 'Password incorrect' }]
            });
        }
        const token = yield (0, jwt_1.default)(rows[0].id, rows[0].name);
        return res.status(201).json({
            ok: true,
            id: rows[0].id,
            name: rows[0].name,
            urlimage: rows[0].urlimage,
            follows: rows[0].follows,
            liked_videos: rows[0].liked_videos,
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: [{ message: 'Please speak to a administrator' }]
        });
    }
});
exports.loginUser = loginUser;
const revalidateJWT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name } = req.user;
    const token = yield (0, jwt_1.default)(id, name);
    const result = yield db_1.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.json({
        ok: true,
        id,
        name,
        urlimage: result.rows[0].urlimage,
        follows: result.rows[0].follows,
        liked_videos: result.rows[0].liked_videos,
        token
    });
});
exports.revalidateJWT = revalidateJWT;
const addUrlImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { id } = req.params;
    const { url } = req.body;
    try {
        const result = yield db_1.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ ok: false, msg: [{ message: 'User not found' }] });
        }
        if (id !== String(user.id)) {
            return res.status(404).json({ ok: false, msg: [{ message: 'You do not have editing privileges for this event' }] });
        }
        const updateEvent = yield db_1.pool.query('UPDATE users SET urlimage = $1 WHERE id = $2 RETURNING *', [url, id]);
        if (url === null) {
            return res.json({
                ok: true,
                img: updateEvent.rows[0].urlimage,
                msg: 'Correctly remove'
            });
        }
        return res.json({
            ok: true,
            img: updateEvent.rows[0].urlimage,
            msg: 'Corecctly saved'
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Please speak to a administrator'
        });
    }
});
exports.addUrlImage = addUrlImage;
