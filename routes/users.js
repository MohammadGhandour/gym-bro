const express = require("express");
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const router = express.Router();

router.post('/signup', userCtrl.singUp);
router.post('/login', userCtrl.login);
router.get("/:userId", auth, userCtrl.getUser);

module.exports = router;
