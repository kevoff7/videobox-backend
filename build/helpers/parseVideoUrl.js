"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVideoUrl = void 0;
const parseVideoUrl = (url) => {
    const newUrl = new URL(url);
    const pathNameUrl = newUrl.pathname.split('/');
    const extractedPart = pathNameUrl[pathNameUrl.length - 1];
    const urlClean = `https://www.youtube.com/embed/${extractedPart}${newUrl.search}`;
    return urlClean;
};
exports.parseVideoUrl = parseVideoUrl;
