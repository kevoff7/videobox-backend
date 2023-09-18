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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvents = exports.updateEvents = exports.publishedEvent = exports.createLikeEvent = exports.createEvents = exports.getEvents = void 0;
const db_1 = require("../db");
const parseVideoUrl_1 = require("../helpers/parseVideoUrl");
const getEvents = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield db_1.pool.query('SELECT * FROM videos');
        return res.status(200).json({
            ok: true,
            events: rows
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Please speak to a administrator'
        });
    }
});
exports.getEvents = getEvents;
const createEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { title, url } = req.body;
    try {
        const newUrl = (0, parseVideoUrl_1.parseVideoUrl)(url);
        const { rows } = yield db_1.pool.query('INSERT INTO videos (url, title,id) VALUES($1, $2, $3) RETURNING *', [newUrl, title, user.id]);
        return res.json({
            ok: true,
            event: rows[0],
            msg: [{ message: 'Correctly saved' }]
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Please speak to a administrator'
        });
    }
});
exports.createEvents = createEvents;
const createLikeEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { id } = req.params;
    try {
        const results = yield db_1.pool.query('SELECT * FROM users WHERE id = $1 AND $2 = ANY(liked_videos)', [user.id, id]);
        if (results.rows.length === 0) {
            try {
                const result = yield db_1.pool.query('UPDATE users SET liked_videos = array_append(liked_videos, $2) WHERE id = $1 RETURNING *', [user.id, id]);
                res.json({
                    ok: true,
                    likedVideos: result.rows[0].liked_videos,
                    msg: 'Saved in the list'
                });
            }
            catch (error) {
                res.status(500).json({
                    ok: false,
                    msg: 'Please speak to a administrator'
                });
            }
        }
        else {
            try {
                const result = yield db_1.pool.query('UPDATE users SET liked_videos = array_remove(liked_videos, $2) WHERE id = $1 RETURNING *', [user.id, id]);
                res.json({
                    ok: true,
                    likedVideos: result.rows[0].liked_videos,
                    msg: 'Deleted from the list'
                });
            }
            catch (error) {
                res.status(500).json({
                    ok: false,
                    msg: 'Please speak to a administrator'
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please speak to a administrator'
        });
    }
});
exports.createLikeEvent = createLikeEvent;
const publishedEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { id } = req.params;
    const { published, idUser } = req.body;
    try {
        const result = yield db_1.pool.query('SELECT * FROM videos WHERE id_video = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ ok: false, msg: [{ message: 'Video not found' }] });
        }
        if (idUser !== user.id) {
            return res.status(404).json({ ok: false, msg: [{ message: 'You do not have privileges for  this event' }] });
        }
        const results = yield db_1.pool.query('UPDATE videos SET published = $1 WHERE id_video = $2 RETURNING *', [published, id]);
        if (published) {
            return res.json({
                ok: true,
                video: results.rows[0],
                msg: [{ message: 'Correctly pusblished video ' }]
            });
        }
        if (!published) {
            return res.json({
                ok: true,
                video: results.rows[0],
                msg: [{ message: 'Video successfully unpublished' }]
            });
        }
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Please speak to a administrator'
        });
    }
});
exports.publishedEvent = publishedEvent;
const updateEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { id } = req.params;
    const { title, url, idUser } = req.body;
    try {
        if (idUser !== user.id) {
            res.status(401).json({
                ok: false,
                msg: 'You do not have privileges to edit this event'
            });
        }
        const newUrl = (0, parseVideoUrl_1.parseVideoUrl)(url);
        const results = yield db_1.pool.query('UPDATE videos SET url = $1, title = $2 WHERE id_video = $3 RETURNING *', [newUrl, title, id]);
        if (results.rows.length === 0) {
            return res.status(401).json({
                ok: false,
                msg: 'Video not found'
            });
        }
        return res.status(200).json({
            ok: true,
            video: results.rows[0],
            msg: [{ message: 'Event successfully edit' }]
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please speak to a administrator'
        });
    }
});
exports.updateEvents = updateEvents;
const deleteEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { id } = req.params;
    try {
        const evento = yield db_1.pool.query('SELECT * FROM videos WHERE id_video = $1', [id]);
        if (evento.rows.length === 0) {
            return res.status(401).json({
                ok: false,
                msg: 'Video not found'
            });
        }
        if (user.id !== evento.rows[0].id) {
            res.status(401).json({
                ok: false,
                msg: 'Please speak to a administrator'
            });
        }
        yield db_1.pool.query('DELETE FROM videos WHERE id_video = $1', [id]);
        res.status(200).json({
            ok: true,
            msg: [{ message: 'Correctly deleted' }]
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please speak to a administrator'
        });
    }
});
exports.deleteEvents = deleteEvents;
