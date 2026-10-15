const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const { createWallet, getWallet } = require('../controllers/wallet.controller');

router.post('/create-wallet', requireAuth, createWallet);
router.get('/get-wallet', requireAuth, getWallet);

module.exports = router;