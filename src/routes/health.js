const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
    res.success({"mongo": "ok", "redis": "ok"});
});

module.exports = router;