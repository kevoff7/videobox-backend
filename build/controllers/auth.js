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
const users_1 = require("../models/users");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, confirmedPassword } = req.body;
    try {
        const user = yield users_1.Users.findOne({
            where: {
                email
            }
        });
        if ((user === null || user === void 0 ? void 0 : user.dataValues.email) === email) {
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
        const newUser = yield users_1.Users.create({
            name, email, password: encryptedPassword
        }, { fields: ['name', 'email', 'password'] });
        const token = yield (0, jwt_1.default)(newUser.dataValues.id, newUser.dataValues.name);
        return res.status(201).json({
            ok: true,
            name: newUser.dataValues.name,
            id: newUser.dataValues.id,
            urlimage: newUser.dataValues.urlimage,
            follows: newUser.dataValues.follows,
            liked_videos: newUser.dataValues.liked_videos,
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
        const user = yield users_1.Users.findOne({
            where: {
                email
            }
        });
        if ((user === null || user === void 0 ? void 0 : user.dataValues.email) == null) {
            return res.status(400).json({
                ok: false,
                msg: [{ message: 'There is no user with email' }]
            });
        }
        const validPassword = bcryptjs_1.default.compareSync(password, user === null || user === void 0 ? void 0 : user.dataValues.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: [{ message: 'Password incorrect' }]
            });
        }
        const token = yield (0, jwt_1.default)(user === null || user === void 0 ? void 0 : user.dataValues.id, user === null || user === void 0 ? void 0 : user.dataValues.name);
        return res.status(201).json({
            ok: true,
            id: user === null || user === void 0 ? void 0 : user.dataValues.id,
            name: user === null || user === void 0 ? void 0 : user.dataValues.name,
            urlimage: user === null || user === void 0 ? void 0 : user.dataValues.urlimage,
            follows: user === null || user === void 0 ? void 0 : user.dataValues.follows,
            liked_videos: user === null || user === void 0 ? void 0 : user.dataValues.liked_videos,
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
    const result = yield users_1.Users.findOne({ where: { id } });
    return res.json({
        ok: true,
        id: result === null || result === void 0 ? void 0 : result.dataValues.id,
        name,
        urlimage: result === null || result === void 0 ? void 0 : result.dataValues.urlimage,
        follows: result === null || result === void 0 ? void 0 : result.dataValues.follows,
        liked_videos: result === null || result === void 0 ? void 0 : result.dataValues.liked_videos,
        token
    });
});
exports.revalidateJWT = revalidateJWT;
const addUrlImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { id } = req.params;
    const { url } = req.body;
    try {
        const updateEvent = yield users_1.Users.findByPk(id);
        if (updateEvent != null) {
            if (id !== String(user.id)) {
                return res.status(404).json({ ok: false, msg: [{ message: 'You do not have editing privileges for this event' }] });
            }
            updateEvent.urlimage = url;
            yield updateEvent.save();
        }
        else {
            return res.status(404).json({ ok: false, msg: [{ message: 'User not found' }] });
        }
        if (url === null) {
            return res.json({
                ok: true,
                img: updateEvent.dataValues.urlimage,
                msg: 'Correctly remove'
            });
        }
        return res.json({
            ok: true,
            img: updateEvent.dataValues.urlimage,
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
