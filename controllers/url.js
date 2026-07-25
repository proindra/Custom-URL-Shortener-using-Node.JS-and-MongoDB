const {nanoid} = require("nanoid");
const URL = require('../models/users');

async function handleGenerateShortURL(req, res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({error: "URL is required"});
    const shortId = nanoid(8);
    await URL.create({
        shortId: shortId,
        resdirectURL: body.url,
        visitHistory: [],
    });

    return res.json({Id: shortId});
}

module.exports = {
    handleGenerateShortURL,
};