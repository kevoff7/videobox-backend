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
const parseVideoUrl_1 = require("../helpers/parseVideoUrl");
const videos_1 = require("../models/videos");
const users_1 = require("../models/users");
const getEvents = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield videos_1.Videos.findAll({
            attributes: ['id_video', 'url', 'title', 'published', 'id', 'createdAt'],
            order: [['id_video', 'ASC']]
        });
        const allVideos = videos.map(item => item.dataValues);
        return res.status(200).json({
            ok: true,
            events: allVideos
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
        const newVideo = yield videos_1.Videos.create({
            title, url: newUrl, id: user.id
        }, { fields: ['title', 'url', 'id'] });
        return res.json({
            ok: true,
            event: newVideo.dataValues,
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
        const results = yield users_1.Users.findOne({
            where: {
                id: user.id
            }
        });
        if ((results === null || results === void 0 ? void 0 : results.dataValues.liked_videos) == null || results.dataValues.liked_videos.includes(Number(id)) === false) {
            try {
                if ((results === null || results === void 0 ? void 0 : results.dataValues.liked_videos) == null) {
                    results.liked_videos = [Number(id)];
                }
                else {
                    results.liked_videos = [...results.dataValues.liked_videos, Number(id)];
                }
                yield results.save();
                res.json({
                    ok: true,
                    likedVideos: results.dataValues.liked_videos,
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
                const likedVideos = results.liked_videos.filter((vid) => (vid !== Number(id)));
                if (likedVideos.length === 0) {
                    results.liked_videos = null;
                }
                else {
                    results.liked_videos = likedVideos;
                }
                yield results.save();
                res.json({
                    ok: true,
                    likedVideos: results.dataValues.liked_videos,
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
        const result = yield videos_1.Videos.findOne({
            where: {
                id_video: id
            }
        });
        if (result == null) {
            return res.status(404).json({ ok: false, msg: [{ message: 'Video not found' }] });
        }
        if (idUser !== user.id) {
            return res.status(404).json({ ok: false, msg: [{ message: 'You do not have privileges for  this event' }] });
        }
        result.published = published;
        yield result.save();
        if (published) {
            return res.json({
                ok: true,
                video: result.dataValues,
                msg: [{ message: 'Correctly pusblished video' }]
            });
        }
        if (!published) {
            return res.json({
                ok: true,
                video: result.dataValues,
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
        const results = yield videos_1.Videos.findOne({
            where: { id_video: id }
        });
        if (results != null) {
            results.url = newUrl;
            results.title = title;
            yield results.save();
        }
        else {
            return res.status(401).json({
                ok: false,
                msg: 'Video not found'
            });
        }
        return res.status(200).json({
            ok: true,
            video: results.dataValues,
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
        const evento = yield videos_1.Videos.findOne({
            where: { id_video: id }
        });
        if (evento == null) {
            return res.status(401).json({
                ok: false,
                msg: 'Video not found'
            });
        }
        if (user.id !== evento.dataValues.id) {
            res.status(401).json({
                ok: false,
                msg: 'You do not have privileges to edit this event'
            });
        }
        yield videos_1.Videos.destroy({
            where: { id_video: id }
        });
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
