import mongoose, { Schema, model, models } from 'mongoose';

const transactionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['Saque', 'Depósito', 'Transferência'],
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    cpfOrigin: {
        type: String,
        required: false,
    },
    nameOrigin: {
        type: String,
        required: false,
    },
    cpfDest: {
        type: String,
        required: false,
    },
    nameDest: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Transaction = models.Transaction || model('Transaction', transactionSchema);
export default Transaction;
