const express = require("express")
const User = require("../models/User")
const router = express.Router()

router.post("/", (req, res) => {
    const user = User(req.body)
    console.log(user)
    user.save()
    res.send(user)
})

module.exports = router