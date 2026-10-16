const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { googleCallbackSchema } = require("../validators/auth.validators");
const { googleAuth, googleCallback } = require("../controllers/auth.controllers");

router.get("/google", googleAuth);
router.post("/google/callback", validate(googleCallbackSchema), googleCallback);

module.exports = router;
