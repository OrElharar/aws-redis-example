// getPhotosFromRedis
const express = require("express");
const redisClient = require("../db/redis");
const { getPhotosFromRedis } = require("../middlewares/redis");
const flickerSearchFetcher = require("../utils/flickerSearchFetcher");

const router = new express.Router();

router.get("/get-search-suggestions/:key", async (req, res) => {
    const searchValue = req.params.key
    try {
        const suggestions = await redisClient.keysAsync(`search:*${searchValue}*`);
        if (suggestions == null) {
            return res.send([]);
        }
        const suggestionsArr = suggestions.map(suggestion => suggestion.split(":")[1])
        return res.send(suggestionsArr);
    } catch (err) {
        console.log(err);
    }
})

router.get("/search-photos/:key", getPhotosFromRedis, async (req, res) => {
    const searchValue = req.params.key
    try {
        req.photos = await flickerSearchFetcher(searchValue)
        if (req.photos?.length > 0) {
            redisClient.setexAsync(
                "search:" + searchValue,
                300,
                JSON.stringify(req.photos)
            );
            res.send(req.photos)
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})


module.exports = router