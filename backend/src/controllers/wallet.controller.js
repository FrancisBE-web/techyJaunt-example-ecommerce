const Wallets = require('../models/wallets.models');
const User = require('../models/user.models');



const createWallet = async (req, res) => {
    const { userId } = req.user;
    try {
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // account number should be generate from user.phone - remove th first zero 
        const accountNumber = user.phone.replace(/^0/, '');
        const wallet = await Wallets.create({ userId, accountNumber: accountNumber });
        return res.status(201).json({ message: 'Wallet created successfully', wallet });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getWallet = async (req, res) => {
    const { userId } = req.user;
    try {
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const wallet = await Wallets.findById(userId);
        return res.status(200).json({ message: 'Wallet fetched successfully', wallet });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


module.exports = { createWallet, getWallet };