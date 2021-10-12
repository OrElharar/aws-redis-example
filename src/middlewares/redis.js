const redisClient = require("../db/redis");

const getPhotosFromRedis = async (req, res, next) => {
    try {
        const photos = await redisClient.getAsync("search:" + req.params.key);
        if (photos != null) {
            res.send(photos);
        }
        else {
            next()
        }
    } catch (err) {
        console.log({ err });
    }
}

module.exports = {
    getPhotosFromRedis
}