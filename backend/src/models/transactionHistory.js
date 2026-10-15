const mongoose = require('mongoose');
const { Schema } = mongoose.Schema;

const transactionHistorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallets',
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    balanceBefore: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    balanceAfter: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    description: {
        type: String,
        required: true
    }

}, { timestamps: true, versionKey: false });

const TransactionHistory = mongoose.model('TransactionHistory', transactionHistorySchema);